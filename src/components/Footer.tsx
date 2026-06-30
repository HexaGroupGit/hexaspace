import Link from 'next/link';

const COLS = [
  {
    title: 'Workspaces',
    links: [
      { label: 'Virtual Office', href: '/workspaces#virtual-office' },
      { label: 'Flexible Desk', href: '/workspaces#flexible-desk' },
      { label: 'Dedicated Desk', href: '/workspaces#dedicated-desk' },
      { label: 'Private Office', href: '/workspaces#private-office' },
      { label: 'Enterprise Suites', href: '/workspaces#enterprise-suites' },
    ],
  },
  {
    title: 'Spaces',
    links: [
      { label: 'The Function Space', href: '/spaces#function-space' },
      { label: 'Meeting Rooms', href: '/spaces#meeting-rooms' },
      { label: 'Media Studios', href: '/spaces#media-studios' },
      { label: 'Podcast Studio', href: '/spaces#podcast-studio' },
    ],
  },
  {
    title: 'Hexa',
    links: [
      { label: 'Membership', href: '/membership' },
      { label: 'Podcast', href: '/podcast' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/#enquire' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-paper">
      {/* App teaser band */}
      <div className="border-b border-paper/10">
        <div className="container-page py-16 md:py-20 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="eyebrow text-paper/50">Coming soon — app.hexaspace.com.au</p>
            <h3 className="h-display mt-5 text-paper">
              Your space, <span className="italic">orchestrated.</span>
            </h3>
            <p className="prose-body text-paper/60 mt-6 max-w-xl">
              A members companion that manages the everyday — bookings, onboarding,
              correspondence and community — so the work of running your workspace
              quietly takes care of itself.
            </p>
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
            aria-label="Hexa Space home"
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

        {COLS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-paper/40">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-body text-[14px] text-paper/65 hover:text-paper transition-colors"
                  >
                    {l.label}
                  </Link>
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
            © {new Date().getFullYear()} Hexa Space · A Hexa Group company
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
