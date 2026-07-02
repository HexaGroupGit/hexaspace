import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { SPACES, getSpaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = PAGES[locale].spacesPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function SpacesPage() {
  const locale = await getLocale();
  const t = PAGES[locale].spacesPage;
  const spaces = getSpaces(locale);
  // Enquiry values posted to the API stay in English, keyed by slug.
  const enName = (slug: string) => SPACES.find((s) => s.slug === slug)?.name;

  return (
    <main>
      <PageHero
        kicker={t.heroKicker}
        title={
          <>
            {t.heroTitle}
            <br />
            {t.heroTitleB}<span className="italic">{t.heroTitleItalic}</span>
          </>
        }
        intro={t.heroIntro}
        image="/photos/event-space.jpg"
      />

      {/* Index */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap gap-x-8 gap-y-3">
          {spaces.map((s) => (
            <Link
              key={s.slug}
              href={`#${s.slug}`}
              className="font-heading uppercase tracking-nav text-[11px] text-muted hover:text-ink transition-colors"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Spaces — alternating rows */}
      <section className="bg-paper">
        {spaces.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.slug}>
              <article id={s.slug} className="scroll-mt-24 border-t border-ink/10">
                <div className="container-page">
                  <div
                    className={`grid gap-10 lg:gap-16 lg:grid-cols-2 py-16 md:py-24 ${
                      flip ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="lg:py-4">
                      <p className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                        {s.kicker}
                      </p>
                      <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)] mt-4">
                        {s.name}
                      </h2>
                      <p className="prose-body mt-5 max-w-md">{s.description}</p>

                      <div className="mt-8 border-t border-ink/10 pt-8">
                        <Inclusions label={t.whatsIncluded} items={s.inclusions} />
                      </div>

                      <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link href={`/space-hire/${s.slug}`} className="btn">
                          {t.viewSpace(s.name)}
                        </Link>
                        {['meeting-rooms', 'media-studios', 'podcast-studio'].includes(s.slug) ? (
                          <Link
                            href={s.slug === 'meeting-rooms' ? '/book' : '/book?tab=studio'}
                            className="btn-ghost self-center"
                          >
                            {s.bookingLabel}
                          </Link>
                        ) : (
                          <EnquireButton interest={enName(s.slug)} className="btn-ghost self-center">
                            {s.bookingLabel}
                          </EnquireButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      <CTASection
        eyebrow={t.ctaEyebrow}
        title={
          <>
            {t.ctaTitle} <span className="italic">{t.ctaTitleItalic}</span>
          </>
        }
        body={t.ctaBody}
        primaryLabel={t.ctaPrimary}
        interest="The Function Space"
      />
    </main>
  );
}
