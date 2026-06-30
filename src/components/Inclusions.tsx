type Props = {
  items: string[];
  label?: string;
  columns?: boolean;
  light?: boolean; // for dark backgrounds
};

function Tick({ light }: { light?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      className={`mt-[6px] shrink-0 ${light ? 'text-paper/70' : 'text-hexa-green'}`}
      aria-hidden
    >
      <path
        d="M1 6.5 L5 10.5 L12 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function Inclusions({ items, label, columns = true, light }: Props) {
  return (
    <div>
      {label && (
        <p className={`eyebrow ${light ? 'text-paper/50' : ''} mb-6`}>{label}</p>
      )}
      <ul
        className={`grid gap-x-10 gap-y-4 ${
          columns ? 'sm:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <Tick light={light} />
            <span
              className={`font-body text-[15px] leading-[1.6] ${
                light ? 'text-paper/75' : 'text-charcoal'
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
