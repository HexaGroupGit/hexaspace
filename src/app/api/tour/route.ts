import { NextRequest, NextResponse } from 'next/server';
import { rndConfigured, rndInsert, rndSelect } from '@/lib/rnd';
import { longDate, timeLabel } from '@/lib/booking';

// The pipeline stage tour bookings land in. Created on first use if the RND
// doesn't have it yet (sits between New and Toured). The Enquiries inbox already
// renders a 'book-tour' source badge, so leads show as orange "Book Tour".
const TOUR_STAGE = {
  id: 'stage_tour_booked',
  name: 'Tour Booked',
  tone: 'orange',
  sortOrder: 2, // sits in the middle: New(0) · Contacted(1) · Tour Booked(2) · Won(3) · Lost(4)
  category: 'in-progress',
};

const TOUR_NOTIFY = 'eric@hexaspace.com.au';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const business = str(body.business);
  const date = str(body.date); // yyyy-MM-dd
  const time = str(body.time); // HH:MM
  const message = str(body.message);

  if (!name || !email) return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'Please choose a day.' }, { status: 400 });

  // Tours are weekdays only, 9:00–17:00.
  const d = new Date(date + 'T00:00:00');
  const weekday = d.getDay();
  if (weekday < 1 || weekday > 5) return NextResponse.json({ error: 'Tours run on weekdays.' }, { status: 400 });
  const [hh] = time.split(':').map(Number);
  if (Number.isNaN(hh) || hh < 9 || hh > 17) {
    return NextResponse.json({ error: 'Please choose a time between 9am and 5pm.' }, { status: 400 });
  }

  const whenText = `${longDate(d)} at ${timeLabel(time)}`;
  const notes = [`Private tour booked for ${whenText}.`, message].filter(Boolean).join('\n\n');
  const today = new Date().toISOString().split('T')[0];

  if (!rndConfigured()) {
    sendNotify({ name, email, phone, business, whenText, message }).catch(() => {});
    return NextResponse.json({ success: true, warning: 'RND not configured — lead not persisted.' });
  }

  try {
    // Ensure the Tour Booked stage exists (idempotent).
    try {
      const stages = await rndSelect('lead_pipeline_stages', `select=id&id=eq.${TOUR_STAGE.id}`);
      if (!stages.length) {
        await rndInsert('lead_pipeline_stages', [
          { id: TOUR_STAGE.id, data: TOUR_STAGE, updated_at: new Date().toISOString() },
        ]);
      }
    } catch (e) {
      console.error('tour stage ensure failed (continuing)', e);
    }

    // Create the lead directly in the Tour Booked stage.
    const id = `lead${Date.now()}`;
    const lead = {
      id,
      name,
      businessName: business,
      email,
      phone,
      spaceId: '',
      source: 'book-tour',
      stageId: TOUR_STAGE.id,
      value: 0,
      notes,
      tenantId: null,
      type: 'enquiry',
      read: false, // surfaces as unread in the Enquiries inbox
      tourDate: date,
      tourTime: time,
      tourAt: `${date}T${time}:00`,
      createdAt: today,
      stageEnteredAt: today,
    };
    await rndInsert('leads', [{ id, data: lead, updated_at: new Date().toISOString() }]);

    sendNotify({ name, email, phone, business, whenText, message }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('tour booking error', err);
    return NextResponse.json(
      { error: 'Sorry — we couldn’t book your tour. Please try again or email info@hexaspace.com.au.' },
      { status: 502 }
    );
  }
}

async function sendNotify(b: {
  name: string;
  email: string;
  phone: string;
  business: string;
  whenText: string;
  message: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#EFEDF2;margin:0;padding:0">
  <div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #e5e5e5">
    <div style="background:#1a1a1a;padding:20px 32px"><span style="color:#fff;font-size:16px;letter-spacing:4px">HEXA SPACE</span></div>
    <div style="padding:32px;color:#333">
      <h2 style="margin:0 0 6px;font-size:16px">New private tour booked 🗓️</h2>
      <p style="font-size:14px;color:#7F8B2F;margin:0 0 16px">${b.whenText}</p>
      <table style="width:100%;font-size:13px;color:#333;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#888;width:110px">Name</td><td style="padding:6px 0">${b.name}${b.business ? ` (${b.business})` : ''}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0">${b.email}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Phone</td><td style="padding:6px 0">${b.phone || '—'}</td></tr>
        ${b.message ? `<tr><td style="padding:6px 0;color:#888;vertical-align:top">Note</td><td style="padding:6px 0">${b.message.replace(/</g, '&lt;')}</td></tr>` : ''}
      </table>
      <p style="font-size:12px;color:#888;margin-top:18px">Added to Leads &amp; Enquiries under <strong>Tour Booked</strong> in HexaSpace RND.</p>
    </div>
  </div></body></html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Hexa Space <noreply@hexaspace.com.au>',
      to: TOUR_NOTIFY,
      replyTo: b.email,
      subject: `New private tour — ${b.name} (${b.whenText})`,
      html,
    }),
  });
}
