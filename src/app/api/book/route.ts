import { NextRequest, NextResponse } from 'next/server';
import { getBookableResources, rndConfigured, rndInsert, rndSelect } from '@/lib/rnd';
import { longDate, overlaps, timeLabel, toDec } from '@/lib/booking';

type RndBooking = { startTime?: string; endTime?: string; status?: string };
type RndMember = { name?: string; email?: string };

function ref(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const resourceId = str(body.resourceId);
  const date = str(body.date);
  const startTime = str(body.startTime);
  const endTime = str(body.endTime);
  const title = str(body.title);
  const description = str(body.description);
  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const company = str(body.company);
  const allDay = body.allDay === true;

  if (!name || !email) return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
  if (toDec(endTime) <= toDec(startTime)) {
    return NextResponse.json({ error: 'End time must be after the start time.' }, { status: 400 });
  }

  // Resolve the room (real RND id + display name + rate).
  const resources = await getBookableResources();
  const resource = resources.find((r) => r.id === resourceId);
  if (!resource) return NextResponse.json({ error: 'Unknown room.' }, { status: 400 });

  const hours = toDec(endTime) - toDec(startTime);
  // All-day public bookings get 30% off.
  const ALL_DAY_DISCOUNT = 0.3;
  const rawFee = resource.rate != null ? resource.rate * hours : 0;
  const fee = Math.round(rawFee * (allDay ? 1 - ALL_DAY_DISCOUNT : 1) * 100) / 100;
  const now = new Date().toISOString();
  const reference = ref();

  if (!rndConfigured()) {
    // No RND wired in this environment — acknowledge so the UI/dev flow still works.
    return NextResponse.json({
      booking: { reference, resourceName: resource.name, date, startTime, endTime },
      warning: 'RND not configured — booking was not persisted.',
    });
  }

  try {
    // Server-side conflict re-check (the calendar checks client-side too).
    const dayRows = await rndSelect<RndBooking>(
      'bookings',
      `select=data&data->>date=eq.${date}&data->>resourceId=eq.${encodeURIComponent(resourceId)}`
    );
    const clash = dayRows
      .map((r) => r.data)
      .some((b) => b && b.status !== 'Cancelled' && overlaps(startTime, endTime, b.startTime ?? '', b.endTime ?? ''));
    if (clash) {
      return NextResponse.json(
        { error: 'Sorry — that slot was just taken. Please choose another time.' },
        { status: 409 }
      );
    }

    // Find or create the member by email.
    let memberId = '';
    try {
      const existing = await rndSelect<RndMember>('members', `select=id&data->>email=ilike.${encodeURIComponent(email)}`);
      if (existing.length) {
        memberId = existing[0].id;
      } else {
        memberId = `m${Date.now()}`;
        const member = {
          id: memberId,
          name,
          email,
          phone,
          companyId: '',
          status: 'Drop In',
          credits: 0,
          createdAt: now.split('T')[0],
          source: 'website-booking',
        };
        await rndInsert('members', [{ id: memberId, data: member, updated_at: now }]);
      }
    } catch (e) {
      console.error('member upsert failed (continuing)', e);
    }

    // Insert the booking (status Pending → blocks the slot, awaits team confirm).
    const id = `bk${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const booking = {
      id,
      reference,
      resourceId,
      resourceName: resource.name,
      memberId,
      memberName: name,
      companyId: '',
      companyName: company,
      date,
      startTime,
      endTime,
      allDay,
      status: 'Pending',
      source: 'Website',
      paidBy: 'unpaid',
      creditsUsed: 0,
      coins: 0,
      fee,
      repeat: 'none',
      title: title || `${resource.name} — ${name}`,
      notes: description,
      createdAt: now,
      createdBy: 'Website',
    };
    await rndInsert('bookings', [{ id, data: booking, updated_at: now }]);

    // Confirmation email — best-effort, never blocks the booking.
    sendConfirmation({ resource: resource.name, date, startTime, endTime, name, email, reference, fee }).catch(() => {});

    return NextResponse.json({
      booking: { reference, resourceName: resource.name, date, startTime, endTime },
    });
  } catch (err) {
    console.error('create-booking error', err);
    return NextResponse.json(
      { error: 'Sorry — we couldn’t complete your booking. Please try again or email info@hexaspace.com.au.' },
      { status: 502 }
    );
  }
}

async function sendConfirmation(b: {
  resource: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  reference: string;
  fee: number;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const when = `${longDate(new Date(b.date + 'T00:00:00'))}, ${timeLabel(b.startTime)} – ${timeLabel(b.endTime)}`;
  const feeLine = b.fee > 0 ? `A$${b.fee.toFixed(2)} +GST (invoiced)` : 'Confirmed on enquiry';

  const html = `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#EFEDF2;margin:0;padding:0">
  <div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #e5e5e5">
    <div style="background:#1a1a1a;padding:22px 32px"><span style="color:#fff;font-size:16px;letter-spacing:4px;font-family:Arial,sans-serif">HEXA SPACE</span></div>
    <div style="padding:32px;color:#333">
      <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7F8B2F;margin:0">Booking reserved</p>
      <h1 style="font-size:24px;font-weight:300;margin:8px 0 16px">You're booked in, ${b.name.split(' ')[0]}.</h1>
      <p style="font-size:14px;line-height:1.7;color:#555">We've reserved your room. Our team confirms website bookings within one business day — we'll be in touch shortly.</p>
      <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;margin:20px 0">
        <tr><td style="padding:8px 0;color:#888;width:120px">Room</td><td style="padding:8px 0">${b.resource}</td></tr>
        <tr><td style="padding:8px 0;color:#888">When</td><td style="padding:8px 0">${when}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Reference</td><td style="padding:8px 0">${b.reference}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Fee</td><td style="padding:8px 0">${feeLine}</td></tr>
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
      subject: `Booking reserved — ${b.resource} (${b.reference})`,
      html,
    }),
  });
}
