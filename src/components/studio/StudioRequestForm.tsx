'use client';

import { useMemo, useState } from 'react';
import type { StudioDict } from '@/i18n/dictionaries/studio';

// Request a podcast session.
//
// Deliberately NOT the instant-booking calendar: the studio is staff-operated,
// so this collects the pre-session questionnaire and a policy acceptance, then
// posts to the platform, which writes a PENDING booking holding the slot. No
// payment happens here — the session is quoted and charged on approval.

type Props = { t: StudioDict['request']; endpoint: string };

const HOURS = [1, 2, 3, 4];

// The values POSTed for "what are you recording". These are the canonical
// English strings the platform validates against (QUESTIONNAIRE_FIELDS in
// src/lib/studio.js) — the dictionary supplies only the LABELS, in the same
// order. Submitting the localised label would make every zh selection fail the
// server's whitelist and silently land as "Other".
const RECORDING_VALUES = [
  'Interview',
  'Solo / monologue',
  'Video podcast',
  'Remote guest',
  'Other',
] as const;
// Studio hours are 9–5; the last useful start is 4pm for a one-hour session.
const START_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

// Setup (~30 min) + transfer & reset (~15 min) come out of the booking, so this
// is what's actually left to record in.
//
// ⚠ This MUST match recordingMinutesFor() in the platform's src/lib/studio.js
// (which derives 45 from SESSION_PHASES). The two repos can't share a module,
// so if the phases change there, change OVERHEAD_MINS here in the same commit —
// otherwise this form tells someone their session fits and the endpoint then
// rejects it with a 400 they can do nothing about.
const OVERHEAD_MINS = 45;
const recordingMinutes = (hours: number) => Math.max(0, hours * 60 - OVERHEAD_MINS);

// Melbourne-local, matching the platform — a UTC "today" is still yesterday
// here for the first ~10 hours of the day, which would let the picker offer a
// date the server then rejects.
const todayISO = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });

export default function StudioRequestForm({ t, endpoint }: Props) {
  const [f, setF] = useState({
    name: '', email: '', phone: '', businessName: '',
    date: '', startTime: '10:00', hours: 1,
    recordingType: '', peopleOnCamera: 2, expectedRecordingMins: 15,
    ownCrew: false, ownCards: false, transferHelp: true,
    specialRequirements: '',
    website: '', // honeypot
  });
  const [accepted, setAccepted] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const available = useMemo(() => recordingMinutes(f.hours), [f.hours]);
  const tooShort = Number(f.expectedRecordingMins) > available;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!f.name || !f.email || !f.date || !f.startTime) return setError(t.required);
    if (!accepted) return setError(t.policyAccept);

    setState('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, policyAccepted: true, deliverables: 'raw' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.errorGeneric);
      setReference(data.reference || '');
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className="border border-ink/15 bg-paper p-8 md:p-12 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-hexa-green/10 border border-hexa-green/40">
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
            <path d="M2 9 L8 15 L20 3" stroke="#7F8B2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="h-display text-[clamp(1.6rem,3vw,2.4rem)] mt-6">{t.successTitle}</h3>
        <p className="lead mt-4 mx-auto max-w-xl">{t.successBody}</p>
        {reference && <p className="eyebrow mt-6">{t.successRef(reference)}</p>}
      </div>
    );
  }

  const label = 'font-heading uppercase tracking-nav text-[11px] text-muted block mb-2';
  const input =
    'w-full border border-ink/15 bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors';

  return (
    <form onSubmit={submit} className="border border-ink/15 bg-paper p-6 md:p-10">
      {/* Honeypot — hidden from people, catnip for bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={f.website}
            onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="sr-name">{t.fields.name} *</label>
          <input id="sr-name" required className={input} value={f.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="sr-email">{t.fields.email} *</label>
          <input id="sr-email" type="email" required className={input} value={f.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="sr-phone">{t.fields.phone} <span className="normal-case tracking-normal">({t.fields.optional})</span></label>
          <input id="sr-phone" type="tel" className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="sr-business">{t.fields.businessName} <span className="normal-case tracking-normal">({t.fields.optional})</span></label>
          <input id="sr-business" className={input} value={f.businessName} onChange={(e) => set('businessName', e.target.value)} />
        </div>
      </div>

      <hr className="border-ink/10 my-8" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="sr-date">{t.fields.date} *</label>
          <input id="sr-date" type="date" required min={todayISO()} className={input}
            value={f.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="sr-start">{t.fields.startTime} *</label>
          <select id="sr-start" className={input} value={f.startTime} onChange={(e) => set('startTime', e.target.value)}>
            {START_TIMES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <span className={label}>{t.fields.hours}</span>
        <div className="flex flex-wrap gap-2">
          {HOURS.map((h) => (
            <button key={h} type="button" onClick={() => set('hours', h)}
              className={`font-heading uppercase tracking-nav text-[11px] px-5 py-3 border transition-colors ${
                f.hours === h ? 'bg-ink text-paper border-ink' : 'border-ink/15 text-ink hover:bg-bone'}`}>
              {t.hourOptions(h)}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-muted mt-3 leading-relaxed">{t.fitsNote(available)}</p>
      </div>

      <hr className="border-ink/10 my-8" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="sr-type">{t.fields.recordingType}</label>
          <select id="sr-type" className={input} value={f.recordingType} onChange={(e) => set('recordingType', e.target.value)}>
            <option value="">—</option>
            {t.recordingTypes.map((label, i) => (
              <option key={RECORDING_VALUES[i]} value={RECORDING_VALUES[i]}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="sr-people">{t.fields.peopleOnCamera}</label>
          <input id="sr-people" type="number" min={1} max={4} className={input}
            value={f.peopleOnCamera} onChange={(e) => set('peopleOnCamera', Number(e.target.value))} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="sr-mins">{t.fields.expectedRecordingMins}</label>
          <input id="sr-mins" type="number" min={5} max={480} className={input}
            value={f.expectedRecordingMins} onChange={(e) => set('expectedRecordingMins', Number(e.target.value))} />
          {tooShort && (
            <p className="text-[13px] text-[#8A6A1B] bg-[#F3E9CF] border border-[#E4D3A4] px-4 py-3 mt-3 leading-relaxed">
              {t.tooShort(Number(f.expectedRecordingMins), available)}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 mt-5">
        {([
          ['ownCrew', t.fields.ownCrew],
          ['ownCards', t.fields.ownCards],
          ['transferHelp', t.fields.transferHelp],
        ] as const).map(([key, text]) => (
          <div key={key}>
            <span className={label}>{text}</span>
            <div className="flex gap-2">
              {([[t.yes, true], [t.no, false]] as const).map(([txt, v]) => (
                <button key={txt} type="button" onClick={() => set(key, v)}
                  className={`flex-1 font-heading uppercase tracking-nav text-[11px] px-3 py-2.5 border transition-colors ${
                    f[key] === v ? 'bg-ink text-paper border-ink' : 'border-ink/15 text-ink hover:bg-bone'}`}>
                  {txt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-muted mt-5 leading-relaxed">{t.filesNote}</p>

      <div className="mt-5">
        <label className={label} htmlFor="sr-notes">{t.fields.specialRequirements} <span className="normal-case tracking-normal">({t.fields.optional})</span></label>
        <textarea id="sr-notes" rows={3} className={`${input} resize-none`}
          value={f.specialRequirements} onChange={(e) => set('specialRequirements', e.target.value)} />
      </div>

      <hr className="border-ink/10 my-8" />

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#7F8B2F] shrink-0" />
        <span className="text-[15px] text-ink leading-relaxed">{t.policyAccept}</span>
      </label>

      {error && (
        <p className="text-[14px] text-[#B3261E] bg-[#FBEAE8] border border-[#F1C8C3] px-4 py-3 mt-5 leading-relaxed">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === 'sending' || !accepted}
        className="btn btn-dark mt-7 disabled:opacity-50 disabled:cursor-not-allowed">
        {state === 'sending' ? t.submitting : t.submit}
      </button>
    </form>
  );
}
