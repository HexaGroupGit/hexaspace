import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { WORKSPACES, getWorkspaces, getCommonInclusions } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = PAGES[locale].workspacesPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function WorkspacesPage() {
  const locale = await getLocale();
  const t = PAGES[locale].workspacesPage;
  const workspaces = getWorkspaces(locale);
  const commonInclusions = getCommonInclusions(locale);
  // Enquiry values posted to the API stay in English, keyed by slug.
  const enName = (slug: string) => WORKSPACES.find((w) => w.slug === slug)?.name;

  return (
    <main>
      <PageHero
        kicker={t.heroKicker}
        title={
          <>
            {t.heroTitle}
            <br />
            <span className="italic">{t.heroTitleItalic}</span>
          </>
        }
        intro={t.heroIntro}
        image="/photos/workspace.jpg"
      />

      {/* Quick index of tiers */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap gap-x-8 gap-y-3">
          {workspaces.map((w) => (
            <Link
              key={w.slug}
              href={`#${w.slug}`}
              className="font-heading uppercase tracking-nav text-[11px] text-muted hover:text-ink transition-colors"
            >
              {w.name}
            </Link>
          ))}
        </div>
      </section>

      {/* What every membership includes */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">{t.includedEyebrow}</p>
            <h2 className="h-section mt-6">{t.includedTitle}</h2>
            <p className="prose-body mt-6 max-w-md">
              {t.includedBody}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Inclusions items={commonInclusions} />
          </Reveal>
        </div>
      </section>

      {/* Tiers — alternating rows */}
      <section className="bg-paper">
        {workspaces.map((w, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={w.slug}>
              <article id={w.slug} className="scroll-mt-24 border-t border-ink/10">
                <div className="container-page">
                  <div
                    className={`grid gap-10 lg:gap-16 lg:grid-cols-2 py-16 md:py-24 ${
                      flip ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] overflow-hidden">
                      <Image
                        src={w.image}
                        alt={w.name}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Detail */}
                    <div className="lg:py-4">
                      <div className="flex items-baseline justify-between gap-6">
                        <Link
                          href={`/memberships/${w.slug}`}
                          className="group/title inline-flex items-baseline gap-3"
                        >
                          <h2 className="h-section group-hover/title:text-hexa-green transition-colors">
                            {w.name}
                          </h2>
                        </Link>
                        <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green whitespace-nowrap">
                          {w.capacity}
                        </span>
                      </div>
                      <p className="lead mt-5">{w.tagline}</p>
                      <p className="prose-body mt-4 max-w-md">{w.description}</p>

                      <div className="mt-8 border-t border-ink/10 pt-8">
                        <Inclusions
                          label={
                            w.inherits
                              ? t.everythingIn(w.inherits)
                              : t.inclusionsLabel
                          }
                          items={w.inclusions}
                        />
                      </div>

                      <div className="mt-9 flex flex-wrap items-end justify-between gap-6 border-t border-ink/10 pt-6">
                        <p className="font-display font-extralight text-3xl">
                          {w.price}
                          <span className="font-body text-xs text-muted ml-2">
                            {w.unit}
                          </span>
                        </p>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/memberships/${w.slug}`}
                            className="btn-ghost"
                          >
                            {t.viewMembership}
                          </Link>
                          <EnquireButton interest={enName(w.slug)} className="btn">
                            {t.enquire}
                          </EnquireButton>
                        </div>
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
      />
    </main>
  );
}
