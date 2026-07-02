'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSpaces, getWorkspaces } from '@/data/content';
import { useEnquiry } from '@/components/enquiry/EnquiryProvider';
import { useLocale } from '@/i18n/LocaleProvider';
import LanguageToggle from '@/i18n/LanguageToggle';
import { COMMON } from '@/i18n/dictionaries/common';

// Routes whose top of page is light (no dark hero) — the header must start solid
// so the nav text is legible against the pale background.
const LIGHT_TOP_ROUTES = ['/book'];

type NavChild = { label: string; href: string; meta?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

// The member/client portal (separate app, members subdomain).
const MEMBERS_URL = 'https://members.hexaspace.com.au';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openEnquiry } = useEnquiry();
  const pathname = usePathname();
  const locale = useLocale();
  const t = COMMON[locale];
  const lightTop = LIGHT_TOP_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  const spaceLinks: NavChild[] = getSpaces(locale).map((s) => ({
    label: s.name,
    href: `/space-hire/${s.slug}`,
    meta: s.capacity,
  }));

  const workspaceLinks: NavChild[] = getWorkspaces(locale).map((w) => ({
    label: w.name,
    href: `/memberships/${w.slug}`,
    meta: w.price === 'On application' || w.price === '价格面议' ? t.nav.poa : w.price,
  }));

  const NAV: NavItem[] = [
    { label: t.nav.workspaces, href: '/memberships', children: workspaceLinks },
    { label: t.nav.spaces, href: '/space-hire', children: spaceLinks },
    { label: t.nav.community, href: '/community' },
    { label: t.nav.merch, href: '/merch' },
    { label: t.nav.about, href: '/about' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // solid = white background + black text (after scroll, while the mobile drawer
  // is open, or on light-top pages where white nav would be invisible).
  const solid = scrolled || open || lightTop;

  const link = `font-heading uppercase tracking-nav text-[10px] xl:text-[11px] whitespace-nowrap transition-colors duration-500 ${
    solid ? 'text-ink/75 hover:text-ink' : 'text-paper/80 hover:text-paper'
  }`;

  const renderDesktopItem = (item: NavItem) => {
    if (!item.children) {
      return (
        <Link key={item.href} href={item.href} className={link}>
          {item.label}
        </Link>
      );
    }
    return (
      <div key={item.href} className="relative group h-20 flex items-center">
        <Link href={item.href} className={`${link} inline-flex items-center gap-1.5`}>
          {item.label}
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden className="hidden xl:block">
            <path d="M1 1 L4 4 L7 1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>
        {/* Dropdown */}
        <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 transition-all duration-300 ease-lux group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
          <div className="w-[320px] bg-paper border border-ink/10 shadow-2xl">
            {item.children.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center justify-between gap-4 px-5 py-4 border-b border-ink/5 last:border-0 hover:bg-bone transition-colors"
              >
                <span className="font-heading uppercase tracking-[0.06em] text-[12px] text-ink">
                  {c.label}
                </span>
                {c.meta && (
                  <span className="font-heading uppercase tracking-nav text-[10px] text-hexa-green whitespace-nowrap">
                    {c.meta}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-lux border-b ${
        solid
          ? 'bg-paper/90 backdrop-blur-md border-ink/10'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container-page">
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 items-center h-20">
          {/* Left nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
            {NAV.slice(0, 4).map(renderDesktopItem)}
          </nav>

          {/* Centered wordmark */}
          <div className="flex justify-start lg:justify-center">
            <Link
              href="/"
              aria-label={t.nav.homeAria}
              className={`font-heading uppercase text-lg xl:text-xl tracking-[0.18em] xl:tracking-[0.22em] leading-none whitespace-nowrap transition-colors duration-500 ${
                solid ? 'text-ink' : 'text-paper'
              }`}
            >
              Hexa&nbsp;Space
            </Link>
          </div>

          {/* Right nav (desktop) + Member login + Enquire */}
          <div className="hidden lg:flex items-center justify-end gap-4 xl:gap-7">
            {NAV.slice(4).map(renderDesktopItem)}
            <Link href="/book" className={link}>
              {t.nav.book}
            </Link>
            <LanguageToggle
              className={`transition-colors duration-500 ${solid ? 'text-ink/75' : 'text-paper/80'}`}
            />
            <a
              href={MEMBERS_URL}
              aria-label={t.nav.memberLogin}
              title={t.nav.memberLogin}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md bg-paper text-hexa-green shadow-sm hover:opacity-80 transition-opacity duration-300 ${
                solid ? 'border border-ink/15' : ''
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M7 7.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM2.4 12c0-2.2 2-3.6 4.6-3.6s4.6 1.4 4.6 3.6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={`font-heading uppercase tracking-nav text-[10px] xl:text-[11px] border px-4 xl:px-5 py-2.5 transition-colors duration-500 ease-lux ${
                solid
                  ? 'border-ink text-ink hover:bg-ink hover:text-paper'
                  : 'border-paper text-paper hover:bg-paper hover:text-ink'
              }`}
            >
              {t.nav.enquire}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden justify-self-end flex flex-col gap-[5px] p-2"
            aria-label={t.nav.toggleMenu}
            aria-expanded={open}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-px w-6 transition-all duration-300 ${
                  solid ? 'bg-ink' : 'bg-paper'
                } ${open && i === 0 ? 'translate-y-[6px] rotate-45' : ''} ${
                  open && i === 1 ? 'opacity-0' : ''
                } ${open && i === 2 ? '-translate-y-[6px] -rotate-45' : ''}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-lux ${
          open ? 'max-h-[85vh] overflow-y-auto' : 'max-h-0'
        }`}
      >
        <nav className="container-page flex flex-col pb-8 pt-2">
          {NAV.map((item) => (
            <div key={item.href} className="border-b border-ink/10">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block font-display font-extralight text-3xl py-3 text-ink"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="pb-3 pl-1 flex flex-col gap-2">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="font-heading uppercase tracking-nav text-[11px] text-muted"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-5 flex items-center justify-between">
            <LanguageToggle className="text-ink" />
            <a
              href={MEMBERS_URL}
              onClick={() => setOpen(false)}
              className="font-heading uppercase tracking-nav text-[11px] text-muted"
            >
              {t.nav.memberLogin}
            </a>
          </div>
          <Link href="/book" onClick={() => setOpen(false)} className="mt-5 btn w-full">
            {t.nav.bookARoom}
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openEnquiry();
            }}
            className="mt-3 btn w-full"
          >
            {t.nav.enquire}
          </button>
        </nav>
      </div>
    </header>
  );
}
