import Image from 'next/image';

type Props = {
  kicker: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
};

export default function PageHero({ kicker, title, intro, image }: Props) {
  return (
    <section className="relative min-h-[70svh] md:min-h-[80svh] flex items-end overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover animate-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/75" />
      <div className="relative container-page pb-16 md:pb-24 pt-32">
        <p className="eyebrow text-paper/70 animate-rise">{kicker}</p>
        <h1
          className="h-display text-paper mt-5 max-w-4xl animate-rise"
          style={{ animationDelay: '120ms' }}
        >
          {title}
        </h1>
        {intro && (
          <p
            className="lead text-paper/85 mt-7 max-w-2xl animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
