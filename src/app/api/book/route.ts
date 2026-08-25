import { NextRequest, NextResponse } from 'next/server';
import {
  computeFee,
  hasConflict,
  insertBooking,
  makeReference,
  parseBookingInput,
  resolveResource,
  rndConfigured,
  sendConfirmation,
  validateInput,
} from '@/lib/createBooking';

/** Unpaid reserve — POA rooms, or environments where Stripe isn't live. */
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

  if (!rndConfigured()) {
    // No RND wired in this environment — acknowledge so the UI/dev flow still works.
    return NextResponse.json({
      booking: {
        reference: makeReference(),
        resourceName: resource.name,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
      },
      warning: 'RND not configured — booking was not persisted.',
    });
  }

  try {
    // Server-side conflict re-check (the calendar checks client-side too).
    if (await hasConflict(input)) {
      return NextResponse.json(
        { error: 'Sorry — that slot was just taken. Please choose another time.' },
        { status: 409 }
      );
    }

    // Status Pending → blocks the slot, awaits team confirm.
    const booking = await insertBooking(input, resource, fee, {
      paidBy: 'unpaid',
      status: 'Pending',
    });

    // Confirmation email — best-effort, never blocks the booking.
    sendConfirmation({
      resource: resource.name,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      name: input.name,
      email: input.email,
      reference: booking.reference,
      fee,
    }).catch(() => {});

    return NextResponse.json({ booking });
  } catch (err) {
    console.error('create-booking error', err);
    return NextResponse.json(
      { error: 'Sorry — we couldn’t complete your booking. Please try again or email info@hexaspace.com.au.' },
      { status: 502 }
    );
  }
}
