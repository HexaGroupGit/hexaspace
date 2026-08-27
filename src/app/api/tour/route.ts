import { NextRequest, NextResponse } from 'next/server';
import { longDate, timeLabel } from '@/lib/booking';

// Forwards a private-tour request to the Hexa Space platform, which creates the
// lead with tourStatus 'pending', tells the leasing team, and acknowledges the
// visitor.
//
// Server-to-server on purpose, the same shape as /api/studio-request: one code
// path, so the notification list and the emails can't drift between the two
// repos. This route used to write the lead itself, straight into "Tour Booked"
// with nobody agreeing to the time, notifying one address and sending the
// visitor nothing at all.
//
// Nothing here is a confirmed booking: the visitor picks a PREFERRED day and
// time and staff confirm it from the lead, which is what sends the calendar
// invitation and puts the tour on the admin calendar.
const ENDPOINT =
  process.env.HEXASPACE_TOUR_ENDPOINT ||
  'https://admin.hexaspace.com.au/api/book-tour';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Bot honeypot — look successful, do nothing.
  if (str(body.website)) return NextResponse.json({ success: true });

  const name = str(body.name);
  const email = str(body.email);
  const date = str(body.date); // yyyy-MM-dd
  const time = str(body.time); // HH:MM

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Please choose a day.' }, { status: 400 });
  }

  // Tours are weekdays only, 9:00–17:00. Checked here so the visitor gets the
  // message immediately rather than a round trip to the platform.
  const d = new Date(date + 'T00:00:00');
  const weekday = d.getDay();
  if (weekday < 1 || weekday > 5) {
    return NextResponse.json({ error: 'Tours run on weekdays.' }, { status: 400 });
  }
  const [hh] = time.split(':').map(Number);
  if (Number.isNaN(hh) || hh < 9 || hh > 17) {
    return NextResponse.json({ error: 'Please choose a time between 9am and 5pm.' }, { status: 400 });
  }

  const whenText = `${longDate(d)} at ${timeLabel(time)}`;

  // Field names are the platform's (/api/book-tour), not the form's.
  const payload = {
    name,
    email,
    phone: str(body.phone),
    businessName: str(body.business),
    enquiryType: str(body.enquiryType) || null,
    preferredDate: date,
    preferredTime: time,
    message: str(body.message).slice(0, 2000),
    source: 'hexaspace-website',
  };

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return NextResponse.json(
        { error: data.error || 'We could not send your request. Please try again.' },
        { status: r.status === 400 || r.status === 429 ? r.status : 502 }
      );
    }
    return NextResponse.json({ success: true, whenText });
  } catch (err) {
    console.error('tour request proxy error:', err);
    return NextResponse.json(
      {
        error:
          'We could not reach our booking system just now. Please email info@hexaspace.com.au and we will lock in your tour.',
      },
      { status: 502 }
    );
  }
}
