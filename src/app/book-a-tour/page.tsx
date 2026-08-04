import type { Metadata } from 'next';
import BookATour from './BookATour';
import { getLocale } from '@/i18n/server';
import { BOOKING } from '@/i18n/dictionaries/booking';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = BOOKING[locale].tourModal;
  return { title: `${t.title} — Hexa Space`, description: t.hoursNote };
}

export default function BookATourPage() {
  return <BookATour />;
}
