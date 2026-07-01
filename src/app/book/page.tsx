import type { Metadata } from 'next';
import BookingCalendar from '@/components/booking/BookingCalendar';

export const metadata: Metadata = {
  title: 'Book a Room — Hexa Space',
  description:
    'Check live availability and book a meeting room or studio at Hexa Space, Box Hill — by the hour, online.',
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = tab === 'studio' ? 'studio' : 'meeting';
  return (
    <main className="pt-20">
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14 py-12 md:py-16">
        <BookingCalendar initialTab={initialTab} />
      </section>
    </main>
  );
}
