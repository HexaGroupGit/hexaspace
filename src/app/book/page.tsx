import type { Metadata } from 'next';
import BookingCalendar from '@/components/booking/BookingCalendar';
import { getLocale } from '@/i18n/server';
import { BOOKING } from '@/i18n/dictionaries/booking';
import type { BookableGroup } from '@/data/bookable';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = BOOKING[locale].bookPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  // Anything unrecognised falls back to the meeting-room tab.
  const initialTab: BookableGroup =
    tab === 'studio' ? 'studio' : tab === 'podcast' ? 'podcast' : 'meeting';
  return (
    <main className="pt-20">
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14 py-12 md:py-16">
        <BookingCalendar initialTab={initialTab} />
      </section>
    </main>
  );
}
