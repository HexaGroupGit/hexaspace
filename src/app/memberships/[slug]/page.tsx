import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { WORKSPACES, getWorkspaces, getCommonInclusions } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export function generateStaticParams() {
  return WORKSPACES.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const workspace = getWorkspaces(locale).find((w) => w.slug === slug);
  if (!workspace) return {};
  return {
    title: `${workspace.name} — Hexa Space`,
    description: workspace.description,
  };
}

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = PAGES[locale].workspaceDetail;
  const workspaces = getWorkspaces(locale);
  const workspace = workspaces.find((w) => w.slug === slug);
  if (!workspace) notFound();

  const others = workspaces.filter((w) => w.slug !== slug);
  const commonInclusions = getCommonInclusions(locale);
  // The value posted to /api/enquire stays in English.
  const enInterest = WORKSPACES.find((w) => w.slug === slug)?.name;

  return (
    <main>
      <PageHero
        kicker={t.membershipKicker(workspace.capacity)}
        title={workspace.name}
        intro={workspace.tagline}
        image={workspace.image}
      />

      {/* Pricing bar */}
      <section className="bg-ink text-paper">
        <div className="container-page py-6 flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <span className="block font-heading uppercase tracking-label text-[11px] text-paper/50">
                {workspace.price === 'On application' ? t.pricing : t.from}
              </span>
              <span className="font-display font-extralight text-2xl mt-1">
                {workspace.price}
                {workspace.unit && (
                  <span className="font-body text-xs text-paper/60 ml-2">
                    {workspace.unit}
                  </span>
                )}
              </span>
            </div>
            <div className="border-l border-paper/15 pl-10 hidden sm:block">
              <span className="block font-heading uppercase tracking-label text-[11px] text-paper/50">
                {t.term}
              </span>
              <span className="font-display font-extralight text-2xl mt-1">
                {workspace.term}
              </span>
            </div>
            <div className="border-l border-paper/15 pl-10 hidden lg:block">
              <span className="block font-heading uppercase tracking-label text-[11px] text-paper/50">
                {t.capacity}
              </span>
              <span className="font-display font-extralight text-2xl mt-1">
                {workspace.capacity}
              </span>
            </div>
          </div>
          <EnquireButton
            interest={enInterest}
            className="font-heading uppercase tracking-nav text-[11px] border border-paper px-6 py-3 hover:bg-paper hover:text-ink transition-colors duration-500 ease-lux"
          >
            {t.enquire}
          </EnquireButton>
        </div>
      </section>

      {/* Overview + inclusions */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.overviewEyebrow}</p>
            <h2 className="h-section mt-6">{workspace.tagline}</h2>
            <p className="lead mt-7">{workspace.intro}</p>
            <p className="mt-8 font-heading uppercase tracking-label text-[11px] text-hexa-green">
              {t.idealFor}
            </p>
            <p className="prose-body mt-2 max-w-md">{workspace.idealFor}</p>
          </Reveal>
          <Reveal delay={120} className="lg:pt-2">
            <Inclusions
              label={
                workspace.inherits
                  ? t.everythingIn(workspace.inherits)
                  : t.whatsIncluded
              }
              items={workspace.inclusions}
            />
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t.whyEyebrow}</p>
            <h2 className="h-section mt-6">{t.whyTitle}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-3">
            {workspace.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 90} className="bg-paper">
                <div className="p-8 h-full">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-2xl mt-4">
                    {h.title}
                  </h3>
                  <p className="prose-body mt-3">{h.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">{t.galleryEyebrow}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:gap-6 md:grid-cols-3">
            {workspace.gallery.map((src, i) => (
              <Reveal
                key={src + i}
                delay={i * 100}
                className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
              >
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? 'aspect-[4/3] md:h-full md:min-h-[420px]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${workspace.name} ${i + 1}`}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-lux hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Always included across every membership */}
      <section className="bg-paper py-20 md:py-28 border-t border-ink/10">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">{t.alwaysEyebrow}</p>
            <h2 className="h-section mt-6">
              {t.alwaysTitle}
            </h2>
            <p className="prose-body mt-6 max-w-md">
              {t.alwaysBody}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Inclusions items={commonInclusions} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        eyebrow={`${workspace.name} · ${workspace.price}${workspace.unit}`}
        title={
          <>
            {t.ctaTitle} <span className="italic">{t.ctaTitleItalic}</span>
          </>
        }
        body={t.ctaBody}
        primaryLabel={t.ctaPrimary}
        interest={enInterest}
      />

      {/* Other memberships */}
      <section className="bg-paper py-16 md:py-20 border-t border-ink/10">
        <div className="container-page">
          <p className="eyebrow">{t.othersEyebrow}</p>
          <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((w) => (
              <Link
                key={w.slug}
                href={`/memberships/${w.slug}`}
                className="group bg-paper p-7 hover:bg-bone transition-colors"
              >
                <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                  {w.capacity}
                </span>
                <h3 className="font-display font-extralight text-2xl mt-3">{w.name}</h3>
                <p className="prose-body mt-2">{w.tagline}</p>
                <span className="btn-ghost mt-5">
                  {w.price}
                  {w.unit}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
