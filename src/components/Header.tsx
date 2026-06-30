'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SPACES } from '@/data/content';

type NavChild = { label: string; href: string; meta?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const SPACE_LINKS: NavChild[] = SPACES.map((s) => ({
  label: s.name,
  href: `/spaces/${s.slug}`,
  meta: s.capacity,
}));

const NAV: NavItem[] = [
  { label: 'Workspaces', href: '/workspaces' },
  { label: 'Spaces', href: '/spaces', children: SPACE_LINKS },
  { label: 'Membership', href: '/membership' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // solid = white background + black text (after scroll, or while the mobile drawer is open).
  const solid = scrolled || open;

  const link = `font-heading uppercase tracking-nav text-[11px] transition-colors duration-500 ${
    solid ? 'text-ink/75 hover:text-ink' : 'text-paper/80 hover:text-paper'
  }`;

  const renderDesktopItem = (item: NavItem) => {
    if (!item.children) {
      return (
        <Link key={item.label} href={item.href} className={link}>
          {item.label}
        </Link>
      );
    }
    return (
      <div key={item.label} className="relative group h-20 flex items-center">
        <Link href={item.href} className={`${link} inline-flex items-center gap-1.5`}>
          {item.label}
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden>
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
        <div className="grid grid-cols-3 items-center h-20">
          {/* Left nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.slice(0, 3).map(renderDesktopItem)}
          </nav>

          {/* Centered wordmark */}
          <div className="flex justify-start lg:justify-center col-span-1">
            <Link
              href="/"
              aria-label="Hexa Space home"
              className={`font-heading uppercase text-lg md:text-xl tracking-[0.22em] leading-none whitespace-nowrap transition-colors duration-500 ${
                solid ? 'text-ink' : 'text-paper'
              }`}
            >
              Hexa&nbsp;Space
            </Link>
          </div>

          {/* Right nav (desktop) + Enquire */}
          <div className="hidden lg:flex items-center justify-end gap-8">
            {NAV.slice(3).map(renderDesktopItem)}
            <Link
              href="/#enquire"
              className={`font-heading uppercase tracking-nav text-[11px] border px-5 py-2.5 transition-colors duration-500 ease-lux ${
                solid
                  ? 'border-ink text-ink hover:bg-ink hover:text-paper'
                  : 'border-paper text-paper hover:bg-paper hover:text-ink'
              }`}
            >
              Enquire
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden justify-self-end flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
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
            <div key={item.label} className="border-b border-ink/10">
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
          <Link
            href="/#enquire"
            onClick={() => setOpen(false)}
            className="mt-5 btn w-full"
          >
            Enquire
          </Link>
        </nav>
      </div>
    </header>
  );
}
