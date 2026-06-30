import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { SPACES } from '@/data/content';

export const metadata: Metadata = {
  title: 'Spaces — Hexa Space',
  description:
    'The Function Space, meeting rooms, media studios and podcast studio at Hexa Space, Box Hill — for events from 20 to 150, meetings from 4 to 26, and broadcast-ready production.',
};

export default function SpacesPage() {
  return (
    <main>
      <PageHero
        kicker="The Spaces"
        title={
          <>
            A place to host,
            <br />
            gather <span className="italic">and create.</span>
          </>
        }
        intro="More than desks — a versatile function space, light-filled meeting rooms and purpose-built studios for media and podcasting, all under one roof in Box Hill."
        image="/photos/event-space.jpg"
      />

      {/* Index */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap gap-x-8 gap-y-3">
          {SPACES.map((s) => (
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
        {SPACES.map((s, i) => {
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
                        <Inclusions label="What’s included" items={s.inclusions} />
                      </div>

                      <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link href={`/spaces/${s.slug}`} className="btn">
                          View {s.name}
                        </Link>
                        <Link href="/#enquire" className="btn-ghost self-center">
                          {s.bookingLabel}
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
        eyebrow="Host with Hexa"
        title={
          <>
            Plan your <span className="italic">event.</span>
          </>
        }
        body="From an intimate boardroom session to a 150-guest launch, our team will help you shape the space, the catering and the run of show."
        primaryLabel="Enquire about hosting"
      />
    </main>
  );
}
