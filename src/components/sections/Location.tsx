import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export default function Location() {
  return (
    <section id="enquire" className="bg-bone py-24 md:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">Visit · Box Hill</p>
          <h2 className="h-display mt-6">
            Come and see
            <br />
            <span className="italic">the space.</span>
          </h2>
          <p className="lead mt-7 max-w-lg">
            The best way to understand Hexa Space is to stand in it. Arrange a
            private tour and we will show you the floor, the lounge and the studios.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 max-w-lg">
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">Address</p>
              <p className="prose-body text-ink mt-3">
                Level 4, 830 Whitehorse Road,
                <br />
                Box Hill VIC 3128
              </p>
            </div>
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">Contact</p>
              <p className="prose-body text-ink mt-3">
                <a href="tel:+61406016666" className="hover:text-hexa-green transition-colors">
                  +61 406 016 666
                </a>
                <br />
                <a
                  href="mailto:info@hexaspace.com.au"
                  className="hover:text-hexa-green transition-colors"
                >
                  info@hexaspace.com.au
                </a>
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="mailto:info@hexaspace.com.au" className="btn">
              Book a private tour
            </Link>
            <Link href="#" className="btn-ghost self-center">
              Download brochure
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/photos/location.jpg"
              alt="Hexa Space, Box Hill"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
