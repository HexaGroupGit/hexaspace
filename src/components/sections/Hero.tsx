import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Full-bleed image */}
      <Image
        src="/photos/hero-main.jpg"
        alt="Hexa Space interior, Box Hill"
        fill
        priority
        sizes="100vw"
        className="object-cover animate-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/70" />

      {/* Copy — text-forward, words land first */}
      <div className="relative container-page pb-20 md:pb-28">
        <div className="max-w-4xl md:pl-6 lg:pl-10 pr-4">
          <p className="eyebrow text-paper/70 animate-rise">Box Hill · Melbourne</p>
          <h1 className="h-display text-paper mt-6 animate-rise" style={{ animationDelay: '120ms' }}>
            A workspace,
            <br />
            <span className="italic">elevated.</span>
          </h1>
          <p
            className="lead text-paper/85 mt-8 max-w-2xl animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            Hexa Space is a luxury workspace and members club — bringing clarity,
            hospitality and intention to the working day, for those who value how
            they work as much as what they do.
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4 animate-rise"
            style={{ animationDelay: '360ms' }}
          >
            <Link href="#workspaces" className="btn btn-light">
              Explore Hexa
            </Link>
            <Link href="#enquire" className="btn btn-light border-paper/40">
              Book a private tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
