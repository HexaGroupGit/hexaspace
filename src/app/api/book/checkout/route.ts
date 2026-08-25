import { NextRequest, NextResponse } from 'next/server';
import {
  computeFee,
  hasConflict,
  parseBookingInput,
  resolveResource,
  rndConfigured,
  validateInput,
} from '@/lib/createBooking';
import { incGstCents, paymentsEnabled, stripeFetch } from '@/lib/stripe';
import { longDate, timeLabel } from '@/lib/booking';

/**
 * POST /api/book/checkout — start a Stripe Checkout session for a booking.
 * Returns { url } to redirect to, or { fallback: true } when online payment
 * isn't available (no key, payments toggled off in RND settings, or a POA
 * room) — the client then falls back to the unpaid reserve flow.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const input = parseBookingInput(body);
  const invalid = validateInput(input);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const resource = await resolveResource(input.resourceId);
  if (!resource) return NextResponse.json({ error: 'Unknown room.' }, { status: 400 });
  // The podcast studio is staff-operated: it needs an operator rostered, the
  // pre-session questionnaire and a policy acceptance, none of which this
  // endpoint collects. Refuse it here so the flag can't be bypassed by posting
  // the resource id directly.
  if (resource.requestOnly) {
    return NextResponse.json(
      {
        error: 'The podcast studio is booked by request — please use the request form at /podcast-studio.',
        requestOnly: true,
      },
      { status: 400 }
    );
  }

  const fee = computeFee(resource, input);
  if (fee <= 0 || !(await paymentsEnabled())) {
    return NextResponse.json({ fallback: true });
  }

  // Don't take money for a slot that's already gone.
  if (rndConfigured()) {
    try {
      if (await hasConflict(input)) {
        return NextResponse.json(
          { error: 'Sorry — that slot was just taken. Please choose another time.' },
          { status: 409 }
        );
      }
    } catch {
      // availability check failing shouldn't block payment; confirm re-checks
    }
  }

  const origin =
    req.headers.get('origin') ??
    `https://${req.headers.get('host') ?? 'www.hexaspace.com.au'}`;

  const when = `${longDate(new Date(input.date + 'T00:00:00'))}, ${timeLabel(input.startTime)} – ${timeLabel(input.endTime)}`;
  const r = await stripeFetch('/checkout/sessions', {
    mode: 'payment',
    customer_email: input.email,
    // Sessions can't expire in under 30 minutes.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'aud',
          unit_amount: incGstCents(fee),
          product_data: {
            name: resource.name,
            description: `${when}${input.allDay ? ' · all-day (30% off)' : ''} · incl. 10% GST`,
          },
        },
      },
    ],
    payment_intent_data: {
      description: `Website booking — ${resource.name} · ${input.date}`,
    },
    metadata: {
      kind: 'website-booking',
      resourceId: input.resourceId,
      resourceName: resource.name,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      allDay: input.allDay ? '1' : '0',
      title: input.title.slice(0, 200),
      description: input.description.slice(0, 400),
      name: input.name.slice(0, 200),
      email: input.email.slice(0, 200),
      phone: input.phone.slice(0, 50),
      company: input.company.slice(0, 200),
      feeExGst: String(fee),
    },
    success_url: `${origin}/book?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/book?checkout=cancelled`,
  });

  if (!r.ok || !r.json.url) {
    console.error('Stripe checkout create failed:', r.json);
    return NextResponse.json(
      { error: r.json.error?.message ?? 'Could not start the payment. Please try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: r.json.url });
}
