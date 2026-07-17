// ─────────────────────────────────────────────────────────────────────────────
// Shared booking-creation logic, used by three server paths:
//   • POST /api/book            — unpaid reserve (POA rooms / Stripe not live)
//   • POST /api/book/confirm    — after returning from Stripe Checkout
//   • POST /api/book/stripe-webhook — Stripe's server-to-server confirmation
// The paid paths are idempotent on stripeSessionId so a webhook + return-trip
// for the same session can never double-book.
// ─────────────────────────────────────────────────────────────────────────────
import type { BookableResource } from '@/data/bookable';
import { BOOKABLE_RESOURCES } from '@/data/bookable';
import { getBookableResources, rndConfigured, rndInsert, rndRpc, rndSelect, rndUpdate } from './rnd';
import { longDate, overlaps, timeLabel, toDec } from './booking';

export const ALL_DAY_DISCOUNT = 0.3; // 30% off all-day public bookings

type RndBooking = {
  reference?: string;
  resourceName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  stripeSessionId?: string;
};
type RndMember = { name?: string; email?: string; companyId?: string };
type RndTenant = { businessName?: string; email?: string };

export type BookingInput = {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  title: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export type BookingRecord = {
  reference: string;
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
};

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Normalise a raw JSON body into a BookingInput (shared by book + checkout). */
export function parseBookingInput(body: Record<string, unknown>): BookingInput {
  return {
    resourceId: str(body.resourceId),
    date: str(body.date),
    startTime: str(body.startTime),
    endTime: str(body.endTime),
    allDay: body.allDay === true,
    title: str(body.title),
    description: str(body.description),
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    company: str(body.company),
  };
}

export function makeReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/** Ex-GST fee for a slot (all-day bookings get the public discount). */
export function computeFee(resource: BookableResource, input: Pick<BookingInput, 'startTime' | 'endTime' | 'allDay'>): number {
  const hours = toDec(input.endTime) - toDec(input.startTime);
  const raw = resource.rate != null ? resource.rate * hours : 0;
  return Math.round(raw * (input.allDay ? 1 - ALL_DAY_DISCOUNT : 1) * 100) / 100;
}

/** Basic shape validation shared by /api/book and /api/book/checkout. */
export function validateInput(input: BookingInput): string | null {
  if (!input.name || !input.email) return 'Name and email are required.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return 'Invalid date.';
  if (toDec(input.endTime) <= toDec(input.startTime)) return 'End time must be after the start time.';
  return null;
}

// Rooms exist under two id schemes: live RND ids (e.g. `hx_mr_sky`) and the
// static fallback ids (e.g. `room-sky`). If the client's resource fetch and a
// server-side fetch don't agree (one of them fell back), ids won't match —
// bridge them by room keyword instead of failing with "Unknown room".
const ROOM_KEYS = ['sky', 'earth', 'west', 'east', 'north', 'south', 'central', 'sun', 'moon', 'podcast', 'media'];

export async function resolveResource(resourceId: string): Promise<BookableResource | null> {
  const resources = await getBookableResources();
  const direct = resources.find((r) => r.id === resourceId);
  if (direct) return direct;

  const staticMatch = BOOKABLE_RESOURCES.find((r) => r.id === resourceId);
  const haystack = `${resourceId} ${staticMatch?.name ?? ''}`.toLowerCase();
  const key = ROOM_KEYS.find((k) => haystack.includes(k));
  if (key) {
    const candidates = resources.filter((r) => `${r.id} ${r.name}`.toLowerCase().includes(key));
    if (candidates.length === 1) return candidates[0];
  }
  // Last resort: the static entry itself (correct name + rate; the RND admin
  // can re-link the booking if the id isn't a live space id).
  return staticMatch ?? null;
}

/** True when another non-cancelled booking overlaps the requested slot. */
export async function hasConflict(input: Pick<BookingInput, 'resourceId' | 'date' | 'startTime' | 'endTime'>): Promise<boolean> {
  const rows = await rndSelect<RndBooking>(
    'bookings',
    `select=data&data->>date=eq.${input.date}&data->>resourceId=eq.${encodeURIComponent(input.resourceId)}`
  );
  return rows
    .map((r) => r.data)
    .some(
      (b) =>
        b &&
        b.status !== 'Cancelled' &&
        overlaps(input.startTime, input.endTime, b.startTime ?? '', b.endTime ?? '')
    );
}

/** A paid session that was already written (webhook vs return-trip race). */
export async function findBookingBySession(sessionId: string): Promise<BookingRecord | null> {
  const rows = await rndSelect<RndBooking>(
    'bookings',
    `select=data&data->>stripeSessionId=eq.${encodeURIComponent(sessionId)}`
  );
  const b = rows[0]?.data;
  if (!b) return null;
  return {
    reference: b.reference ?? '',
    resourceName: b.resourceName ?? '',
    date: b.date ?? '',
    startTime: b.startTime ?? '',
    endTime: b.endTime ?? '',
  };
}

/**
 * Find-or-create the drop-in CLIENT (tenants table) for a public booker, and
 * make sure their member record points at it. Every website booking gets a
 * client so the invoice below has someone to bill.
 */
async function upsertClient(
  input: Pick<BookingInput, 'name' | 'email' | 'phone' | 'company'>,
  now: string
): Promise<string> {
  // Reuse: a client with this email (drop-in repeat visitor or existing tenant).
  const existing = await rndSelect<RndTenant>(
    'tenants',
    `select=id&data->>email=ilike.${encodeURIComponent(input.email)}`
  );
  if (existing.length) return existing[0].id;

  // Or the company their member profile already belongs to.
  const members = await rndSelect<RndMember>(
    'members',
    `select=id,data&data->>email=ilike.${encodeURIComponent(input.email)}`
  );
  const linked = members.map((m) => m.data?.companyId).find(Boolean);
  if (linked) return linked as string;

  const tenantId = `t${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await rndInsert('tenants', [
    {
      id: tenantId,
      data: {
        id: tenantId,
        businessName: input.company || input.name,
        contactName: input.name,
        email: input.email,
        phone: input.phone,
        status: 'Active',
        source: 'website-booking',
        createdAt: now.split('T')[0],
      },
      updated_at: now,
    },
  ]);
  return tenantId;
}

async function upsertMember(
  input: Pick<BookingInput, 'name' | 'email' | 'phone'>,
  companyId: string,
  now: string
): Promise<string> {
  try {
    const existing = await rndSelect<RndMember>(
      'members',
      `select=id,data&data->>email=ilike.${encodeURIComponent(input.email)}`
    );
    if (existing.length) {
      const m = existing[0];
      // Adopt the drop-in client on members that aren't linked to a company yet.
      if (companyId && !m.data?.companyId) {
        await rndUpdate('members', m.id, { ...m.data, companyId }).catch(() => {});
      }
      return m.id;
    }
    const memberId = `m${Date.now()}`;
    await rndInsert('members', [
      {
        id: memberId,
        data: {
          id: memberId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          companyId,
          status: 'Drop In',
          credits: 0,
          createdAt: now.split('T')[0],
          source: 'website-booking',
        },
        updated_at: now,
      },
    ]);
    return memberId;
  } catch (e) {
    console.error('member upsert failed (continuing)', e);
    return '';
  }
}

/**
 * Raise the platform invoice for a website booking so it shows in Billing.
 * unitPrice is ex-GST (the platform adds 10% via vatEnabled — the inc-GST
 * total matches what Stripe charged). Stripe-paid bookings record the payment
 * (method 'stripe', same shape as api/stripe/webhook.js) and land as paid;
 * unpaid reserves land as pending, due on the booking date.
 */
async function createBookingInvoice(args: {
  input: BookingInput;
  resource: BookableResource;
  fee: number;
  payment: PaymentDetails;
  tenantId: string;
  bookingId: string;
  reference: string;
  now: string;
}): Promise<string> {
  const { input, resource, fee, payment, tenantId, bookingId, reference, now } = args;
  const today = now.split('T')[0];
  const monthStart = `${input.date.slice(0, 7)}-01`;
  const monthEnd = new Date(Number(input.date.slice(0, 4)), Number(input.date.slice(5, 7)), 0)
    .toISOString()
    .split('T')[0];
  const paid = payment.paidBy === 'stripe';
  const number = (await rndRpc<string>('next_invoice_number')) || `INV-W${Date.now()}`;

  const invoiceId = `inv${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const invoice = {
    id: invoiceId,
    number,
    tenantId,
    leaseId: null,
    bookingId,
    status: paid ? 'paid' : 'pending',
    sentStatus: 'not_sent',
    source: 'website-booking',
    issueDate: today,
    // Unpaid reserves are due on the booking day (or today if booked same-day).
    dueDate: paid || input.date < today ? today : input.date,
    periodStart: monthStart,
    periodEnd: monthEnd,
    reference,
    paymentMethod: '',
    discountPct: 0,
    vatEnabled: true,
    xeroSync: false,
    isProrated: false,
    currency: 'AUD',
    invoiceType: null,
    lineItems: [
      {
        id: `${invoiceId}_li0`,
        description: `${resource.name} Booking — ${input.date} ${input.startTime}–${input.endTime} (ref ${reference})`,
        revenueAccount: 'Additional Services',
        unitPrice: fee,
        qty: 1,
        discountPct: 0,
      },
    ],
    payments: paid
      ? [
          {
            id: `pay_stripe_${(payment.stripeSessionId ?? invoiceId).slice(-10)}`,
            amount: payment.paidAmount ?? Math.round(fee * 1.1 * 100) / 100,
            date: today,
            method: 'stripe',
            reference: payment.stripePaymentIntentId ?? payment.stripeSessionId ?? '',
          },
        ]
      : [],
    comments: [],
    creditNoteForId: null,
    createdAt: today,
  };
  await rndInsert('invoices', [{ id: invoiceId, data: invoice, updated_at: now }]);
  return invoiceId;
}

export type PaymentDetails = {
  /** RND paidBy tag — 'unpaid' (reserve) or 'stripe' (paid online). */
  paidBy: 'unpaid' | 'stripe';
  /** Booking status to write — paid bookings are Confirmed. */
  status: 'Pending' | 'Confirmed';
  /** Amount actually charged, inc. GST (paid bookings only). */
  paidAmount?: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  /** Extra note appended to the booking (e.g. paid-but-clashed flag). */
  noteSuffix?: string;
};

/** Write the booking (and member) into the RND. Assumes validation happened. */
export async function insertBooking(
  input: BookingInput,
  resource: BookableResource,
  fee: number,
  payment: PaymentDetails
): Promise<BookingRecord> {
  const now = new Date().toISOString();
  const reference = makeReference();

  // Drop-in client + member profile — both best-effort: a hiccup here must
  // never lose a booking (especially one that's already been paid).
  let tenantId = '';
  try {
    tenantId = await upsertClient(input, now);
  } catch (e) {
    console.error('client upsert failed (continuing)', e);
  }
  const memberId = await upsertMember(input, tenantId, now);

  const id = `bk${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  // Platform invoice — paid (Stripe) or pending (unpaid reserve). Free/POA
  // slots (fee 0) have nothing to bill.
  let invoiceId = '';
  if (tenantId && fee > 0) {
    try {
      invoiceId = await createBookingInvoice({ input, resource, fee, payment, tenantId, bookingId: id, reference, now });
    } catch (e) {
      console.error('booking invoice failed (continuing)', e);
    }
  }

  const notes = [input.description, payment.noteSuffix].filter(Boolean).join('\n');
  const booking = {
    id,
    reference,
    resourceId: input.resourceId,
    resourceName: resource.name,
    memberId,
    memberName: input.name,
    companyId: tenantId,
    companyName: input.company,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    allDay: input.allDay,
    status: payment.status,
    source: 'Website',
    paidBy: payment.paidBy,
    creditsUsed: 0,
    coins: 0,
    fee,
    ...(payment.paidAmount != null ? { paidAmount: payment.paidAmount } : {}),
    ...(payment.stripeSessionId ? { stripeSessionId: payment.stripeSessionId } : {}),
    ...(payment.stripePaymentIntentId ? { stripePaymentIntentId: payment.stripePaymentIntentId } : {}),
    ...(invoiceId ? { invoiceId } : {}),
    repeat: 'none',
    title: input.title || `${resource.name} — ${input.name}`,
    notes,
    createdAt: now,
    createdBy: 'Website',
  };
  await rndInsert('bookings', [{ id, data: booking, updated_at: now }]);

  return {
    reference,
    resourceName: resource.name,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
  };
}

export { rndConfigured };

// ── confirmation email (best-effort; callers .catch(() => {})) ───────────────

export async function sendConfirmation(b: {
  resource: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  reference: string;
  fee: number;
  /** inc-GST amount charged via Stripe; undefined = unpaid reserve */
  paidAmount?: number;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const paid = b.paidAmount != null;
  const when = `${longDate(new Date(b.date + 'T00:00:00'))}, ${timeLabel(b.startTime)} – ${timeLabel(b.endTime)}`;
  const feeLine = paid
    ? `A$${b.paidAmount!.toFixed(2)} — paid by card (incl. GST)`
    : b.fee > 0
      ? `A$${b.fee.toFixed(2)} +GST (invoiced)`
      : 'Confirmed on enquiry';
  const kicker = paid ? 'Booking confirmed' : 'Booking reserved';
  const lead = paid
    ? `Your payment has been received and your room is confirmed. We look forward to welcoming you.`
    : `We've reserved your room. Our team confirms website bookings within one business day — we'll be in touch shortly.`;

  const html = `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#EFEDF2;margin:0;padding:0">
  <div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #e5e5e5">
    <div style="background:#1a1a1a;padding:22px 32px"><span style="color:#fff;font-size:16px;letter-spacing:4px;font-family:Arial,sans-serif">HEXA SPACE</span></div>
    <div style="padding:32px;color:#333">
      <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7F8B2F;margin:0">${kicker}</p>
      <h1 style="font-size:24px;font-weight:300;margin:8px 0 16px">${paid ? "You're confirmed" : "You're booked in"}, ${b.name.split(' ')[0]}.</h1>
      <p style="font-size:14px;line-height:1.7;color:#555">${lead}</p>
      <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;margin:20px 0">
        <tr><td style="padding:8px 0;color:#888;width:120px">Room</td><td style="padding:8px 0">${b.resource}</td></tr>
        <tr><td style="padding:8px 0;color:#888">When</td><td style="padding:8px 0">${when}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Reference</td><td style="padding:8px 0">${b.reference}</td></tr>
        <tr><td style="padding:8px 0;color:#888">${paid ? 'Paid' : 'Fee'}</td><td style="padding:8px 0">${feeLine}</td></tr>
      </table>
      <p style="font-size:13px;color:#888;line-height:1.7">Level 4, 830 Whitehorse Road, Box Hill VIC 3128 · +61 406 016 666<br>Need to change something? Reply to this email or call us.</p>
    </div>
  </div></body></html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Hexa Space <noreply@hexaspace.com.au>',
      to: b.email,
      bcc: 'info@hexaspace.com.au',
      subject: `${kicker} — ${b.resource} (${b.reference})`,
      html,
    }),
  });
}

// ── paid-session confirmation (shared by /confirm and the webhook) ───────────

export type StripeSessionLike = {
  id: string;
  payment_status?: string;
  payment_intent?: string | null;
  amount_total?: number | null;
  metadata?: Record<string, string> | null;
};

/**
 * Turn a paid Checkout Session back into an RND booking (idempotent).
 * Returns null when the session isn't a website booking or isn't paid.
 */
export async function confirmPaidSession(
  session: StripeSessionLike
): Promise<{ booking: BookingRecord; alreadyExisted: boolean } | null> {
  const meta = session.metadata ?? {};
  if (meta.kind !== 'website-booking') return null;
  if (session.payment_status !== 'paid') return null;

  const input: BookingInput = {
    resourceId: meta.resourceId ?? '',
    date: meta.date ?? '',
    startTime: meta.startTime ?? '',
    endTime: meta.endTime ?? '',
    allDay: meta.allDay === '1',
    title: meta.title ?? '',
    description: meta.description ?? '',
    name: meta.name ?? '',
    email: meta.email ?? '',
    phone: meta.phone ?? '',
    company: meta.company ?? '',
  };
  const paidAmount = (session.amount_total ?? 0) / 100;

  if (!rndConfigured()) {
    // Dev without the RND wired: acknowledge, nothing persisted.
    return {
      booking: {
        reference: makeReference(),
        resourceName: meta.resourceName ?? '',
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
      },
      alreadyExisted: false,
    };
  }

  // Webhook and return-trip both call this — first writer wins.
  const existing = await findBookingBySession(session.id);
  if (existing) return { booking: existing, alreadyExisted: true };

  const resource = await resolveResource(input.resourceId);
  if (!resource) return null;
  const fee = Number(meta.feeExGst ?? '') || computeFee(resource, input);

  // The slot could have been taken while the guest was on Stripe. Their money
  // has been captured, so never drop the booking — record it Pending with a
  // flag for the team to resolve (move or refund).
  let clashed = false;
  try {
    clashed = await hasConflict(input);
  } catch {
    clashed = false;
  }

  const booking = await insertBooking(input, resource, fee, {
    paidBy: 'stripe',
    status: clashed ? 'Pending' : 'Confirmed',
    paidAmount,
    stripeSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
    noteSuffix: clashed
      ? '⚠ Paid via Stripe but the slot was taken during checkout — please contact the guest to move or refund.'
      : undefined,
  });

  sendConfirmation({
    resource: resource.name,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    name: input.name,
    email: input.email,
    reference: booking.reference,
    fee,
    paidAmount,
  }).catch(() => {});

  return { booking, alreadyExisted: false };
}
