import Image from 'next/image';
import Link from 'next/link';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

export default async function Podcast() {
  const locale = await getLocale();
  const t = HOME[locale].podcast;

  return (
    <section id="podcast" className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
      <div className="container-page">
        <div className="grid items-center gap-10 md:gap-14 lg:gap-20 md:grid-cols-2">
          {/* Image side — crossfades into the dark background on its right/bottom edge */}
          <div className="relative aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
            <Image
              src="/photos/podcast-mic.jpg"
              alt={t.imageAlt}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* opacity crossfade: image dissolves into charcoal toward the copy */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
          </div>

          {/* Copy side */}
          <div className="max-w-xl">
            <p className="eyebrow text-paper/50">{t.eyebrow}</p>
            <h2 className="h-display mt-6">
              {t.title}
              <br />
              <span className="italic">{t.titleItalic}</span>
            </h2>
            <p className="lead text-paper/80 mt-7">{t.lead}</p>
            <p className="prose-body text-paper/55 mt-5 max-w-md">{t.body}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <EnquireButton interest="The Podcast Studio" className="btn btn-light">
                {t.book}
              </EnquireButton>
              <Link href="#" className="btn btn-light border-paper/30">
                {t.listen}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
