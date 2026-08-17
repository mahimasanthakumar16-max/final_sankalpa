import { prisma } from './prisma';

export const SLOT_DURATION_MINUTES = 30;
export const FALLBACK_SLOTS: string[] = [];

export interface SlotInfo {
  time: string;           // "03:00 PM"
  available: boolean;     // true if the time slot is free
  reason?: 'booked' | 'blocked' | 'unconfigured' | 'past';
}

export interface DayAvailabilityResult {
  date: string;           // YYYY-MM-DD
  hasAnyAvailability: boolean;
  slots: SlotInfo[];
}

export function timeToMinutes(time24: string): number {
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime24(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function time12ToTime24(time12: string): string {
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '00:00';
  let [, h, m, ap] = match;
  let hh = parseInt(h, 10);
  const mm = parseInt(m, 10);
  ap = ap.toUpperCase();
  if (ap === 'PM' && hh < 12) hh += 12;
  if (ap === 'AM' && hh === 12) hh = 0;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function time24ToTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = parseDateKey(dateStr);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export function isNowPastSlot(dateStr: string, time12: string): boolean {
  if (!isPastDate(dateStr)) {
    const todayKey = formatDateKey(new Date());
    if (todayKey !== dateStr) return false;
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const [timePart, ap] = time12.split(' ');
  let [hh, mm] = timePart.split(':').map(Number);
  if (ap === 'PM' && hh < 12) hh += 12;
  if (ap === 'AM' && hh === 12) hh = 0;
  const slotStart = new Date(y, m - 1, d, hh, mm);
  return Date.now() >= slotStart.getTime();
}

function expandWindowToSlots(start24: string, end24: string): string[] {
  const out: string[] = [];
  let start = timeToMinutes(start24);
  const end = timeToMinutes(end24);
  while (start + SLOT_DURATION_MINUTES <= end) {
    out.push(minutesToTime24(start));
    start += SLOT_DURATION_MINUTES;
  }
  return out;
}

export interface AvailabilityWindow {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type: 'RECURRING' | 'SPECIFIC_DATE';
  note?: string | null;
}

export async function loadAvailabilityWindows(dateStr: string): Promise<AvailabilityWindow[]> {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = dateObj.getUTCDay();

  const results = await prisma.availability.findMany({
    where: {
      OR: [
        {
          type: 'RECURRING',
          dayOfWeek: dayOfWeek,
        },
        {
          type: 'SPECIFIC_DATE',
          date: dateObj,
        },
      ],
    },
  });

  return results.map((r: any) => ({
    startTime: r.startTime,
    endTime: r.endTime,
    isAvailable: !!r.isAvailable,
    type: r.type,
    note: r.note ?? null,
  }));
}

export async function loadBookedSlots(dateStr: string): Promise<Set<string>> {
  const bookings = await prisma.booking.findMany({
    where: {
      preferredDate: dateStr,
      status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
    },
    select: { preferredTime: true },
  });
  const set = new Set<string>();
  for (const b of bookings) {
    if (b.preferredTime) set.add(b.preferredTime.toUpperCase().trim());
  }
  return set;
}

export async function computeDayAvailability(dateStr: string): Promise<DayAvailabilityResult> {
  if (isPastDate(dateStr)) {
    return {
      date: dateStr,
      hasAnyAvailability: false,
      slots: [],
    };
  }

  const windows = await loadAvailabilityWindows(dateStr);
  const booked = await loadBookedSlots(dateStr);

  const recurringAvailable = windows.filter(w => w.type === 'RECURRING' && w.isAvailable);
  const specificAvailable = windows.filter(w => w.type === 'SPECIFIC_DATE' && w.isAvailable);
  const specificBlocked = windows.filter(w => w.type === 'SPECIFIC_DATE' && !w.isAvailable);

  // Base availability is:
  // If there are specific available windows, they define the base availability.
  // Otherwise, recurring available windows define the base.
  const baseWindows = specificAvailable.length > 0 ? specificAvailable : recurringAvailable;

  const slotMap24 = new Map<string, { available: boolean; reason?: SlotInfo['reason'] }>();

  // Populate base available slots
  for (const w of baseWindows) {
    const slots24 = expandWindowToSlots(w.startTime, w.endTime);
    for (const s of slots24) {
      slotMap24.set(s, { available: true });
    }
  }

  // Apply blocked times (specific-date blocks)
  for (const w of specificBlocked) {
    const blockedSlots = expandWindowToSlots(w.startTime, w.endTime);
    for (const s of blockedSlots) {
      slotMap24.set(s, { available: false, reason: 'blocked' });
    }
  }

  const todayKey = formatDateKey(new Date());
  const isToday = dateStr === todayKey;
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  const slots: SlotInfo[] = [];
  for (const [t24, info] of Array.from(slotMap24.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const t12 = time24ToTime12(t24);
    if (info.available === false) {
      slots.push({ time: t12, available: false, reason: info.reason || 'blocked' });
      continue;
    }
    if (booked.has(t12)) {
      slots.push({ time: t12, available: false, reason: 'booked' });
      continue;
    }
    if (isToday && timeToMinutes(t24) <= nowMins) {
      slots.push({ time: t12, available: false, reason: 'past' });
      continue;
    }
    slots.push({ time: t12, available: true });
  }

  return {
    date: dateStr,
    hasAnyAvailability: slots.some(s => s.available),
    slots,
  };
}

export async function computeMonthAvailability(monthKey: string): Promise<Record<string, DayAvailabilityResult>> {
  const [y, m] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const results: Record<string, DayAvailabilityResult> = {};
  const promises: Promise<void>[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    promises.push(
      computeDayAvailability(dateKey).then(r => { results[dateKey] = r; })
    );
  }

  await Promise.all(promises);
  return results;
}
