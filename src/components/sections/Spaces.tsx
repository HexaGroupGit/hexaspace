import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const SPACES = [
  {
    name: 'Meeting Rooms',
    img: '/photos/meeting-room.jpg',
    detail: '4 – 12 guests',
    copy: 'Six named rooms with floor-to-ceiling windows and advanced AV — from an intimate consulting room to a traditional Chinese tearoom.',
  },
  {
    name: 'Event Space',
    img: '/photos/event-space.jpg',
    detail: '20 – 100 guests',
    copy: 'A versatile setting for launches, seminars and gatherings — full AV, IT and catering, framed by the Box Hill skyline.',
  },
  {
    name: 'Media Studios',
    img: '/photos/media-1.jpg',
    detail: 'Photo · Video',
    copy: 'Purpose-built studios for video, photography and content — professional equipment, on tap, by the hour.',
  },
];

export default function Spaces() {
  return (
    <section id="spaces" className="bg-bone py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The spaces</p>
          <h2 className="h-section mt-6">More than desks — a place to host, gather and create.</h2>
        </Reveal>
      </div>

      <div className="mt-20 space-y-px">
        {SPACES.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.name}>
              <div className="container-page">
                <div
                  className={`grid items-center gap-10 md:gap-16 md:grid-cols-2 py-12 border-t border-ink/10 ${
                    flip ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.name}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={flip ? 'md:pr-10' : 'md:pl-10'}>
                    <div className="flex items-center gap-4">
                      <span className="font-heading uppercase tracking-label text-[11px] text-hexa-green">
                        {s.detail}
                      </span>
                    </div>
                    <h3 className="font-display font-extralight text-[clamp(2rem,4vw,3.4rem)] mt-4">
                      {s.name}
                    </h3>
                    <p className="prose-body mt-5 max-w-md">{s.copy}</p>
                    <Link href="#enquire" className="btn-ghost mt-7">
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
