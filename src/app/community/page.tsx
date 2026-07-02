import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { getMembershipBenefits, getWorkspaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { COMMUNITY } from '@/i18n/dictionaries/community';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COMMUNITY[locale].meta;
  return { title: t.title, description: t.description };
}

export default async function CommunityPage() {
  const locale = await getLocale();
  const t = COMMUNITY[locale];
  const benefits = getMembershipBenefits(locale);
  const workspaces = getWorkspaces(locale);

  return (
    <main>
      <PageHero
        kicker={t.hero.kicker}
        title={
          <>
            {t.hero.title}
            <br />
            <span className="italic">{t.hero.titleItalic}</span>
          </>
        }
        intro={t.hero.intro}
        image="/photos/community/grand-opening-1.jpg"
      />

      {/* Programming — what's on */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.programming.eyebrow}</p>
            <h2 className="h-section mt-6">{t.programming.title}</h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {t.programming.items.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 100}>
                <div className="border-t border-ink pt-6">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-3xl mt-4">{p.title}</h3>
                  <p className="prose-body mt-4">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Event photo gallery */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.gallery.eyebrow}</p>
              <h2 className="h-section mt-6">{t.gallery.title}</h2>
            </div>
            <p className="prose-body max-w-md">{t.gallery.body}</p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.gallery.items.map((g, i) => {
              const featured = i === 0 || i === 7;
              return (
                <Reveal
                  key={g.src + i}
                  delay={(i % 3) * 90}
                  className={featured ? 'sm:col-span-2' : ''}
                >
                  <figure className="group">
                    <div
                      className={`relative overflow-hidden ${
                        featured ? 'aspect-[2/1]' : 'aspect-[4/3]'
                      }`}
                    >
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes={featured ? '(max-width:640px) 100vw, 66vw' : '(max-width:640px) 100vw, 33vw'}
                        className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                      <span className="font-heading uppercase tracking-[0.06em] text-[11px] text-ink">
                        {g.event}
                      </span>
                      <span className="font-heading uppercase tracking-nav text-[10px] text-muted whitespace-nowrap">
                        {g.date}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Member voices */}
      <section className="bg-charcoal text-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-paper/50">{t.voices.eyebrow}</p>
            <h2 className="h-section mt-6 text-paper">{t.voices.title}</h2>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {t.voices.items.map((v, i) => (
              <Reveal key={v.role} delay={i * 120}>
                <blockquote className="border-t border-paper/25 pt-6 flex h-full flex-col justify-between">
                  <p className="font-display font-extralight text-2xl leading-[1.35]">
                    “{v.quote}”
                  </p>
                  <footer className="eyebrow text-paper/50 mt-8">{v.role}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.benefits.eyebrow}</p>
            <h2 className="h-section mt-6">{t.benefits.title}</h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 100}>
                <div className="border-t border-ink pt-6">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-3xl mt-4">{b.title}</h3>
                  <p className="prose-body mt-4">{b.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ucommune global network feature */}
      <section className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
        <div className="container-page">
          <div className="grid items-center gap-10 md:gap-14 lg:gap-20 lg:grid-cols-2">
            {/* Image — crossfades into the dark background */}
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <Image
                src="/photos/culture.jpg"
                alt={t.ucommune.imageAlt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
            </div>

            {/* Copy */}
            <div className="max-w-xl">
              <p className="eyebrow text-paper/50">{t.ucommune.eyebrow}</p>
              <h2 className="h-display mt-6">
                {t.ucommune.title}
                <br />
                <span className="italic">{t.ucommune.titleItalic}</span>
              </h2>
              <p className="lead text-paper/80 mt-7">{t.ucommune.body}</p>
              <EnquireButton interest="Membership" className="btn btn-light mt-9">
                {t.ucommune.cta}
              </EnquireButton>
            </div>
          </div>
        </div>
      </section>

      {/* Hexa Hub ecosystem strip */}
      <section className="bg-hexa-green text-paper py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-paper/70">{t.hub.eyebrow}</p>
            <h2 className="h-section mt-6 text-paper">{t.hub.title}</h2>
            <p className="prose-body text-paper/80 mt-6 max-w-xl">{t.hub.body}</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-heading uppercase tracking-label text-[11px] leading-[2.2] text-paper/80 lg:pl-10 border-t border-paper/30 pt-6 lg:border-t-0 lg:border-l lg:pt-0">
              {t.hub.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tiers at a glance → workspaces */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{t.tiers.eyebrow}</p>
              <h2 className="h-section mt-6">{t.tiers.title}</h2>
            </div>
            <Link href="/memberships" className="btn-ghost">
              {t.tiers.viewAll}
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((w) => (
              <Reveal key={w.slug} className="bg-paper">
                <Link
                  href={`/memberships/${w.slug}`}
                  className="group flex h-full flex-col justify-between p-8 hover:bg-bone transition-colors"
                >
                  <div>
                    <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                      {w.capacity}
                    </span>
                    <h3 className="font-display font-extralight text-3xl mt-3">{w.name}</h3>
                    <p className="prose-body mt-3">{w.tagline}</p>
                  </div>
                  <div className="mt-8 flex items-baseline justify-between border-t border-ink/10 pt-5">
                    <p className="font-display font-extralight text-2xl">
                      {w.price}
                      <span className="font-body text-xs text-muted ml-1">{w.unit}</span>
                    </p>
                    <span className="btn-ghost">{t.tiers.details}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow={t.cta.eyebrow}
        title={
          <>
            {t.cta.title} <span className="italic">{t.cta.titleItalic}</span>
          </>
        }
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        tour
      />
    </main>
  );
}
