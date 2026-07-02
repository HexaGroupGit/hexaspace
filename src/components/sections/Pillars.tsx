import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

const PILLAR_META = [
  { img: '/photos/studio.jpg', href: '/memberships' },
  { img: '/photos/lounge-2.jpg', href: '/community' },
  { img: '/photos/atelier-main.jpg', href: '/space-hire' },
];

export default async function Pillars() {
  const locale = await getLocale();
  const t = HOME[locale].pillars;

  return (
    <section id="about" className="bg-bone py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h-section mt-6">
            {t.titleA}
            <br className="hidden md:block" /> {t.titleB}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px md:grid-cols-3 bg-ink/10">
          {t.items.map((p, i) => (
            <Reveal key={p.name} delay={i * 120} className="group bg-bone">
              <Link href={PILLAR_META[i].href} className="block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={PILLAR_META[i].img}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                  />
                </div>
                <div className="pt-7 pb-2 px-5 md:px-6">
                  <h3 className="font-display font-extralight text-4xl">{p.name}</h3>
                  <p className="prose-body mt-4 max-w-sm">{p.copy}</p>
                  <span className="btn-ghost mt-6">
                    {t.explore} {p.name}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
