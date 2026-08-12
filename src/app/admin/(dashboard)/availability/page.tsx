"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  Clock,
  CheckCircle2,
  Ban,
  Repeat,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

interface AvailabilityRecord {
  id: string;
  type: 'RECURRING' | 'SPECIFIC_DATE';
  dayOfWeek: number | null;
  date: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SlotInfo {
  time: string;
  available: boolean;
  reason?: 'booked' | 'blocked' | 'unconfigured' | 'past';
}

interface DayData {
  date: string;
  hasAnyAvailability: boolean;
  slots: SlotInfo[];
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatFriendlyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function time24To12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt.getTime() < today.getTime();
}

const todayKey = () => formatDateKey(new Date());

export default function AdminAvailabilityPage() {
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const [availabilities, setAvailabilities] = useState<AvailabilityRecord[]>([]);
  const [monthData, setMonthData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'RECURRING' | 'SPECIFIC_DATE'>('RECURRING');
  const [formDayOfWeek, setFormDayOfWeek] = useState<number>(1);
  const [formDate, setFormDate] = useState<string>(todayKey());
  const [formStart, setFormStart] = useState<string>('10:00');
  const [formEnd, setFormEnd] = useState<string>('14:00');
  const [formIsAvailable, setFormIsAvailable] = useState<boolean>(true);
  const [formNote, setFormNote] = useState<string>('');

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

  const fetchAvailabilities = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/availability');
      if (res.ok) {
        const data = await res.json();
        setAvailabilities(
          data.availabilities.map((a: any) => ({
            ...a,
            date: a.date ? new Date(a.date).toISOString().slice(0, 10) : null,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/available-slots?month=${monthKey}`);
      if (res.ok) {
        const data = await res.json();
        setMonthData(data.availability || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    fetchAvailabilities();
    fetchMonth();
  }, [fetchAvailabilities, fetchMonth]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isPrevMonthDisabled = () => {
    const now = new Date();
    return year <= now.getFullYear() && month <= now.getMonth();
  };

  const dateColorClass = useCallback((dateStr: string): string => {
    if (isPastDate(dateStr)) return 'past';
    const d = monthData[dateStr];
    if (!d) return 'unknown';
    if (d.slots.length === 0) return 'unconfigured';
    const hasAvail = d.hasAnyAvailability;
    const availCount = d.slots.filter(s => s.available).length;
    const bookedCount = d.slots.filter(s => s.reason === 'booked').length;
    const blockedCount = d.slots.filter(s => s.reason === 'blocked').length;
    if (bookedCount > 0 && availCount > 0) return 'partial';
    if (bookedCount > 0 && availCount === 0) return 'fully-booked';
    if (blockedCount > 0 && availCount === 0 && d.slots.length === blockedCount) return 'blocked';
    if (hasAvail) return availCount > 6 ? 'available-plenty' : 'available-limited';
    return 'unavailable';
  }, [monthData]);

  const selectedDayData: DayData | undefined = monthData[selectedDate];
  const selectedDayBookedCount = selectedDayData?.slots.filter(s => s.reason === 'booked').length || 0;

  const recurringList = useMemo(
    () => availabilities.filter(a => a.type === 'RECURRING').sort((a, b) =>
      (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0) || a.startTime.localeCompare(b.startTime)
    ),
    [availabilities]
  );

  const exceptionsList = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return availabilities
      .filter(a => a.type === 'SPECIFIC_DATE' && a.date)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .filter(a => {
        if (!a.date) return false;
        const [y, m, d] = a.date.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        dt.setHours(0, 0, 0, 0);
        return dt.getTime() >= now.getTime() - 7 * 86400000;
      });
  }, [availabilities]);

  const resetForm = () => {
    setEditingId(null);
    setFormType('RECURRING');
    setFormDayOfWeek(1);
    setFormDate(selectedDate || todayKey());
    setFormStart('10:00');
    setFormEnd('14:00');
    setFormIsAvailable(true);
    setFormNote('');
  };

  const handleOpenCreate = (preset?: 'RECURRING' | 'SPECIFIC_DATE') => {
    resetForm();
    if (preset === 'SPECIFIC_DATE') {
      setFormType('SPECIFIC_DATE');
      setFormDate(selectedDate || todayKey());
    } else {
      setFormType('RECURRING');
      if (selectedDate) {
        const d = new Date(selectedDate);
        setFormDayOfWeek(d.getDay());
      }
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: AvailabilityRecord) => {
    setEditingId(a.id);
    setFormType(a.type);
    setFormDayOfWeek(a.dayOfWeek ?? 1);
    setFormDate(a.date ?? selectedDate ?? todayKey());
    setFormStart(a.startTime);
    setFormEnd(a.endTime);
    setFormIsAvailable(a.isAvailable);
    setFormNote(a.note ?? '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this availability entry?')) return;
    try {
      const res = await fetch(`/api/admin/availability/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAvailabilities(prev => prev.filter(x => x.id !== id));
        fetchMonth();
        showToast('Availability entry deleted.', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to delete.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      type: formType,
      startTime: formStart,
      endTime: formEnd,
      isAvailable: formIsAvailable,
      note: formNote || null,
    };
    if (formType === 'RECURRING') payload.dayOfWeek = formDayOfWeek;
    else payload.date = formDate;

    try {
      const url = editingId ? `/api/admin/availability/${editingId}` : '/api/admin/availability';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Failed to save.', 'error');
        return;
      }
      const data = await res.json();
      const newAv: AvailabilityRecord = {
        ...data.availability,
        date: data.availability.date
          ? new Date(data.availability.date).toISOString().slice(0, 10)
          : null,
      };
      if (editingId) {
        setAvailabilities(prev => prev.map(x => (x.id === editingId ? newAv : x)));
      } else {
        setAvailabilities(prev => [...prev, newAv]);
      }
      setIsModalOpen(false);
      resetForm();
      fetchMonth();
      showToast(editingId ? 'Availability updated.' : 'Availability added.', 'success');
    } catch (e) {
      console.error(e);
      showToast('An error occurred.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--soft-charcoal)', margin: 0 }}>
            Consultation Availability
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
            Manage recurring weekly schedule and specific date overrides.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleOpenCreate('RECURRING')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Repeat size={16} /> Add Weekly Rule
          </button>
          <button
            onClick={() => handleOpenCreate('SPECIFIC_DATE')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Calendar size={16} /> Add Date Override
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.5rem',
          backgroundColor: 'white',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          fontSize: '0.825rem',
          color: '#4B5563',
        }}
      >
        <LegendDot color="#7D9182" label="Available" />
        <LegendDot color="#A8C5A2" label="Limited slots" />
        <LegendDot color="#F59E0B" label="Partial (some booked)" />
        <LegendDot color="#DC2626" label="Fully booked" />
        <LegendDot color="#9CA3AF" label="Unavailable / blocked" />
        <LegendDot color="#E5E7EB" label="Past / No schedule" />
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '1.5rem',
        }}
        className="availability-main-grid"
      >
        {/* Calendar */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <button
              onClick={handlePrevMonth}
              disabled={isPrevMonthDisabled()}
              aria-label="Previous month"
              className="calendar-nav-btn"
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: isPrevMonthDisabled() ? '#F9FAFB' : 'white',
                cursor: isPrevMonthDisabled() ? 'not-allowed' : 'pointer',
                opacity: isPrevMonthDisabled() ? 0.45 : 1,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, fontWeight: 500 }}>
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="calendar-nav-btn"
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: 'white',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#6B7280',
              marginBottom: '0.5rem',
            }}
          >
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ textAlign: 'center', padding: '0.5rem' }}>{d}</div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}
          >
            {cells.map((c, idx) => {
              if (!c) return <div key={`e-${idx}`} />;
              const key = formatDateKey(c);
              const isSelected = selectedDate === key;
              const disabled = isPastDate(key);
              const clazz = dateColorClass(key);
              const bgMap: Record<string, string> = {
                'available-plenty': '#DDE8DA',
                'available-limited': '#EEF4EC',
                'partial': '#FEF3C7',
                'fully-booked': '#FEE2E2',
                'blocked': '#F3F4F6',
                'unavailable': '#F9FAFB',
                'unconfigured': '#FAFAFA',
                'past': '#F9FAFB',
                'unknown': '#FAFAFA',
              };
              const bg = bgMap[clazz] || '#FAFAFA';
              const isToday = key === todayKey();

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  disabled={false}
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    minHeight: '56px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    borderRadius: '8px',
                    border: isSelected
                      ? '2px solid var(--eucalyptus-green)'
                      : '1px solid rgba(229, 231, 235, 0.6)',
                    backgroundColor: bg,
                    cursor: 'pointer',
                    fontWeight: isSelected ? 600 : 400,
                    color: disabled ? '#9CA3AF' : '#1F2937',
                    transition: 'all 0.15s',
                    fontSize: '0.9rem',
                    outline: isToday && !isSelected ? '2px solid #F59E0B' : undefined,
                    outlineOffset: '-3px',
                  }}
                >
                  <span>{c.getDate()}</span>
                  {!disabled && (
                    <span
                      style={{
                        display: 'inline-flex',
                        gap: '2px',
                      }}
                    >
                      {clazz === 'available-plenty' && <Dot color="#3F6E51" />}
                      {clazz === 'available-limited' && <Dot color="#7D9182" />}
                      {clazz === 'partial' && <Dot color="#F59E0B" />}
                      {clazz === 'fully-booked' && <Dot color="#DC2626" />}
                      {clazz === 'blocked' && <Dot color="#9CA3AF" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day panel */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--eucalyptus-green)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <CalendarDays size={14} /> Selected Date
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: 0, color: 'var(--soft-charcoal)' }}>
                {formatFriendlyDate(selectedDate)}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                {isPastDate(selectedDate)
                  ? 'Past date — bookings cannot be added.'
                  : `${selectedDayData?.slots.filter(s => s.available).length ?? 0} available of ${selectedDayData?.slots.length ?? 0} slots  ·  ${selectedDayBookedCount} booked`}
              </p>
            </div>
            {!isPastDate(selectedDate) && (
              <button
                onClick={() => handleOpenCreate('SPECIFIC_DATE')}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={14} /> Override
              </button>
            )}
          </div>

          {loading || !selectedDayData ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: '#9CA3AF' }}>Loading...</p>
          ) : selectedDayData.slots.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                backgroundColor: '#FAFAFA',
                borderRadius: '10px',
                border: '1px dashed #D1D5DB',
              }}
            >
              <AlertCircle size={32} color="#9CA3AF" style={{ marginBottom: '0.75rem' }} />
              <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
                No schedule configured for this date.
              </p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#9CA3AF', fontSize: '0.825rem' }}>
                {isPastDate(selectedDate)
                  ? 'Past dates cannot be booked.'
                  : 'It will inherit any recurring rules, or add an override above.'}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {selectedDayData.slots.map(s => {
                const state = !s.available ? s.reason : 'available';
                const styleMap: Record<string, React.CSSProperties> = {
                  available: {
                    backgroundColor: 'var(--surface-sage)',
                    border: '1px solid #BCCDB7',
                    color: '#3C5645',
                  },
                  booked: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FECACA',
                    color: '#7F1D1D',
                    textDecoration: 'line-through',
                  },
                  blocked: {
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    color: '#6B7280',
                    textDecoration: 'line-through',
                  },
                  past: {
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    color: '#9CA3AF',
                  },
                  unconfigured: {
                    backgroundColor: '#FAFAFA',
                    border: '1px dashed #E5E7EB',
                    color: '#9CA3AF',
                  },
                };
                const icon = state === 'available' ? <CheckCircle2 size={12} /> : state === 'booked' ? <Ban size={12} /> : state === 'blocked' ? <X size={12} /> : null;
                return (
                  <div
                    key={s.time}
                    style={{
                      padding: '0.55rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      textAlign: 'center',
                      ...styleMap[state || 'unconfigured'],
                    }}
                  >
                    {icon}
                    <span>{s.time}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recurring + Exceptions lists */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '1.5rem',
        }}
        className="availability-lists-grid"
      >
        <AvailabilityListCard
          title="Weekly Recurring Rules"
          icon={<Repeat size={16} color="var(--eucalyptus-green)" />}
          subtitle="Applies every week on the chosen day. Specific-date overrides take priority."
          emptyText="No recurring rules yet. Click Add Weekly Rule."
          items={recurringList}
          renderItemLabel={a => `${DAY_FULL_NAMES[a.dayOfWeek ?? 0]}  ·  ${time24To12(a.startTime)} – ${time24To12(a.endTime)}`}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
        <AvailabilityListCard
          title="Date Overrides & Exceptions"
          icon={<Calendar size={16} color="var(--warm-terracotta)" />}
          subtitle="Applies to one specific date. Overrides any recurring rule for that day."
          emptyText="No date overrides yet. Click Add Date Override."
          items={exceptionsList}
          renderItemLabel={a => a.date ? `${formatFriendlyDate(a.date)}  ·  ${time24To12(a.startTime)} – ${time24To12(a.endTime)}` : ''}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            width: '100%', maxWidth: '620px', maxHeight: '92vh',
            overflowY: 'auto', padding: '1.75rem 1.75rem 1.5rem',
            boxShadow: 'var(--shadow-soft)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, fontFamily: 'var(--font-serif)' }}>
                {editingId ? 'Edit Availability' : formType === 'RECURRING' ? 'Add Weekly Availability Rule' : 'Add Specific Date Override'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Rule Type</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setFormType('RECURRING')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.85rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${formType === 'RECURRING' ? 'var(--eucalyptus-green)' : '#E5E7EB'}`,
                      backgroundColor: formType === 'RECURRING' ? 'var(--surface-sage)' : 'white',
                      color: formType === 'RECURRING' ? 'var(--soft-charcoal)' : '#4B5563',
                      fontWeight: formType === 'RECURRING' ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'center',
                    }}
                  >
                    <Repeat size={16} />
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>Weekly (Recurring)</div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 400 }}>Repeats every week on a chosen day</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('SPECIFIC_DATE')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.85rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${formType === 'SPECIFIC_DATE' ? 'var(--warm-terracotta)' : '#E5E7EB'}`,
                      backgroundColor: formType === 'SPECIFIC_DATE' ? '#FBF3EA' : 'white',
                      color: formType === 'SPECIFIC_DATE' ? 'var(--soft-charcoal)' : '#4B5563',
                      fontWeight: formType === 'SPECIFIC_DATE' ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      gap: '0.6rem',
                      alignItems: 'center',
                    }}
                  >
                    <Calendar size={16} />
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>Specific Date</div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 400 }}>One-time override for a calendar date</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Day / Date */}
              {formType === 'RECURRING' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Day of Week</label>
                  <select
                    value={formDayOfWeek}
                    onChange={e => setFormDayOfWeek(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'white', fontSize: '0.9rem' }}
                  >
                    {DAY_FULL_NAMES.map((d, i) => <option key={d} value={i}>{d}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
                  />
                </div>
              )}

              {/* Times */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Start Time (24h)</label>
                  <input
                    type="time"
                    value={formStart}
                    onChange={e => setFormStart(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>End Time (24h)</label>
                  <input
                    type="time"
                    value={formEnd}
                    onChange={e => setFormEnd(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Available? */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500 }}>Status</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setFormIsAvailable(true)}
                    style={{
                      flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px',
                      border: `1.5px solid ${formIsAvailable ? 'var(--eucalyptus-green)' : '#E5E7EB'}`,
                      backgroundColor: formIsAvailable ? 'var(--surface-sage)' : 'white',
                      color: formIsAvailable ? '#2F4A37' : '#4B5563',
                      fontWeight: formIsAvailable ? 600 : 400,
                      cursor: 'pointer', display: 'inline-flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2 size={14} /> Available (open for bookings)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormIsAvailable(false)}
                    style={{
                      flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px',
                      border: `1.5px solid ${!formIsAvailable ? '#9CA3AF' : '#E5E7EB'}`,
                      backgroundColor: !formIsAvailable ? '#F3F4F6' : 'white',
                      color: !formIsAvailable ? '#374151' : '#4B5563',
                      fontWeight: !formIsAvailable ? 600 : 400,
                      cursor: 'pointer', display: 'inline-flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Ban size={14} /> Unavailable / Blocked
                  </button>
                </div>
                {!formIsAvailable && formType === 'SPECIFIC_DATE' && (
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.4rem', marginBottom: 0 }}>
                    Use this to mark holidays, meetings, personal commitments, or single-day closures.
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Note (Optional, internal only)</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={e => setFormNote(e.target.value)}
                  placeholder='e.g. "Public holiday", "Conference trip", "Afternoon meeting block"'
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '1.1rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '6px',
                    border: '1px solid #E5E7EB', backgroundColor: 'white',
                    cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.35rem', fontSize: '0.875rem' }}
                >
                  {editingId ? 'Save Changes' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
      }}
    />
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <span
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '4px',
          backgroundColor: color,
          display: 'inline-block',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      />
      <span>{label}</span>
    </div>
  );
}

function AvailabilityListCard({
  title,
  icon,
  subtitle,
  emptyText,
  items,
  renderItemLabel,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  emptyText: string;
  items: AvailabilityRecord[];
  renderItemLabel: (a: AvailabilityRecord) => string;
  onEdit: (a: AvailabilityRecord) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '1rem' }}>
        <div
          style={{
            padding: '0.35rem',
            borderRadius: '6px',
            backgroundColor: '#F9FAFB',
            display: 'inline-flex',
          }}
        >
          {icon}
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, color: 'var(--soft-charcoal)' }}>{title}</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#6B7280' }}>{subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            backgroundColor: '#FAFAFA',
            borderRadius: '10px',
            border: '1px dashed #E5E7EB',
            color: '#9CA3AF',
            fontSize: '0.9rem',
          }}
        >
          {emptyText}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map(a => (
            <div
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: a.isAvailable ? 'white' : '#F9FAFB',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: a.isAvailable ? 'var(--eucalyptus-green)' : '#9CA3AF',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--soft-charcoal)' }}>
                  {renderItemLabel(a)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                  <span
                    style={{
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: a.isAvailable ? 'rgba(125,145,130,0.1)' : '#F3F4F6',
                      color: a.isAvailable ? 'var(--eucalyptus-green)' : '#6B7280',
                      fontWeight: 600,
                      marginRight: '0.5rem',
                    }}
                  >
                    {a.isAvailable ? 'Available' : 'Blocked'}
                  </span>
                  {a.note && <span style={{ color: '#6B7280' }}>· {a.note}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                <button
                  onClick={() => onEdit(a)}
                  type="button"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--eucalyptus-green)', padding: '0.25rem' }}
                  aria-label="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDelete(a.id)}
                  type="button"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626', padding: '0.25rem' }}
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
