import { NextRequest, NextResponse } from 'next/server';

// Forwards a podcast-studio session request to the Hexa Space platform, which
// writes a PENDING booking holding the slot and emails both the studio team and
// the requester.
//
// Server-to-server on purpose: keeps the platform endpoint off the client and
// avoids CORS. No payment happens anywhere in this path — the studio is
// staff-operated, so a session is quoted and charged only once the team has
// confirmed an operator can cover it.
const ENDPOINT =
  process.env.HEXASPACE_STUDIO_ENDPOINT ||
  'https://admin.hexaspace.com.au/api/studio-request';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const bool = (v: unknown) => v === true || v === 'true';
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Bot honeypot — look successful, do nothing.
  if (str(body.website)) return NextResponse.json({ success: true });

  const payload = {
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    businessName: str(body.businessName),
    date: str(body.date),
    startTime: str(body.startTime),
    hours: Math.max(1, Math.min(8, num(body.hours) || 1)),
    recordingType: str(body.recordingType),
    peopleOnCamera: Math.max(1, Math.min(4, num(body.peopleOnCamera) || 1)),
    expectedRecordingMins: num(body.expectedRecordingMins),
    ownCrew: bool(body.ownCrew),
    ownCards: bool(body.ownCards),
    transferHelp: body.transferHelp !== false,
    specialRequirements: str(body.specialRequirements).slice(0, 2000),
    deliverables: 'raw' as const,
    policyAccepted: bool(body.policyAccepted),
    source: 'hexaspace-website',
  };

  if (!payload.name || !payload.email) {
    return NextResponse.json({ error: 'Please give us your name and email.' }, { status: 400 });
  }
  if (!payload.date || !payload.startTime) {
    return NextResponse.json({ error: 'Please choose a date and start time.' }, { status: 400 });
  }
  if (!payload.policyAccepted) {
    return NextResponse.json(
      { error: 'Please accept the studio policies to send your request.' },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      // Pass the platform's own wording through — it knows whether the slot was
      // taken, the studio is closed then, or the session is too short.
      return NextResponse.json(
        { error: data.error || 'We could not send your request. Please try again.' },
        { status: r.status === 409 || r.status === 400 || r.status === 429 ? r.status : 502 }
      );
    }
    return NextResponse.json({ success: true, reference: data.reference ?? '' });
  } catch (err) {
    console.error('studio-request proxy error:', err);
    return NextResponse.json(
      {
        error:
          'We could not reach our booking system just now. Please email info@hexaspace.com.au and we will sort your session out.',
      },
      { status: 502 }
    );
  }
}
