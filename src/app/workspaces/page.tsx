import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { WORKSPACES, COMMON_INCLUSIONS } from '@/data/content';

export const metadata: Metadata = {
  title: 'Workspaces — Hexa Space',
  description:
    'Virtual offices, flexible and dedicated desks, private offices and enterprise suites in Box Hill, Melbourne — with transparent pricing and full inclusions.',
};

export default function WorkspacesPage() {
  return (
    <main>
      <PageHero
        kicker="Workspaces"
        title={
          <>
            Membership, at
            <br />
            <span className="italic">every scale.</span>
          </>
        }
        intro="From a business address to a self-contained suite — month-to-month, transparently priced, and designed around how you actually want to work."
        image="/photos/workspace.jpg"
      />

      {/* Quick index of tiers */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap gap-x-8 gap-y-3">
          {WORKSPACES.map((w) => (
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
            <p className="eyebrow">Always included</p>
            <h2 className="h-section mt-6">Every membership, beautifully serviced.</h2>
            <p className="prose-body mt-6 max-w-md">
              Whichever workspace you choose, the essentials are handled — so you
              can arrive, settle in and get to work.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Inclusions items={COMMON_INCLUSIONS} />
          </Reveal>
        </div>
      </section>

      {/* Tiers — alternating rows */}
      <section className="bg-paper">
        {WORKSPACES.map((w, i) => {
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
                        <h2 className="h-section">{w.name}</h2>
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
                              ? `Everything in ${w.inherits}, plus`
                              : 'Inclusions'
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
                        <Link href="/#enquire" className="btn">
                          Enquire
                        </Link>
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
        eyebrow="Not sure which fits?"
        title={
          <>
            Let’s find your <span className="italic">space.</span>
          </>
        }
        body="Tell us about your team and how you like to work, and we’ll tailor the right membership — then show you around in person."
      />
    </main>
  );
}
