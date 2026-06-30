import Image from 'next/image';
import Link from 'next/link';

export default function Podcast() {
  return (
    <section id="podcast" className="bg-charcoal text-paper py-20 md:py-28 lg:py-32">
      <div className="container-page">
        <div className="grid items-center gap-10 md:gap-14 lg:gap-20 md:grid-cols-2">
          {/* Image side — crossfades into the dark background on its right/bottom edge */}
          <div className="relative aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
            <Image
              src="/photos/podcast-studio.jpg"
              alt="Hexa Space podcast studio"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* opacity crossfade: image dissolves into charcoal toward the copy */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/70" />
          </div>

          {/* Copy side */}
          <div className="max-w-xl">
            <p className="eyebrow text-paper/50">New — The Podcast Studio</p>
            <h2 className="h-display mt-6">
              Find your
              <br />
              <span className="italic">voice.</span>
            </h2>
            <p className="lead text-paper/80 mt-7">
              A broadcast-ready studio inside Hexa Space — soundproofed,
              beautifully lit and fully equipped for podcasting, interviews
              and long-form conversation.
            </p>
            <p className="prose-body text-paper/55 mt-5 max-w-md">
              Members record, edit and publish in-house. We also produce
              the Hexa Space podcast — conversations with the founders,
              makers and thinkers who share our floor.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="#enquire" className="btn btn-light">
                Book the studio
              </Link>
              <Link href="#" className="btn btn-light border-paper/30">
                Listen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
