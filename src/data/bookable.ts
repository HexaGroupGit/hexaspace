// ─────────────────────────────────────────────────────────────────────────────
// Bookable resources for the public booking calendar — the 6 meeting rooms plus
// the media & podcast studios. Derived from content.ts so photos, capacity and
// pricing stay in one place. The server maps each `id` (slug) to the matching
// RND Supabase space when reading availability / writing a booking.
// ─────────────────────────────────────────────────────────────────────────────
import { SPACES } from './content';

export type BookableGroup = 'meeting' | 'studio';

export type BookableResource = {
  /** slug id — used to match the RND space (server resolves to the real space id). */
  id: string;
  name: string;
  /** which calendar tab it appears under */
  group: BookableGroup;
  /** people capacity (for the "pax" badge); null when not a seated count */
  pax: number | null;
  /** raw capacity label, e.g. "Up to 8 guests" */
  capacityLabel: string;
  /** hourly rate in AUD; null = price on application */
  rate: number | null;
  rateLabel: string;
  image: string;
};

/** Pull the first integer out of a string like "Up to 8 guests" → 8. */
function firstInt(s: string): number | null {
  const m = s.match(/\d+/);
  return m ? Number(m[0]) : null;
}

/** Pull a dollar amount out of "$80 +GST / hour" → 80. */
function dollars(s: string): number | null {
  const m = s.match(/\$\s*([\d,]+)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}

const meetingSpace = SPACES.find((s) => s.slug === 'meeting-rooms');
const mediaSpace = SPACES.find((s) => s.slug === 'media-studios');
const podcastSpace = SPACES.find((s) => s.slug === 'podcast-studio');

const meetingRooms: BookableResource[] = (meetingSpace?.rooms ?? []).map((r) => {
  const rate = dollars(r.price);
  return {
    id: `room-${r.name.toLowerCase()}`,
    name: r.note ? `${r.name} · ${r.note}` : r.name,
    group: 'meeting',
    pax: firstInt(r.capacity),
    capacityLabel: r.capacity,
    rate,
    rateLabel: rate ? `A$${rate} +GST / hr` : 'POA',
    image: r.image,
  };
});

const studios: BookableResource[] = [mediaSpace, podcastSpace]
  .filter((s): s is NonNullable<typeof s> => Boolean(s))
  .map((s) => ({
    id: `studio-${s.slug}`,
    name: s.name,
    group: 'studio' as const,
    pax: firstInt(s.capacity),
    capacityLabel: s.capacity,
    rate: null, // studios are POA — priced per project until Stripe rates are set
    rateLabel: 'POA',
    image: s.gallery?.[0] ?? s.image,
  }));

export const BOOKABLE_RESOURCES: BookableResource[] = [...meetingRooms, ...studios];

export const BOOKABLE_TABS: { key: BookableGroup; label: string }[] = [
  { key: 'meeting', label: 'Meeting Rooms' },
  { key: 'studio', label: 'Studios' },
];

/** Operating hours shown on the calendar (matches the RND portal: 9am–5pm). */
export const DAY_START = 9;
export const DAY_END = 17;
