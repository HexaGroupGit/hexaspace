import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About — Hexa Space',
  description:
    'Hexa Space is a luxury workspace and members club in Box Hill, Melbourne — part of the Hexa Group. Built on people, place, culture and legacy.',
};

const PILLARS = [
  {
    title: 'People',
    copy: 'Success through collaboration. We hero the members, founders and teams who share our floor — and host them the way you’d host a guest, not a tenant.',
  },
  {
    title: 'Place',
    copy: 'Distinctly Box Hill, distinctly Melbourne’s east. We’re embedded in our locale — its energy, its diversity and its growing role as a place to build a business.',
  },
  {
    title: 'Culture',
    copy: 'A sensitive balance of Anglo and Asian influence runs through everything — from the tearoom to the programming — reflecting the community we build for.',
  },
  {
    title: 'Legacy',
    copy: 'As part of the Hexa Group, we build spaces meant to endure — considered, quietly luxurious, and made to matter for years rather than months.',
  },
];

const STATS = [
  { value: '5', label: 'Workspace memberships' },
  { value: '6', label: 'Named meeting rooms' },
  { value: '20–100', label: 'Event capacity' },
  { value: 'Global', label: 'Ucommune network' },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="About"
        title={
          <>
            More than a
            <br />
            <span className="italic">workspace.</span>
          </>
        }
        intro="Hexa Space is a luxury workspace and members club in the heart of Box Hill — bringing clarity, hospitality and intention to the working day."
        image="/photos/hero-main.jpg"
      />

      {/* Story */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 className="h-section mt-6">
              A considered home for Melbourne’s east.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pt-2">
            <div className="space-y-5 max-w-xl">
              <p className="lead">
                We set out to build the kind of workspace we wanted to work in —
                one that felt less like a serviced office and more like a private
                members club.
              </p>
              <p className="prose-body">
                Spread across a light-filled floor on Whitehorse Road, Hexa Space
                pairs architecturally designed offices and desks with a hosted
                lounge, six named meeting rooms, media and podcast studios, and a
                function space for everything from board dinners to product
                launches. Every detail — the fluted joinery, the natural light,
                the premium tea service — is there to make the work feel effortless.
              </p>
              <p className="prose-body">
                As part of the Hexa Group, a diversified Australian property and
                funds management group, we’re built on a simple belief: that
                extraordinary spaces are built on people, place, culture and legacy.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section id="ethos" className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">What we’re built on</p>
            <h2 className="h-section mt-6">People. Place. Culture. Legacy.</h2>
          </Reveal>
          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 120}>
                <div className="border-t border-ink pt-6">
                  <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-extralight text-4xl mt-4">
                    {p.title}
                  </h3>
                  <p className="prose-body mt-4 max-w-md">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Place feature */}
      <section className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
        <div className="container-page">
          <div className="grid items-center gap-10 md:gap-14 lg:gap-20 lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <Image
                src="/photos/about-2.jpg"
                alt="Hexa Space reception, Box Hill"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
            </div>
            <div className="max-w-xl">
              <p className="eyebrow text-paper/50">The place · Box Hill</p>
              <h2 className="h-display mt-6">
                Rooted in
                <br />
                <span className="italic">the locale.</span>
              </h2>
              <p className="lead text-paper/80 mt-7">
                Box Hill is one of Melbourne’s most dynamic centres — a meeting
                point of cultures, transport and ambition. Hexa Space sits at its
                heart on Level 4, 830 Whitehorse Road, with floor-to-ceiling
                windows framing the skyline.
              </p>
              <p className="prose-body text-paper/55 mt-5 max-w-md">
                It’s a short walk from the station, surrounded by some of the
                city’s best food, and connected — through our Ucommune
                partnership — to a workspace network that spans the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-paper py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="bg-paper">
                <div className="p-8 text-center">
                  <p className="font-display font-extralight text-[clamp(2.4rem,5vw,4rem)] leading-none">
                    {s.value}
                  </p>
                  <p className="eyebrow mt-4">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hexa Group */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="eyebrow">Part of something larger</p>
            <h2 className="h-section mt-6 max-w-2xl">
              A Hexa Group company.
            </h2>
            <p className="prose-body mt-6 max-w-xl">
              Hexa Space is the workspace arm of the Hexa Group — a diversified
              Australian property and funds management group creating enduring
              value through innovation and collaboration. It’s a lineage that
              shapes how we design, host and build for the long term.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Link href="/#enquire" className="btn">
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
