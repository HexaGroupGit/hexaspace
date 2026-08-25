import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import StudioRequestForm from '@/components/studio/StudioRequestForm';
import { getLocale } from '@/i18n/server';
import { STUDIO } from '@/i18n/dictionaries/studio';

// The Podcast Studio — the room you hire.
//
// Distinct from /podcast, which is the show. This page exists because the
// studio is staff-operated and cannot be instantly booked: it has to carry the
// policies, the time budget and the guest guide BEFORE anyone gets to a form,
// so nobody arrives expecting an hour of recording in a one-hour booking.

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = STUDIO[locale].meta;
  return { title: t.title, description: t.description };
}

// Proportional widths for the session timeline — 30 / 15 / 15 minutes.
const PHASE_FLEX = [30, 15, 15];

export default async function PodcastStudioPage() {
  const locale = await getLocale();
  const t = STUDIO[locale];

  return (
    <main>
      <PageHero
        kicker={t.hero.kicker}
        title={<>{t.hero.title} <span className="italic">{t.hero.titleItalic}</span></>}
        intro={t.hero.intro}
        image="/photos/podcast-studio.jpg"
      />

      {/* ── The rig ─────────────────────────────────────────────────────── */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.rig.eyebrow}</p>
            <h2 className="h-display text-[clamp(2rem,4.5vw,3.4rem)] mt-6">{t.rig.title}</h2>
            <p className="lead mt-6">{t.rig.lead}</p>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal delay={100}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/photos/podcast-console.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={160}>
              <dl className="divide-y divide-ink/10 border-t border-ink/10">
                {t.rig.items.map((item) => (
                  <div key={item.title} className="py-6">
                    <dt className="font-heading uppercase tracking-nav text-[12px] text-ink">{item.title}</dt>
                    <dd className="text-[15px] leading-relaxed text-muted mt-2.5">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How a session runs ──────────────────────────────────────────── */}
      <section className="bg-bone py-20 md:py-28 border-y border-ink/10">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.session.eyebrow}</p>
            <h2 className="h-display text-[clamp(2rem,4.5vw,3.4rem)] mt-6">{t.session.title}</h2>
            <p className="lead mt-6">{t.session.lead}</p>
          </Reveal>

          <Reveal delay={120} className="mt-12">
            {/* The hour, drawn to scale. Recording is the small slice — that is
                the entire point of showing it rather than describing it. */}
            <div className="flex h-16 border border-ink/15 overflow-hidden">
              {t.session.phases.map((p, i) => (
                <div
                  key={p.label}
                  style={{ flex: PHASE_FLEX[i] }}
                  className={`flex flex-col justify-center px-3 min-w-0 ${
                    i === 1 ? 'bg-hexa-green/15' : 'bg-paper'
                  } ${i > 0 ? 'border-l border-ink/15' : ''}`}
                >
                  <span className="font-heading uppercase tracking-nav text-[10px] text-ink truncate">{p.label}</span>
                  <span className="text-[11px] text-muted truncate">{p.time}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3 font-heading uppercase tracking-nav">
              {locale === 'zh' ? '一小时预约的实际构成' : 'A one-hour booking, to scale'}
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {t.session.phases.map((p) => (
                <div key={p.label} className="border-t border-ink/15 pt-5">
                  <p className="font-heading uppercase tracking-nav text-[11px] text-ink">{p.label}</p>
                  <p className="font-heading uppercase tracking-nav text-[11px] text-hexa-green mt-1">{p.time}</p>
                  <p className="text-[15px] leading-relaxed text-muted mt-3">{p.body}</p>
                </div>
              ))}
            </div>

            <p className="lead mt-12 max-w-3xl">{t.session.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Policies ────────────────────────────────────────────────────── */}
      <section id="policies" className="bg-paper py-20 md:py-28 scroll-mt-24">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.policies.eyebrow}</p>
            <h2 className="h-display text-[clamp(2rem,4.5vw,3.4rem)] mt-6">{t.policies.title}</h2>
            <p className="lead mt-6">{t.policies.lead}</p>
          </Reveal>

          <Reveal delay={100} className="mt-12">
            <ol className="grid gap-x-14 gap-y-9 md:grid-cols-2">
              {t.policies.items.map((p, i) => (
                <li key={p.title} className="border-t border-ink/15 pt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-[11px] tracking-nav text-hexa-green tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading uppercase tracking-nav text-[12px] text-ink">{p.title}</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted mt-3">{p.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ── Guest guide ─────────────────────────────────────────────────── */}
      <section id="guest-guide" className="bg-ink text-paper py-20 md:py-28 scroll-mt-24">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-paper/50">{t.guests.eyebrow}</p>
            <h2 className="h-display mt-6 text-[clamp(2rem,4.5vw,3.4rem)]">{t.guests.title}</h2>
            <p className="lead text-paper/80 mt-6">{t.guests.lead}</p>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.guests.groups.map((g, i) => (
              <Reveal key={g.title} delay={80 * i}>
                <div className="border-t border-paper/25 pt-5">
                  <h3 className="font-heading uppercase tracking-nav text-[12px] text-paper">{g.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {g.items.map((item) => (
                      <li key={item} className="text-[14px] leading-relaxed text-paper/75 flex gap-2.5">
                        <span aria-hidden className="text-hexa-green shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Request a session ───────────────────────────────────────────── */}
      <section id="request" className="bg-bone py-20 md:py-28 scroll-mt-24">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.request.eyebrow}</p>
            <h2 className="h-display text-[clamp(2rem,4.5vw,3.4rem)] mt-6">{t.request.title}</h2>
            <p className="lead mt-6">{t.request.lead}</p>
          </Reveal>
          <Reveal delay={120} className="mt-12 max-w-3xl">
            <StudioRequestForm t={t.request} endpoint="/api/studio-request" />
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow={t.cta.eyebrow}
        title={<>{t.cta.title} <span className="italic">{t.cta.titleItalic}</span></>}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        tour
      />
    </main>
  );
}
