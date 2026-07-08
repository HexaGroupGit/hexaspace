'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  BOOKABLE_RESOURCES,
  BOOKABLE_TABS,
  DAY_START,
  DAY_END,
  type BookableGroup,
  type BookableResource,
} from '@/data/bookable';
import {
  AvailabilityBooking,
  fromDec,
  hourLabel,
  overlaps,
  timeLabel,
  toDec,
  ymd,
} from '@/lib/booking';
import { useLocale } from '@/i18n/LocaleProvider';
import { BOOKING } from '@/i18n/dictionaries/booking';
import BookingFlow from './BookingFlow';

const HOUR_H = 62;
const ALLDAY_H = 36;
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);
// Gridline labels — one per line including the closing hour (so 5 PM shows).
const LABEL_HOURS = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i);

type Slot = { resource: BookableResource; date: string; startTime: string; endTime: string; allDay?: boolean };

type PaidBooking = { reference: string; resourceName: string; date: string; startTime: string; endTime: string };
type PayReturn =
  | { status: 'confirming' }
  | { status: 'done'; booking: PaidBooking }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

export default function BookingCalendar({ initialTab = 'meeting' }: { initialTab?: BookableGroup }) {
  const locale = useLocale();
  const t = BOOKING[locale].calendar;
  const [tab, setTab] = useState<BookableGroup>(initialTab);
  const [day, setDay] = useState<Date>(() => new Date());
  const [bookings, setBookings] = useState<AvailabilityBooking[]>([]);
  const [allResources, setAllResources] = useState<BookableResource[]>(BOOKABLE_RESOURCES);
  const [loading, setLoading] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [payReturn, setPayReturn] = useState<PayReturn | null>(null);

  const dayStr = ymd(day);
  const resources = useMemo(() => allResources.filter((r) => r.group === tab), [allResources, tab]);

  // Photo size: studios show as 2 wide columns, so give them a much taller image.
  // Header box stays a fixed height (photo + text) so it never scrolls.
  const photoH = tab === 'studio' ? 220 : 112;
  const headerH = photoH + 52;

  // Returning from Stripe Checkout: ?session_id=cs_… (paid) or ?checkout=cancelled.
  // Verify the session server-side, show the confirmation, then clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const cancelled = params.get('checkout') === 'cancelled';
    if (!sessionId && !cancelled) return;

    // Strip the params so refresh/back doesn't replay the state.
    params.delete('session_id');
    params.delete('checkout');
    const qs = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));

    if (cancelled) {
      setPayReturn({ status: 'cancelled' });
      return;
    }

    setPayReturn({ status: 'confirming' });
    fetch('/api/book/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.booking) {
          setPayReturn({ status: 'done', booking: j.booking as PaidBooking });
          // The paid slot is now taken — reflect it without waiting for a reload.
          const b = j.booking as PaidBooking & { resourceId?: string };
          setDay(new Date(b.date + 'T00:00:00'));
        } else {
          setPayReturn({ status: 'error', message: j.error || '' });
        }
      })
      .catch(() => setPayReturn({ status: 'error', message: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Source the live bookable rooms/studios from the RND; fall back to the static
  // list (so the calendar still renders if the RND env isn't wired in this env).
  useEffect(() => {
    let active = true;
    fetch('/api/book/resources')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (active && j && Array.isArray(j.resources) && j.resources.length) {
          setAllResources(j.resources as BookableResource[]);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Load existing bookings for the visible day so taken slots are blocked out.
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/book/availability?date=${dayStr}`)
      .then((r) => (r.ok ? r.json() : { bookings: [] }))
      .then((j) => {
        if (active) setBookings(Array.isArray(j.bookings) ? j.bookings : []);
      })
      .catch(() => active && setBookings([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [dayStr]);

  function shiftDay(delta: number) {
    setDay((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + delta);
      return n;
    });
  }

  function isTaken(resourceId: string, hour: number): boolean {
    const s = fromDec(hour);
    const e = fromDec(hour + 1);
    return bookings.some(
      (b) =>
        b.resourceId === resourceId &&
        b.date === dayStr &&
        b.status !== 'Cancelled' &&
        overlaps(s, e, b.startTime, b.endTime)
    );
  }

  function openSlot(resource: BookableResource, hour: number) {
    setSlot({
      resource,
      date: dayStr,
      startTime: fromDec(hour),
      endTime: fromDec(hour + 1),
    });
  }

  function openAllDay(resource: BookableResource) {
    setSlot({
      resource,
      date: dayStr,
      startTime: fromDec(DAY_START),
      endTime: fromDec(DAY_END),
      allDay: true,
    });
  }

  const isToday = ymd(new Date()) === dayStr;

  return (
    <div>
      {/* Tabs + heading */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t.publicCalendar}</p>
          <div className="mt-3 flex items-baseline gap-6">
            {BOOKABLE_TABS.map((tb) => (
              <button
                key={tb.key}
                type="button"
                onClick={() => setTab(tb.key)}
                className={`font-display font-extralight text-3xl md:text-4xl transition-colors ${
                  tab === tb.key ? 'text-ink' : 'text-muted/40 hover:text-muted'
                }`}
              >
                {t.tabs[tb.key]}
                {tab === tb.key && <span className="block h-px bg-hexa-green mt-2" />}
              </button>
            ))}
          </div>
          <p className="prose-body mt-4 text-[13px]">
            {t.spacesCount(resources.length)} ·{' '}
            {loading ? t.checking : t.clickToBook}
          </p>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDay(new Date())}
            className="font-heading uppercase tracking-nav text-[10px] border border-ink/15 px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
          >
            {t.today}
          </button>
          <div className="flex items-center border border-ink/15">
            <button type="button" onClick={() => shiftDay(-1)} aria-label={t.prevDay} className="p-2.5 hover:bg-bone transition-colors">
              <Chevron dir="left" />
            </button>
            <button type="button" onClick={() => shiftDay(1)} aria-label={t.nextDay} className="p-2.5 border-l border-ink/15 hover:bg-bone transition-colors">
              <Chevron dir="right" />
            </button>
          </div>
          <span className="font-display font-extralight text-xl md:text-2xl whitespace-nowrap">
            {t.formatLongDate(day)}
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="mt-8 border border-ink/10 bg-paper">
        <div className="flex">
          {/* Time gutter */}
          <div className="w-16 shrink-0 border-r border-ink/10">
            <div style={{ height: headerH }} className="border-b border-ink/10" />
            <div style={{ height: ALLDAY_H }} className="border-b border-ink/10 flex items-center justify-end pr-2">
              <span className="font-heading uppercase tracking-nav text-[9px] text-muted">{t.allDay}</span>
            </div>
            {/* Hour labels sit just below each gridline; +1 row gives 5 PM a box under it */}
            <div className="relative" style={{ height: (HOURS.length + 1) * HOUR_H }}>
              {LABEL_HOURS.map((h) => (
                <span
                  key={h}
                  style={{ top: (h - DAY_START) * HOUR_H + 4 }}
                  className="absolute right-2 font-heading uppercase tracking-nav text-[9px] text-muted"
                >
                  {hourLabel(h)}
                </span>
              ))}
            </div>
          </div>

          {/* Resource columns */}
          {resources.map((room) => {
            const roomBookings = bookings.filter((b) => b.resourceId === room.id && b.date === dayStr);
            return (
              <div key={room.id} className="flex-1 min-w-0 border-r border-ink/10 last:border-r-0">
                {/* Column header — photo, name, pax, rate */}
                <div style={{ height: headerH }} className="border-b border-ink/10 border-t-2 border-t-hexa-green">
                  <div style={{ height: photoH }} className="relative w-full overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      sizes={tab === 'studio' ? '(max-width:768px) 50vw, 760px' : '(max-width:768px) 50vw, 260px'}
                      className="object-cover"
                    />
                  </div>
                  <div className="px-3 py-2.5">
                    {/* Name + pax share the title row (pax stays put, name truncates)
                        so the capacity never overlaps the rate on narrow columns. */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-heading uppercase tracking-[0.04em] text-[11px] text-ink truncate">
                        {room.name}
                      </div>
                      {room.pax != null && (
                        <span className="inline-flex items-center gap-1 font-heading uppercase tracking-nav text-[9px] text-muted shrink-0">
                          <PaxIcon /> {room.pax}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <span className="font-heading uppercase tracking-nav text-[9px] text-hexa-green">
                        {room.rateLabel === 'POA' ? t.poa : room.rateLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* All-day cell — books the whole day (9–5) at 30% off */}
                {(() => {
                  const busy = roomBookings.some((b) => b.status !== 'Cancelled');
                  return (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => openAllDay(room)}
                      style={{ height: ALLDAY_H }}
                      className={`block w-full border-b border-ink/10 transition-colors ${
                        busy ? 'cursor-default' : 'hover:bg-hexa-green/5 cursor-pointer'
                      }`}
                    >
                      <span
                        className={`font-heading uppercase tracking-nav text-[8.5px] ${
                          busy ? 'text-muted/40' : 'text-hexa-green'
                        }`}
                      >
                        {busy ? '—' : t.allDayOff}
                      </span>
                    </button>
                  );
                })()}

                {/* Hour grid — +1 trailing box so the 5 PM line has a cell beneath it */}
                <div className="relative" style={{ height: (HOURS.length + 1) * HOUR_H }}>
                  {HOURS.map((h) => {
                    const taken = isTaken(room.id, h);
                    return (
                      <button
                        key={h}
                        type="button"
                        disabled={taken}
                        onClick={() => openSlot(room, h)}
                        style={{ height: HOUR_H }}
                        className={`block w-full border-b border-ink/5 transition-colors ${
                          taken ? 'cursor-default' : 'hover:bg-hexa-green/5 cursor-pointer'
                        }`}
                      />
                    );
                  })}
                  {/* trailing box under 5 PM (not bookable) */}
                  <div style={{ height: HOUR_H }} className="border-b border-ink/5" />

                  {/* Existing bookings — blocked */}
                  {roomBookings.map((b, i) => {
                    const top = (toDec(b.startTime) - DAY_START) * HOUR_H;
                    const height = Math.max(22, (toDec(b.endTime) - toDec(b.startTime)) * HOUR_H);
                    return (
                      <div
                        key={`${b.startTime}-${i}`}
                        className="absolute left-1 right-1 bg-charcoal text-paper/90 px-2 py-1 overflow-hidden pointer-events-none"
                        style={{ top, height }}
                      >
                        <div className="font-heading uppercase tracking-nav text-[9px] truncate">{t.booked}</div>
                        <div className="text-[10px] opacity-80 truncate">{timeLabel(b.startTime)}</div>
                      </div>
                    );
                  })}

                  {/* Current-time line (today only) */}
                  {isToday && <NowLine />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {payReturn && payReturn.status !== 'cancelled' && (
        <PaymentReturnOverlay state={payReturn} onClose={() => setPayReturn(null)} />
      )}
      {payReturn?.status === 'cancelled' && (
        <div className="fixed inset-x-0 bottom-6 z-[90] flex justify-center px-6">
          <div className="flex items-center gap-4 bg-charcoal text-paper px-6 py-4 shadow-2xl">
            <p className="font-body text-[13px]">{t.paymentCancelled}</p>
            <button
              type="button"
              onClick={() => setPayReturn(null)}
              aria-label={t.paidDone}
              className="p-1 text-paper/60 hover:text-paper transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {slot && (
        <BookingFlow
          resource={slot.resource}
          date={slot.date}
          startTime={slot.startTime}
          endTime={slot.endTime}
          allDay={slot.allDay}
          existing={bookings}
          onClose={() => setSlot(null)}
          onBooked={(b) =>
            setBookings((prev) => [
              ...prev,
              { resourceId: b.resourceId, date: b.date, startTime: b.startTime, endTime: b.endTime, status: 'Pending' },
            ])
          }
        />
      )}
    </div>
  );
}

/** Full-screen state shown after returning from Stripe Checkout. */
function PaymentReturnOverlay({
  state,
  onClose,
}: {
  state: Extract<PayReturn, { status: 'confirming' | 'done' | 'error' }>;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = BOOKING[locale].calendar;
  const flow = BOOKING[locale].flow;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.paidKicker}
      className="fixed inset-0 z-[100] overflow-y-auto bg-paper"
    >
      <div className="container-page py-24 md:py-32">
        {state.status === 'confirming' && (
          <div className="max-w-xl mx-auto text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-ink/15 border-t-hexa-green" />
            <p className="eyebrow mt-8">{t.confirmingPayment}</p>
          </div>
        )}

        {state.status === 'done' && (
          <div className="max-w-xl mx-auto text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-hexa-green/10 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                <path d="M6 13.5 L11 18 L20 8" stroke="#7F8B2F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="eyebrow text-hexa-green mt-6">{t.paidKicker}</p>
            <h2 className="h-display text-[clamp(2rem,5vw,3.2rem)] mt-4">{t.paidTitle}</h2>
            <p className="prose-body mt-5 max-w-sm mx-auto">
              {t.paidBody1}
              <strong>{state.booking.resourceName}</strong>
              {t.paidBody2}
              <strong>{state.booking.reference}</strong>
              {t.paidBody3}
            </p>
            <div className="mt-7 inline-block border border-ink/10 px-6 py-4 text-left">
              <p className="eyebrow">{t.paidWhen}</p>
              <p className="font-display font-extralight text-xl mt-1">
                {flow.formatLongDate(new Date(state.booking.date + 'T00:00:00'))}
              </p>
              <p className="prose-body text-[14px] mt-1">
                {timeLabel(state.booking.startTime)} – {timeLabel(state.booking.endTime)}
              </p>
            </div>
            <div className="mt-9">
              <button type="button" onClick={onClose} className="btn">
                {t.paidDone}
              </button>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow text-red-700">{t.paidKicker}</p>
            <p className="prose-body mt-5 max-w-md mx-auto">{state.message || t.confirmError}</p>
            <div className="mt-9">
              <button type="button" onClick={onClose} className="btn">
                {t.paidDone}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NowLine() {
  const now = new Date();
  const dec = now.getHours() + now.getMinutes() / 60;
  if (dec < DAY_START || dec > DAY_END) return null;
  const top = (dec - DAY_START) * HOUR_H;
  return (
    <div className="absolute left-0 right-0 pointer-events-none" style={{ top }}>
      <div className="h-px bg-red-500" />
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M9 2 L4 7 L9 12' : 'M5 2 L10 7 L5 12'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaxIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 7.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM2.4 12c0-2.2 2-3.6 4.6-3.6s4.6 1.4 4.6 3.6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
