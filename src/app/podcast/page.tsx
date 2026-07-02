import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { PLATFORMS, getEpisodes, getSpaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = PAGES[locale].podcastPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function PodcastPage() {
  const locale = await getLocale();
  const t = PAGES[locale].podcastPage;
  const studio = getSpaces(locale).find((s) => s.slug === 'podcast-studio')!;
  const [featured, ...rest] = getEpisodes(locale);

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
        image="/photos/podcast-studio.jpg"
      />

      {/* Listen on */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="eyebrow">{t.listenOn}</span>
          {PLATFORMS.map((p) => (
            <Link
              key={p}
              href="#"
              className="font-heading uppercase tracking-nav text-[11px] text-muted hover:text-ink transition-colors"
            >
              {p}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured episode */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.latestEyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <button
                  aria-label={t.playAria}
                  className="absolute inset-0 grid place-items-center group"
                >
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-paper/90 backdrop-blur transition-transform duration-500 ease-lux group-hover:scale-110">
                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
                      <path d="M1 1 L19 11 L1 21 Z" fill="#000" />
                    </svg>
                  </span>
                </button>
              </div>
              <div>
                <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                  {t.episode(featured.number)} · {featured.duration}
                </span>
                <h2 className="h-display text-[clamp(2rem,4.5vw,3.6rem)] mt-4">
                  {featured.title}
                </h2>
                <p className="lead mt-5">
                  {featured.guest} — <span className="text-muted">{featured.role}</span>
                </p>
                <p className="prose-body mt-4 max-w-md">{featured.blurb}</p>
                <Link href="#" className="btn mt-8">
                  {t.playEpisode}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Episode list */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">{t.moreEyebrow}</p>
            <h2 className="h-section mt-6">{t.backCatalogue}</h2>
          </Reveal>

          <div className="mt-12 border-t border-ink/10">
            {rest.map((ep, i) => (
              <Reveal key={ep.number} delay={i * 80}>
                <Link
                  href="#"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 border-b border-ink/10 py-7 hover:bg-bone transition-colors px-2 -mx-2"
                >
                  <span className="font-display font-extralight text-3xl md:text-4xl text-muted w-12">
                    {String(ep.number).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading uppercase tracking-[0.04em] text-sm md:text-base">
                      {ep.title}
                    </h3>
                    <p className="prose-body mt-1.5 max-w-xl">
                      {ep.guest} · {ep.role}
                    </p>
                  </div>
                  <span className="font-heading uppercase tracking-nav text-[11px] text-muted group-hover:text-ink transition-colors whitespace-nowrap">
                    {ep.duration}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The studio — record your own */}
      <section className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
        <div className="container-page">
          <div className="grid items-center gap-10 md:gap-14 lg:gap-20 lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <Image
                src={studio.image}
                alt={studio.name}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
            </div>
            <div className="max-w-xl">
              <p className="eyebrow text-paper/50">{studio.kicker}</p>
              <h2 className="h-display mt-6">
                {t.recordTitle}
                <br />
                <span className="italic">{t.recordTitleItalic}</span>
              </h2>
              <p className="lead text-paper/80 mt-7">
                {t.recordLead}
              </p>
              <div className="mt-8">
                <Inclusions items={studio.inclusions} light />
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <EnquireButton interest="The Podcast Studio" className="btn btn-light">
                  {t.bookStudio}
                </EnquireButton>
                <Link href="/space-hire#podcast-studio" className="btn btn-light border-paper/30">
                  {t.studioDetails}
                </Link>
              </div>
            </div>
          </div>
        </div>
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
      />
    </main>
  );
}
