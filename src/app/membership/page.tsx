import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { MEMBERSHIP_BENEFITS, WORKSPACES } from '@/data/content';

export const metadata: Metadata = {
  title: 'Membership — Hexa Space',
  description:
    'What every Hexa Space membership includes — a global Ucommune network, the members lounge, meeting and event credits, community programming and a prestigious Box Hill address.',
};

export default function MembershipPage() {
  return (
    <main>
      <PageHero
        kicker="Membership"
        title={
          <>
            Membership with
            <br />
            <span className="italic">meaning.</span>
          </>
        }
        intro="A Hexa Space membership is more than a desk. It’s a hosted environment, a global network and a community — designed for those who value how they work as much as what they do."
        image="/photos/lounge-2.jpg"
      />

      {/* Benefits grid */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">What’s included</p>
            <h2 className="h-section mt-6">
              Every membership opens the whole of Hexa.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {MEMBERSHIP_BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 100}>
                <div className="border-t border-ink pt-6">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-3xl mt-4">
                    {b.title}
                  </h3>
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
                alt="The global Ucommune network"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
            </div>

            {/* Copy */}
            <div className="max-w-xl">
              <p className="eyebrow text-paper/50">In partnership with Ucommune</p>
              <h2 className="h-display mt-6">
                A desk in
                <br />
                <span className="italic">every city.</span>
              </h2>
              <p className="lead text-paper/80 mt-7">
                As a Ucommune partner, your Hexa Space membership extends to one
                of the world’s largest workspace networks — so wherever business
                takes you, there’s a place to work waiting.
              </p>
              <Link href="/#enquire" className="btn btn-light mt-9">
                Ask about global access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers at a glance → workspaces */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">Choose your home base</p>
              <h2 className="h-section mt-6">Memberships at a glance.</h2>
            </div>
            <Link href="/workspaces" className="btn-ghost">
              View all workspaces
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {WORKSPACES.map((w) => (
              <Reveal key={w.slug} className="bg-paper">
                <Link
                  href={`/workspaces#${w.slug}`}
                  className="group flex h-full flex-col justify-between p-8 hover:bg-bone transition-colors"
                >
                  <div>
                    <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                      {w.capacity}
                    </span>
                    <h3 className="font-display font-extralight text-3xl mt-3">
                      {w.name}
                    </h3>
                    <p className="prose-body mt-3">{w.tagline}</p>
                  </div>
                  <div className="mt-8 flex items-baseline justify-between border-t border-ink/10 pt-5">
                    <p className="font-display font-extralight text-2xl">
                      {w.price}
                      <span className="font-body text-xs text-muted ml-1">
                        {w.unit}
                      </span>
                    </p>
                    <span className="btn-ghost">Details</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
