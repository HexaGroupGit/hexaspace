import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const PILLARS = [
  {
    name: 'Studio',
    img: '/photos/studio.jpg',
    copy: 'Private offices, dedicated desks and flexible space — composed environments designed for focus and daily excellence.',
    href: '/workspaces',
  },
  {
    name: 'Lounge',
    img: '/photos/lounge-2.jpg',
    copy: 'The members lounge — a place to meet, host and spend time together, with the warmth of considered hospitality.',
    href: '/membership',
  },
  {
    name: 'Atelier',
    img: '/photos/atelier-main.jpg',
    copy: 'A setting for ideas, events, media and podcasting — shared moments that reach beyond the working day.',
    href: '/spaces',
  },
];

export default function Pillars() {
  return (
    <section id="about" className="bg-bone py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The Hexa system</p>
          <h2 className="h-section mt-6">
            Three settings for a
            <br className="hidden md:block" /> considered working life.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px md:grid-cols-3 bg-ink/10">
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={i * 120} className="group bg-bone">
              <Link href={p.href} className="block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                  />
                </div>
                <div className="pt-7 pb-2 px-5 md:px-6">
                  <h3 className="font-display font-extralight text-4xl">{p.name}</h3>
                  <p className="prose-body mt-4 max-w-sm">{p.copy}</p>
                  <span className="btn-ghost mt-6">Explore {p.name}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
