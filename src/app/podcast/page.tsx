import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { EPISODES, PLATFORMS, SPACES } from '@/data/content';

export const metadata: Metadata = {
  title: 'The Podcast — Hexa Space',
  description:
    'The Hexa Space podcast — conversations with the founders, makers and thinkers who share our floor. Recorded in our broadcast-ready studio in Box Hill, Melbourne.',
};

const studio = SPACES.find((s) => s.slug === 'podcast-studio')!;
const [featured, ...rest] = EPISODES;

export default function PodcastPage() {
  return (
    <main>
      <PageHero
        kicker="The Podcast"
        title={
          <>
            Conversations
            <br />
            from <span className="italic">our floor.</span>
          </>
        }
        intro="The Hexa Space podcast puts the founders, makers and thinkers who share our space at the centre of the story — recorded in our broadcast-ready studio in Box Hill."
        image="/photos/podcast-studio.jpg"
      />

      {/* Listen on */}
      <section className="bg-paper border-b border-ink/10">
        <div className="container-page py-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="eyebrow">Listen on</span>
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
            <p className="eyebrow">Latest episode</p>
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
                  aria-label="Play episode"
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
                  Episode {featured.number} · {featured.duration}
                </span>
                <h2 className="h-display text-[clamp(2rem,4.5vw,3.6rem)] mt-4">
                  {featured.title}
                </h2>
                <p className="lead mt-5">
                  {featured.guest} — <span className="text-muted">{featured.role}</span>
                </p>
                <p className="prose-body mt-4 max-w-md">{featured.blurb}</p>
                <Link href="#" className="btn mt-8">
                  Play episode
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
            <p className="eyebrow">More episodes</p>
            <h2 className="h-section mt-6">The back catalogue.</h2>
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
                Record your
                <br />
                <span className="italic">own.</span>
              </h2>
              <p className="lead text-paper/80 mt-7">
                The same studio we record in is yours to book — soundproofed,
                beautifully lit and fully equipped, with in-house production to
                take you from idea to published episode.
              </p>
              <div className="mt-8">
                <Inclusions items={studio.inclusions} light />
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/#enquire" className="btn btn-light">
                  Book the studio
                </Link>
                <Link href="/spaces#podcast-studio" className="btn btn-light border-paper/30">
                  Studio details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Be a guest"
        title={
          <>
            Have a story <span className="italic">to tell?</span>
          </>
        }
        body="We’re always looking for founders, makers and thinkers from our community to join us on the show. Tell us what you’re working on."
        primaryLabel="Pitch yourself as a guest"
      />
    </main>
  );
}
