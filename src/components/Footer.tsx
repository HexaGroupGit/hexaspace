import Link from 'next/link';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { getSpaces, getWorkspaces } from '@/data/content';
import { getLocale } from '@/i18n/server';
import { COMMON } from '@/i18n/dictionaries/common';

export default async function Footer() {
  const locale = await getLocale();
  const t = COMMON[locale];

  const cols = [
    {
      title: t.footer.colWorkspaces,
      links: getWorkspaces(locale).map((w) => ({
        label: w.name,
        href: `/memberships#${w.slug}`,
      })),
    },
    {
      title: t.footer.colSpaces,
      links: getSpaces(locale).map((s) => ({
        label: s.name,
        href: `/space-hire#${s.slug}`,
      })),
    },
    {
      title: t.footer.colHexa,
      links: [
        { label: t.footer.community, href: '/community' },
        { label: t.footer.merch, href: '/merch' },
        { label: t.footer.podcast, href: '/podcast' },
        { label: t.footer.about, href: '/about' },
        { label: t.footer.contact, enquire: true as const },
        { label: t.footer.memberLogin, href: 'https://members.hexaspace.com.au' },
      ],
    },
  ];

  return (
    <footer className="bg-charcoal text-paper">
      {/* App teaser band */}
      <div className="border-b border-paper/10">
        <div className="container-page py-16 md:py-20 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="eyebrow text-paper/50">{t.footer.appKicker}</p>
            <h3 className="h-display mt-5 text-paper">
              {t.footer.appTitle} <span className="italic">{t.footer.appTitleItalic}</span>
            </h3>
            <p className="prose-body text-paper/60 mt-6 max-w-xl">{t.footer.appBody}</p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <span className="btn btn-light pointer-events-none opacity-70">App Store</span>
            <span className="btn btn-light pointer-events-none opacity-70">Google Play</span>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-page py-16 md:py-20 grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link
            href="/"
            aria-label={t.nav.homeAria}
            className="font-heading uppercase text-paper text-2xl tracking-[0.22em] leading-none whitespace-nowrap"
          >
            Hexa&nbsp;Space
          </Link>
          <p className="prose-body text-paper/55 mt-6 max-w-xs">
            Level 4, 830 Whitehorse Road,
            <br />
            Box Hill VIC 3128
          </p>
          <p className="prose-body text-paper/55 mt-4">
            <a href="tel:+61406016666" className="hover:text-paper transition-colors">
              +61 406 016 666
            </a>
            <br />
            <a href="mailto:info@hexaspace.com.au" className="hover:text-paper transition-colors">
              info@hexaspace.com.au
            </a>
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-paper/40">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  {'enquire' in l && l.enquire ? (
                    <EnquireButton className="font-body text-[14px] text-paper/65 hover:text-paper transition-colors">
                      {l.label}
                    </EnquireButton>
                  ) : (
                    <Link
                      href={'href' in l ? l.href! : '/'}
                      className="font-body text-[14px] text-paper/65 hover:text-paper transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal bar */}
      <div className="border-t border-paper/10">
        <div className="container-page py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-heading uppercase tracking-nav text-[10px] text-paper/40">
            {t.footer.legal.replace('{year}', String(new Date().getFullYear()))}
          </p>
          <div className="flex gap-6">
            {['Instagram', 'LinkedIn', 'Facebook'].map((s) => (
              <Link
                key={s}
                href="#"
                className="font-heading uppercase tracking-nav text-[10px] text-paper/40 hover:text-paper transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
