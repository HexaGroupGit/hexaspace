// Server-only helper for talking to the Hexa Space RND Supabase (the management
// app's database) over its PostgREST API. Used by the booking endpoints to read
// rooms/availability and write bookings. Tables follow the {id, data, updated_at}
// jsonb convention, so we filter/select on `data->>field`.
//
// Requires env (set in .env.local / hosting):
//   RND_SUPABASE_URL          e.g. https://ihvhnsdsvjwpyquvetzz.supabase.co
//   RND_SUPABASE_SERVICE_KEY  service-role / secret key (bypasses RLS)
import type { BookableResource, BookableGroup } from '@/data/bookable';
import { BOOKABLE_RESOURCES } from '@/data/bookable';

const URL = process.env.RND_SUPABASE_URL;
const KEY = process.env.RND_SUPABASE_SERVICE_KEY;

export function rndConfigured(): boolean {
  return Boolean(URL && KEY);
}

async function rest(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY as string,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

/** SELECT rows; returns the raw {id, data, updated_at} records. */
export async function rndSelect<T = Record<string, unknown>>(
  table: string,
  query = ''
): Promise<{ id: string; data: T }[]> {
  const res = await rest(`${table}?${query}`, { method: 'GET' });
  if (!res.ok) throw new Error(`RND select ${table} → ${res.status}`);
  return res.json();
}

/** INSERT rows (each already wrapped as {id, data, updated_at}). */
export async function rndInsert(table: string, rows: unknown[]): Promise<void> {
  const res = await rest(table, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`RND insert ${table} → ${res.status} ${detail}`);
  }
}

/** UPDATE one row's jsonb data by id. */
export async function rndUpdate(table: string, id: string, data: unknown): Promise<void> {
  const res = await rest(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`RND update ${table}/${id} → ${res.status} ${detail}`);
  }
}

/** Call a Postgres function exposed over PostgREST RPC. */
export async function rndRpc<T = unknown>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await rest(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`RND rpc ${fn} → ${res.status} ${detail}`);
  }
  return res.json();
}

// ── resource resolution ──────────────────────────────────────────────────────

type RndSpace = {
  id: string;
  unitNumber?: string;
  type?: string;
  size?: string;
  capacity?: number;
  hourlyRate?: number;
  rate?: number;
  floor?: string;
  image?: string | null;
};

// Level 2 rooms by name; everything else on Level 4 — a fallback for when the
// RND space record has no `floor` set.
const L2_ROOMS = new Set(['sun', 'moon', 'central']);
const floorOf = (s: RndSpace): string | undefined =>
  s.floor ?? (L2_ROOMS.has((s.unitNumber ?? '').trim().toLowerCase().split(/[\s(/·—-]/)[0]) ? 'l2' : undefined);

/** Map an RND space name to one of the site's photos (RND spaces have no images). */
function imageForName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('sky')) return '/photos/room-sky.jpg';
  if (n.includes('earth')) return '/photos/room-earth.jpg';
  if (n.includes('sun')) return '/photos/room-sun.jpg';
  if (n.includes('moon')) return '/photos/room-moon.jpg';
  if (n.includes('north')) return '/photos/room-north.jpg';
  if (n.includes('south')) return '/photos/room-south.jpg';
  if (n.includes('east')) return '/photos/room-east.jpg';
  if (n.includes('west')) return '/photos/room-west.jpg';
  if (n.includes('central')) return '/photos/room-central.jpg';
  if (n.includes('podcast')) return '/photos/podcast-studio.jpg';
  if (n.includes('media')) return '/photos/media-1.jpg';
  return '/photos/meeting-room.jpg';
}

// People capacity for the "pax" badge. Prefers a numeric capacity, else a size
// string that clearly counts people ("Up to 8", "4 guests"). Area strings like
// "90 m²" (Media Studios) are NOT a headcount → null (no badge).
function paxFrom(capacity?: number, size?: string): number | null {
  if (typeof capacity === 'number' && capacity > 0) return capacity;
  const m = (size ?? '').match(/up to\s*(\d+)|(\d+)\s*(?:pax|people|persons?|guests?|seats?)/i);
  return m ? Number(m[1] ?? m[2]) : null;
}

const isFunctionSpace = (s: RndSpace) => /function/i.test(s.unitNumber ?? '');

/**
 * Live bookable rooms + studios from the RND `spaces` table (real space ids), so
 * bookings write back with ids the portal/admin calendar recognises. Falls back
 * to the static list when the RND isn't configured/reachable.
 */
export async function getBookableResources(): Promise<BookableResource[]> {
  if (!rndConfigured()) return BOOKABLE_RESOURCES;
  try {
    const rows = await rndSelect<RndSpace>('spaces', 'select=id,data');
    const spaces = rows
      .map((r) => ({ ...(r.data as RndSpace), id: r.id }))
      .filter((s) => ['meeting', 'studio', 'podcast'].includes(s.type ?? '') && !isFunctionSpace(s));

    if (!spaces.length) return BOOKABLE_RESOURCES;

    const resources = spaces.map((s): BookableResource => {
      const name = s.unitNumber ?? 'Room';
      let rate = s.hourlyRate || s.rate || null;
      if (/east/i.test(name)) rate = 120; // East (Chinese Tearoom) — premium rate
      const group: BookableGroup = s.type === 'meeting' ? 'meeting' : 'studio';
      return {
        id: s.id,
        name,
        group,
        floor: floorOf(s),
        pax: paxFrom(s.capacity, s.size),
        capacityLabel: s.size ?? (s.capacity ? `Up to ${s.capacity}` : ''),
        rate,
        rateLabel: rate ? `A$${rate} +GST / hr` : 'POA',
        image: s.image || imageForName(name),
      };
    });

    // Meeting rooms left→right by tier, with East (premium) furthest right.
    resources.sort((a, b) => {
      if (a.group !== b.group) return a.group === 'meeting' ? -1 : 1;
      return roomRank(a.name) - roomRank(b.name);
    });
    return resources;
  } catch {
    return BOOKABLE_RESOURCES;
  }
}

const ROOM_ORDER = ['sky', 'earth', 'west', 'north', 'south', 'central', 'sun', 'moon', 'east'];
function roomRank(name: string): number {
  const i = ROOM_ORDER.findIndex((k) => name.toLowerCase().includes(k));
  return i < 0 ? ROOM_ORDER.length : i;
}
