import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import TourButton from '@/components/enquiry/TourButton';
import { getWorkspaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { HOME } from '@/i18n/dictionaries/home';

export default async function Workspaces() {
  const locale = await getLocale();
  const t = HOME[locale].workspaces;

  const tiers = getWorkspaces(locale).map((w) => ({
    slug: w.slug,
    name: w.name,
    price: w.price,
    unit: w.unit,
    img: w.image,
    copy: w.description,
  }));

  return (
    <section id="workspaces" className="bg-paper py-24 md:py-36">
      <div className="container-page">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h-section mt-6">{t.title}</h2>
          </div>
          <p className="prose-body max-w-md">{t.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((w, i) => (
            <Reveal key={w.slug} delay={(i % 3) * 100} className="group bg-paper">
              <Link href={`/memberships/${w.slug}`} className="flex h-full flex-col">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={w.img}
                    alt={w.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-heading uppercase tracking-[0.06em] text-sm">{w.name}</h3>
                  </div>
                  <p className="prose-body mt-3 min-h-[66px]">{w.copy}</p>
                  <div className="mt-6 flex items-end justify-between border-t border-ink/10 pt-5">
                    <p className="font-display font-extralight text-2xl">
                      {w.price}
                      <span className="font-body text-xs text-muted ml-1">{w.unit}</span>
                    </p>
                    <span className="btn-ghost group-hover:text-hexa-green">{t.view}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* Trailing CTA cell to complete the grid */}
          <Reveal delay={200} className="bg-hexa-green text-paper flex">
            <TourButton className="flex flex-col justify-between p-8 w-full text-left group">
              <p className="eyebrow text-paper/70">{t.unsure}</p>
              <div>
                <h3 className="font-display font-extralight text-3xl leading-tight">
                  {t.tourCard}
                </h3>
                <span className="btn-ghost mt-6 text-paper border-paper/40 group-hover:border-paper">
                  {t.arrange}
                </span>
              </div>
            </TourButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
