import Link from 'next/link';

type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export default function CTASection({
  eyebrow = 'Visit · Box Hill',
  title = (
    <>
      Come and see <span className="italic">the space.</span>
    </>
  ),
  body = 'The best way to understand Hexa Space is to stand in it. Arrange a private tour and we’ll show you the floor, the lounge and the studios.',
  primaryLabel = 'Book a private tour',
  primaryHref = 'mailto:info@hexaspace.com.au',
}: Props) {
  return (
    <section className="bg-ink text-paper py-24 md:py-32">
      <div className="container-page text-center max-w-3xl mx-auto">
        <p className="eyebrow text-paper/50">{eyebrow}</p>
        <h2 className="h-display mt-6">{title}</h2>
        <p className="lead text-paper/80 mt-7 mx-auto max-w-xl">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={primaryHref} className="btn btn-light">
            {primaryLabel}
          </Link>
          <Link href="tel:+61406016666" className="btn btn-light border-paper/30">
            +61 406 016 666
          </Link>
        </div>
      </div>
    </section>
  );
}
