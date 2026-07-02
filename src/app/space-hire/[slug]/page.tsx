import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Inclusions from '@/components/Inclusions';
import CTASection from '@/components/CTASection';
import Reveal from '@/components/Reveal';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { SPACES, getSpaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { PAGES } from '@/i18n/dictionaries/pages';

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const space = getSpaces(locale).find((s) => s.slug === slug);
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
  const locale = await getLocale();
  const t = PAGES[locale].spaceDetail;
  const spaces = getSpaces(locale);
  const space = spaces.find((s) => s.slug === slug);
  if (!space) notFound();

  const others = spaces.filter((s) => s.slug !== slug);
  // The value posted to /api/enquire stays in English.
  const enInterest = SPACES.find((s) => s.slug === slug)?.name;

  // Meeting rooms + studios are bookable online; the function space stays enquiry-based.
  const bookable = ['meeting-rooms', 'media-studios', 'podcast-studio'].includes(space.slug);
  const bookHref = space.slug === 'meeting-rooms' ? '/book' : '/book?tab=studio';

  // East (the Chinese Tearoom) is featured full-width on top; the rest fill the grid.
  // In zh the room's name/alt are swapped, so match either field.
  const featuredRoom =
    space.rooms?.find((r) => r.name === 'East' || r.alt === 'East') ?? space.rooms?.[0];
  const otherRooms = space.rooms?.filter((r) => r !== featuredRoom) ?? [];

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
              {t.capacity}
            </span>
            <span className="font-display font-extralight text-xl">{space.capacity}</span>
          </div>
          {bookable ? (
            <Link
              href={bookHref}
              className="font-heading uppercase tracking-nav text-[11px] border border-paper px-6 py-3 hover:bg-paper hover:text-ink transition-colors duration-500 ease-lux"
            >
              {space.bookingLabel}
            </Link>
          ) : (
            <EnquireButton
              interest={enInterest}
              className="font-heading uppercase tracking-nav text-[11px] border border-paper px-6 py-3 hover:bg-paper hover:text-ink transition-colors duration-500 ease-lux"
            >
              {space.bookingLabel}
            </EnquireButton>
          )}
        </div>
      </section>

      {/* Overview + inclusions */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.overviewEyebrow}</p>
            <h2 className="h-section mt-6">{t.overviewTitle}</h2>
            <p className="lead mt-7">{space.intro}</p>
          </Reveal>
          <Reveal delay={120} className="lg:pt-2">
            <Inclusions label={t.whatsIncluded} items={space.inclusions} />
          </Reveal>
        </div>
      </section>

      {/* Individually bookable rooms (meeting rooms) */}
      {space.rooms && featuredRoom && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">{t.roomsEyebrow}</p>
              <h2 className="h-section mt-6">{t.roomsTitle}</h2>
            </Reveal>

            {/* Featured — East, full width across all three columns */}
            <Reveal className="mt-14">
              <article className="group grid overflow-hidden border border-ink/10 lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[440px] overflow-hidden">
                  <Image
                    src={featuredRoom.image}
                    alt={t.roomAlt(featuredRoom.name)}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                  />
                  <span className="absolute left-0 top-0 bg-ink/80 text-paper font-heading uppercase tracking-nav text-[10px] px-3 py-2">
                    {featuredRoom.price}
                  </span>
                </div>
                <div className="flex flex-col p-8 md:p-10 lg:p-14">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display font-extralight text-4xl md:text-5xl">{featuredRoom.name}</h3>
                    <span className="font-heading uppercase tracking-nav text-[11px] text-muted">{featuredRoom.alt}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">{featuredRoom.capacity}</span>
                    {featuredRoom.note && (
                      <span className="font-heading uppercase tracking-label text-[11px] text-muted border-l border-ink/15 pl-3">{featuredRoom.note}</span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {featuredRoom.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-[9px] h-1 w-1 shrink-0 bg-hexa-green" />
                        <span className="font-body text-[14px] leading-[1.6] text-charcoal">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book" className="btn mt-8 w-full sm:w-auto sm:self-start">{t.bookNow}</Link>
                </div>
              </article>
            </Reveal>

            {/* The other six */}
            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {otherRooms.map((room, i) => (
                <Reveal key={room.name} delay={(i % 3) * 90}>
                  <article className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={room.image}
                        alt={t.roomAlt(room.name)}
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

                      <Link href="/book" className="btn mt-7 w-full">
                        {t.bookNow}
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
              <p className="eyebrow">{t.configEyebrow}</p>
              <h2 className="h-section mt-6">{t.configTitle}</h2>
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
              <p className="eyebrow">{t.galleryEyebrow}</p>
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
            {t.ctaTitle} <span className="italic">{t.ctaTitleItalic}</span>
          </>
        }
        body={t.ctaBody}
        primaryLabel={space.bookingLabel}
        interest={enInterest}
        href={bookable ? bookHref : undefined}
      />

      {/* Explore other spaces */}
      <section className="bg-paper py-16 md:py-20 border-t border-ink/10">
        <div className="container-page">
          <p className="eyebrow">{t.moreEyebrow}</p>
          <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/space-hire/${s.slug}`}
                className="group bg-paper p-7 hover:bg-bone transition-colors"
              >
                <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                  {s.capacity}
                </span>
                <h3 className="font-display font-extralight text-2xl mt-3">{s.name}</h3>
                <p className="prose-body mt-2">{s.summary}</p>
                <span className="btn-ghost mt-5">{t.view}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
