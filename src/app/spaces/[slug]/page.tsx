import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import { SPACES } from '@/data/content';

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const space = SPACES.find((s) => s.slug === slug);
  if (!space) return {};
  return {
    title: `${space.name} — Hexa Space`,
    description: space.description,
  };
}

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = SPACES.find((s) => s.slug === slug);
  if (!space) notFound();

  const others = SPACES.filter((s) => s.slug !== slug);

  return (
    <main>
      <PageHero
        kicker={space.kicker}
        title={space.name}
        intro={space.description}
        image={space.image}
      />

      {/* Booking bar */}
      <section className="bg-ink text-paper">
        <div className="container-page py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-heading uppercase tracking-label text-[11px] text-paper/50">
              Capacity
            </span>
            <span className="font-display font-extralight text-xl">{space.capacity}</span>
          </div>
          <Link
            href="/#enquire"
            className="font-heading uppercase tracking-nav text-[11px] border border-paper px-6 py-3 hover:bg-paper hover:text-ink transition-colors duration-500 ease-lux"
          >
            {space.bookingLabel}
          </Link>
        </div>
      </section>

      {/* Overview + inclusions */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Overview</p>
            <h2 className="h-section mt-6">A space that works as hard as you do.</h2>
            <p className="lead mt-7">{space.intro}</p>
          </Reveal>
          <Reveal delay={120} className="lg:pt-2">
            <Inclusions label="What’s included" items={space.inclusions} />
          </Reveal>
        </div>
      </section>

      {/* Individually bookable rooms (meeting rooms) */}
      {space.rooms && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">The rooms</p>
              <h2 className="h-section mt-6">Six rooms, each with its own character.</h2>
            </Reveal>

            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {space.rooms.map((room, i) => (
                <Reveal key={room.name} delay={(i % 3) * 90}>
                  <article className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={room.image}
                        alt={`${room.name} room`}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                      />
                      <span className="absolute left-0 top-0 bg-ink/80 text-paper font-heading uppercase tracking-nav text-[10px] px-3 py-2">
                        {room.price}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col pt-6">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display font-extralight text-3xl">
                          {room.name}
                        </h3>
                        <span className="font-heading uppercase tracking-nav text-[11px] text-muted">
                          {room.alt}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                          {room.capacity}
                        </span>
                        {room.note && (
                          <span className="font-heading uppercase tracking-label text-[11px] text-muted border-l border-ink/15 pl-3">
                            {room.note}
                          </span>
                        )}
                      </div>

                      <ul className="mt-5 space-y-2.5 flex-1">
                        {room.features.map((f) => (
                          <li key={f} className="flex gap-3">
                            <span className="mt-[9px] h-1 w-1 shrink-0 bg-hexa-green" />
                            <span className="font-body text-[14px] leading-[1.6] text-charcoal">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link href="/#enquire" className="btn mt-7 w-full">
                        Book now
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Configurations */}
      {space.configurations && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Configurations</p>
              <h2 className="h-section mt-6">One room, arranged your way.</h2>
            </Reveal>
            <div className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {space.configurations.map((c, i) => (
                <Reveal key={c.layout} delay={i * 90} className="bg-paper">
                  <div className="p-8 h-full">
                    <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                      0{i + 1}
                    </span>
                    <h3 className="font-display font-extralight text-3xl mt-4">
                      {c.layout}
                    </h3>
                    <p className="font-heading uppercase tracking-nav text-[11px] text-hexa-green mt-3">
                      {c.capacity}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {space.gallery && (
        <section className="bg-bone py-20 md:py-28">
          <div className="container-page">
            <Reveal>
              <p className="eyebrow">The space</p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:gap-6 md:grid-cols-3">
              {space.gallery.map((src, i) => (
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
                      alt={`${space.name} ${i + 1}`}
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
      )}

      {/* Booking CTA */}
      <CTASection
        eyebrow={space.kicker}
        title={
          <>
            Ready to <span className="italic">book?</span>
          </>
        }
        body="Tell us your dates and what you have in mind — our team will confirm availability and tailor the space to suit."
        primaryLabel={space.bookingLabel}
      />

      {/* Explore other spaces */}
      <section className="bg-paper py-16 md:py-20 border-t border-ink/10">
        <div className="container-page">
          <p className="eyebrow">More spaces</p>
          <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/spaces/${s.slug}`}
                className="group bg-paper p-7 hover:bg-bone transition-colors"
              >
                <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                  {s.capacity}
                </span>
                <h3 className="font-display font-extralight text-2xl mt-3">{s.name}</h3>
                <p className="prose-body mt-2">{s.summary}</p>
                <span className="btn-ghost mt-5">View</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
