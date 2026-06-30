import { NextRequest, NextResponse } from 'next/server';
import { rndConfigured, rndInsert, rndSelect } from '@/lib/rnd';

// Forwards website enquiries to the Hexa Space admin dashboard's public intake
// endpoint (creates a lead in Supabase + notifies admin). Server-to-server, so no
// CORS and the endpoint URL stays off the client. Tagged source:'hexaspace'.
// Target: admin.hexaspace.com.au (the management dashboard). Override per-env with
// HEXASPACE_ADMIN_ENDPOINT (e.g. a Vercel preview URL while staging).
//
// If that endpoint is unreachable (DNS still propagating, admin briefly down), we
// fall back to writing the lead straight into the RND Supabase `leads` table — so
// a real enquiry is never lost and the customer never sees an error.
const ENDPOINT =
  process.env.HEXASPACE_ADMIN_ENDPOINT ||
  'https://admin.hexaspace.com.au/api/form-submit';

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
  const businessName = str(body.businessName);
  const interest = str(body.interest);
  const message = str(body.message);
  const website = str(body.website); // honeypot

  // Bot honeypot — pretend success.
  if (website) return NextResponse.json({ success: true });

  if (!email && !phone) {
    return NextResponse.json(
      { error: 'Please provide an email or phone number.' },
      { status: 400 }
    );
  }

  const notes = [interest ? `Interested in: ${interest}` : '', message]
    .filter(Boolean)
    .join('\n\n');

  // 1. Primary path — the admin dashboard intake (resolves stages, referrers, and
  //    emails the team). Best path when admin.hexaspace.com.au is live.
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        businessName,
        // `interest` is the structured enquiry type (e.g. "Virtual Office",
        // "Private Office") so the CRM can tag/route the lead; `message` keeps the
        // human-readable note. Sent alongside for back-compat with the intake.
        interest,
        enquiryType: interest,
        message: notes,
        source: 'hexaspace-website',
      }),
      // Don't hang the customer if the admin host is slow/unresolved.
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) return NextResponse.json({ success: true });
    console.error('admin form-submit failed', r.status, await r.text().catch(() => ''));
  } catch (err) {
    console.error('admin endpoint unreachable, using fallback:', err);
  }

  // 2. Fallback — write the lead straight to the RND Supabase so nothing is lost.
  if (rndConfigured()) {
    try {
      await saveLeadDirect({ name, email, phone, businessName, interest, notes });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('enquiry fallback insert failed', err);
    }
  }

  // 3. Both paths failed.
  return NextResponse.json(
    { error: 'Sorry — we couldn’t send your enquiry. Please email info@hexaspace.com.au.' },
    { status: 502 }
  );
}

// Writes the enquiry as a lead in the RND `leads` table (same shape the admin
// /api/form-submit produces), so it lands in the Enquiries inbox as unread.
async function saveLeadDirect(f: {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  interest: string;
  notes: string;
}) {
  // Resolve the first "new" pipeline stage; fall back to the default id.
  let stageId = 'stage_new';
  try {
    const stages = await rndSelect<{ id?: string; category?: string }>(
      'lead_pipeline_stages',
      'select=data'
    );
    const newStage = stages.map((s) => s.data).find((s) => s.category === 'new');
    if (newStage?.id) stageId = newStage.id;
  } catch {
    /* keep default */
  }

  const today = new Date().toISOString().split('T')[0];
  const id = `lead${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const lead = {
    id,
    name: f.name,
    businessName: f.businessName,
    email: f.email,
    phone: f.phone,
    spaceId: '',
    source: 'hexaspace-website',
    stageId,
    value: 0,
    notes: f.notes,
    interest: f.interest,
    enquiryType: f.interest,
    tenantId: null,
    type: 'enquiry',
    read: false,
    referrerId: null,
    referralCode: null,
    referralIntent: null,
    createdAt: today,
    stageEnteredAt: today,
  };
  await rndInsert('leads', [{ id, data: lead, updated_at: new Date().toISOString() }]);
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}
