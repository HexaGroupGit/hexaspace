import Reveal from '@/components/Reveal';

const VALUES = [
  {
    title: 'Clarity first',
    copy: 'Transparent pricing, month-to-month terms and spaces designed to quiet the noise so the work can speak.',
  },
  {
    title: 'Hospitality at the core',
    copy: 'A members club sensibility — you are hosted, not merely accommodated, from the front desk to the lounge.',
  },
  {
    title: 'A global address',
    copy: 'Through our Ucommune partnership, your membership reaches a network of workspaces across the world.',
  },
];

export default function Membership() {
  return (
    <section id="membership" className="bg-paper py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Membership with meaning</p>
          <h2 className="h-section mt-6">Built around how you actually want to work.</h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 120}>
              <div className="border-t border-ink pt-6">
                <span className="font-heading uppercase tracking-label text-[11px] text-muted">
                  0{i + 1}
                </span>
                <h3 className="font-display font-extralight text-3xl mt-5">{v.title}</h3>
                <p className="prose-body mt-4">{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
