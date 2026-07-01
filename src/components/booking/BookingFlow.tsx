'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { BookableResource } from '@/data/bookable';
import { DAY_START, DAY_END } from '@/data/bookable';
import {
  AvailabilityBooking,
  CreateBookingResult,
  fromDec,
  longDate,
  overlaps,
  timeLabel,
  toDec,
} from '@/lib/booking';

const MEMBERS_URL = 'https://members.hexaspace.com.au';
const STEPS = ['Booking', 'Your details', 'Payment', 'Confirmed'] as const;
const ALL_DAY_DISCOUNT = 0.3; // 30% off all-day public bookings

// Selectable half-hourly times across operating hours.
const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let d = DAY_START; d <= DAY_END; d += 0.5) out.push(fromDec(d));
  return out;
})();

type Props = {
  resource: BookableResource;
  date: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  existing: AvailabilityBooking[];
  onClose: () => void;
  onBooked: (b: { resourceId: string; date: string; startTime: string; endTime: string }) => void;
};

export default function BookingFlow({
  resource,
  date,
  startTime,
  endTime,
  allDay = false,
  existing,
  onClose,
  onBooked,
}: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    date,
    startTime,
    endTime,
    title: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [accountState, setAccountState] = useState<'new' | 'existing'>('new');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateBookingResult | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const dur = Math.max(0, toDec(form.endTime) - toDec(form.startTime));
  const gross = resource.rate != null ? resource.rate * dur : null;
  const total =
    gross != null && allDay ? Math.round(gross * (1 - ALL_DAY_DISCOUNT) * 100) / 100 : gross;

  const clash = useMemo(
    () =>
      existing.some(
        (b) =>
          b.resourceId === resource.id &&
          b.date === form.date &&
          b.status !== 'Cancelled' &&
          overlaps(form.startTime, form.endTime, b.startTime, b.endTime)
      ),
    [existing, resource.id, form.date, form.startTime, form.endTime]
  );

  function next() {
    setError('');
    if (step === 0) {
      if (dur <= 0) return setError('End time must be after the start time.');
      if (clash) return setError('That time overlaps an existing booking. Please choose another slot.');
      return setStep(1);
    }
    if (step === 1) return submitDetails();
    if (step === 2) return reserve();
  }

  async function submitDetails() {
    if (!form.name.trim()) return setError('Please enter your full name.');
    if (!form.email.trim()) return setError('Please enter your email.');
    setChecking(true);
    setError('');
    try {
      const res = await fetch('/api/book/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      setAccountState(json.exists ? 'existing' : 'new');
    } catch {
      setAccountState('new');
    } finally {
      setChecking(false);
      setStep(2);
    }
  }

  async function reserve() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          allDay,
          title: form.title,
          description: form.description,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Sorry — we couldn’t complete your booking. Please try again.');
        setSubmitting(false);
        return;
      }
      setResult(json.booking as CreateBookingResult);
      onBooked({ resourceId: resource.id, date: form.date, startTime: form.startTime, endTime: form.endTime });
      setStep(3);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New booking"
      className="fixed inset-0 z-[100] overflow-y-auto bg-paper"
    >
      {/* Top bar with stepper */}
      <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur border-b border-ink/10">
        <div className="container-page flex items-center justify-between h-16">
          <span className="font-heading uppercase tracking-[0.2em] text-sm">New Booking</span>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 text-muted hover:text-ink transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
        <div className="container-page pb-5">
          <Stepper step={step} />
        </div>
      </div>

      <div className="container-page py-10 md:py-14">
        {step === 0 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            {/* Setup */}
            <div className="border border-ink/10 p-7 md:p-9">
              <h2 className="font-display font-extralight text-2xl">Booking setup</h2>
              <div className="mt-7 space-y-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <Labeled label="Date">
                    <input type="date" value={form.date} onChange={set('date')} className={inputCls} />
                  </Labeled>
                  {allDay ? (
                    <div className="sm:col-span-2">
                      <span className="eyebrow">Session</span>
                      <div className={`${inputCls} flex items-center justify-between`}>
                        <span>All day · {timeLabel('09:00')} – {timeLabel('17:00')}</span>
                        <span className="font-heading uppercase tracking-nav text-[10px] text-hexa-green">30% off</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Labeled label="From">
                        <select value={form.startTime} onChange={set('startTime')} className={inputCls}>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{timeLabel(t)}</option>
                          ))}
                        </select>
                      </Labeled>
                      <Labeled label="To">
                        <select value={form.endTime} onChange={set('endTime')} className={inputCls}>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{timeLabel(t)}</option>
                          ))}
                        </select>
                      </Labeled>
                    </>
                  )}
                </div>
                <Labeled label="Title (optional)">
                  <input value={form.title} onChange={set('title')} placeholder="e.g. Client meeting" className={inputCls} />
                </Labeled>
                <Labeled label="Description (optional)">
                  <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Anything we should know…" className={`${inputCls} resize-none`} />
                </Labeled>
              </div>
            </div>

            {/* Summary */}
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            <div className="border border-ink/10 p-7 md:p-9">
              <h2 className="font-display font-extralight text-2xl">Your details</h2>
              <p className="prose-body mt-2 text-[13px]">
                No account needed to book. If you’re already a member we’ll recognise your email.
              </p>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Labeled label="Full name" required>
                  <input value={form.name} onChange={set('name')} autoComplete="name" className={inputCls} />
                </Labeled>
                <Labeled label="Email" required>
                  <input type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputCls} />
                </Labeled>
                <Labeled label="Phone">
                  <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={inputCls} />
                </Labeled>
                <Labeled label="Company (optional)">
                  <input value={form.company} onChange={set('company')} autoComplete="organization" className={inputCls} />
                </Labeled>
              </div>
            </div>
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              {accountState === 'existing' && (
                <div className="border border-hexa-green/40 bg-hexa-green/5 p-6">
                  <p className="eyebrow text-hexa-green">Welcome back</p>
                  <p className="prose-body mt-2 text-ink text-[14px]">
                    <strong>{form.email}</strong> is already registered with Hexa Space. Log in to the
                    members portal to manage bookings and credits — or continue and we’ll link this
                    booking to your account.
                  </p>
                  <a href={MEMBERS_URL} className="btn-ghost mt-4" target="_blank" rel="noreferrer">
                    Log in to members portal
                  </a>
                </div>
              )}

              <div className="border border-ink/10 p-7 md:p-9">
                <h2 className="font-display font-extralight text-2xl">Payment</h2>
                <div className="mt-3 inline-flex items-center gap-2 font-heading uppercase tracking-nav text-[10px] text-hexa-green">
                  <Lock /> Secure card payment — coming soon
                </div>
                <p className="prose-body mt-4 text-[14px]">
                  Card payment via Stripe is being set up. For now we’ll <strong>reserve your room</strong>{' '}
                  and our team confirms within one business day; you’ll be invoiced for{' '}
                  {total != null ? `A$${total.toFixed(2)} +GST` : 'the session'}.
                </p>

                {/* Stripe-ready scaffold (disabled until keys are live) */}
                <div className="mt-6 space-y-4 opacity-50 pointer-events-none select-none">
                  <Labeled label="Cardholder">
                    <input disabled placeholder="Cardholder name" className={inputCls} />
                  </Labeled>
                  <Labeled label="Card details">
                    <input disabled placeholder="1234 1234 1234 1234" className={inputCls} />
                  </Labeled>
                  <div className="grid grid-cols-3 gap-4">
                    <input disabled placeholder="MM / YY" className={inputCls} />
                    <input disabled placeholder="CVC" className={inputCls} />
                    <input disabled placeholder="ZIP" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
            <Summary resource={resource} form={form} dur={dur} gross={gross} total={total} allDay={allDay} showPolicy />
          </div>
        )}

        {step === 3 && result && (
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="mx-auto w-14 h-14 rounded-full bg-hexa-green/10 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                <path d="M6 13.5 L11 18 L20 8" stroke="#7F8B2F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="eyebrow text-hexa-green mt-6">Booking reserved</p>
            <h2 className="h-display text-[clamp(2rem,5vw,3.2rem)] mt-4">You’re booked in.</h2>
            <p className="prose-body mt-5 max-w-sm mx-auto">
              We’ve reserved <strong>{result.resourceName}</strong> and a confirmation email is on its way to{' '}
              <strong>{form.email}</strong>. Your reference is <strong>{result.reference}</strong>.
            </p>
            <div className="mt-7 inline-block border border-ink/10 px-6 py-4 text-left">
              <p className="eyebrow">When</p>
              <p className="font-display font-extralight text-xl mt-1">
                {longDate(new Date(result.date + 'T00:00:00'))}
              </p>
              <p className="prose-body text-[14px] mt-1">
                {timeLabel(result.startTime)} – {timeLabel(result.endTime)}
              </p>
            </div>
            <div className="mt-9">
              <button type="button" onClick={onClose} className="btn">Done</button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        {step < 3 && (
          <div className="max-w-5xl mx-auto mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
              className="btn-ghost"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-5">
              {error && <p className="font-body text-[13px] text-red-700 max-w-xs text-right">{error}</p>}
              <button
                type="button"
                onClick={next}
                disabled={checking || submitting}
                className="btn disabled:opacity-50"
              >
                {step === 0 && 'Continue'}
                {step === 1 && (checking ? 'Checking…' : 'Continue')}
                {step === 2 && (submitting ? 'Reserving…' : 'Reserve booking')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  'mt-2 w-full border border-ink/15 bg-bone/40 px-3 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none transition-colors';

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span className="text-hexa-green"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Summary({
  resource,
  form,
  dur,
  gross,
  total,
  allDay,
  showPolicy,
}: {
  resource: BookableResource;
  form: { date: string; startTime: string; endTime: string };
  dur: number;
  gross: number | null;
  total: number | null;
  allDay?: boolean;
  showPolicy?: boolean;
}) {
  const saved = allDay && gross != null && total != null ? gross - total : 0;
  return (
    <aside className="border border-ink/10 p-7 md:p-8 self-start">
      <h3 className="font-display font-extralight text-2xl">Booking summary</h3>
      <div className="relative mt-5 aspect-[4/3] overflow-hidden">
        <Image src={resource.image} alt={resource.name} fill sizes="320px" className="object-cover" />
      </div>
      <div className="mt-5 space-y-4 text-[14px]">
        <Row label="Space" value={resource.name} />
        <Row label="Date" value={longDate(new Date(form.date + 'T00:00:00'))} />
        <Row label="Time" value={`${timeLabel(form.startTime)} – ${timeLabel(form.endTime)}`} />
        <Row label="Duration" value={allDay ? 'All day (9 AM – 5 PM)' : dur > 0 ? `${dur} hour${dur === 1 ? '' : 's'}` : '—'} />
        {allDay && gross != null && (
          <>
            <Row label="Rate" value={`A$${gross.toFixed(2)}`} />
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow shrink-0 text-hexa-green">All-day discount</span>
              <span className="font-body text-hexa-green text-right">−30% (−A${saved.toFixed(2)})</span>
            </div>
          </>
        )}
        <div className="border-t border-ink/10 pt-4 flex items-baseline justify-between">
          <span className="eyebrow">Total</span>
          <span className="font-display font-extralight text-2xl">
            {total != null ? `A$${total.toFixed(2)}` : 'POA'}
            {total != null && <span className="font-body text-xs text-muted ml-1">+GST</span>}
          </span>
        </div>
      </div>

      {showPolicy && (
        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="eyebrow">Cancellation policy</p>
          <ul className="mt-3 space-y-1.5 prose-body text-[13px]">
            <li>· 24h or more before start — no fee</li>
            <li>· Less than 24h before start — 100% fee</li>
          </ul>
        </div>
      )}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="eyebrow shrink-0">{label}</span>
      <span className="font-body text-ink text-right">{value}</span>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-heading text-[11px] ${
                  active ? 'bg-ink text-paper' : done ? 'bg-hexa-green text-paper' : 'bg-ink/10 text-muted'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className={`font-heading uppercase tracking-nav text-[10px] ${active ? 'text-ink' : 'text-muted'} hidden sm:inline`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink/10 hidden sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="6" width="8" height="6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
