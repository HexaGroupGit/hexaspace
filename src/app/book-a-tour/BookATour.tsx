'use client';

import { useEffect } from 'react';
import { useEnquiry } from '@/components/enquiry/EnquiryProvider';
import { useLocale } from '@/i18n/LocaleProvider';
import { BOOKING } from '@/i18n/dictionaries/booking';

/**
 * Landing page for the book-a-tour link the RND emails out (proposal follow-ups,
 * lead nurture, "come and see the space"). The tour form itself is a modal with
 * no URL of its own, so this page is what gives it one — it opens the modal on
 * arrival, and the page behind it is the fallback if they close it.
 */
export default function BookATour() {
  const { openTour } = useEnquiry();
  const locale = useLocale();
  const t = BOOKING[locale].tourModal;

  useEffect(() => {
    openTour();
  }, [openTour]);

  return (
    <main className="bg-charcoal text-paper min-h-[70svh] flex items-center">
      <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <div className="font-heading uppercase tracking-[0.3em] text-[11px] text-paper/60">{t.kicker}</div>
        <h1 className="font-display font-extralight text-4xl md:text-5xl mt-5">{t.title}</h1>
        <p className="font-body text-[15px] leading-relaxed text-paper/70 mt-5 max-w-xl mx-auto">
          {t.hoursNote}
        </p>
        <button
          type="button"
          onClick={openTour}
          className="mt-9 inline-block bg-hexa-green text-paper font-heading uppercase tracking-[0.14em] text-[12px] px-8 py-3.5 rounded-md hover:opacity-90"
        >
          {t.title}
        </button>
        <p className="font-body text-[13px] text-paper/50 mt-8">
          402/830 Whitehorse Road, Box Hill VIC 3128
        </p>
      </div>
    </main>
  );
}
