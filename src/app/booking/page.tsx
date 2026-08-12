"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

const MODALITIES = [
  {
    id: "individual",
    title: "Individual Counseling",
    description: "Deep one-on-one therapy sessions designed to address personal challenges, build inner strength, and foster lasting mental wellness.",
    duration: "15–20 Minutes",
    badge: "Free Initial Consultation"
  },
  {
    id: "couples",
    title: "Couples Counseling",
    description: "Collaborative counseling sessions aimed at opening healthy channels of communication, rebuilding trust, and restoring intimacy.",
    duration: "15–20 Minutes",
    badge: "Free Initial Consultation"
  },
  {
    id: "trauma",
    title: "Trauma Counseling",
    description: "A gentle, paced somatic approach designed to safely process trauma, reclaim safety, and integrate healing at your own speed.",
    duration: "15–20 Minutes",
    badge: "Free Initial Consultation"
  },
  {
    id: "adolescent",
    title: "Adolescent Counseling",
    description: "Tailored counseling for adolescents and young adults navigating developmental transitions, academic stress, or identity exploration.",
    duration: "15–20 Minutes",
    badge: "Free Initial Consultation"
  }
];

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const todayKey = () => formatDateKey(new Date());

function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt.getTime() < today.getTime();
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mode: 'virtual',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [monthAvailability, setMonthAvailability] = useState<Record<string, DayData>>({});
  const [monthLoading, setMonthLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
  const [apiError, setApiError] = useState<string>('');

  const formatFriendlyDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  useEffect(() => {
    let cancelled = false;
    setMonthLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/available-slots?month=${monthKey}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setMonthAvailability(data.availability || {});
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setMonthLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [monthKey]);

  // Fetch selected day details when selection changes (keeps booked/blocked live)
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDayData(null);
      return;
    }
    let cancelled = false;
    setDayLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/available-slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            const day: DayData = {
              date: data.date,
              hasAnyAvailability: data.hasAnyAvailability,
              slots: data.slots,
            };
            setSelectedDayData(day);
            setMonthAvailability(prev => ({ ...prev, [selectedDate]: day }));
            if (selectedTime) {
              const stillOk = day.slots.find(s => s.time === selectedTime && s.available);
              if (!stillOk) setSelectedTime(null);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setDayLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedDate, selectedTime]);

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = useMemo(() => {
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [startDayOfWeek, daysInMonth, year, month]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const dateHasAnyAvailability = useCallback((dateStr: string): boolean => {
    if (isPastDate(dateStr)) return false;
    const d = monthAvailability[dateStr];
    return !!d?.hasAnyAvailability;
  }, [monthAvailability]);

  const dateStatusClass = useCallback((dateStr: string): string => {
    if (isPastDate(dateStr)) return 'past';
    const d = monthAvailability[dateStr];
    if (!d) return 'unknown';
    if (d.slots.length === 0) return 'unconfigured';
    const availCount = d.slots.filter(s => s.available).length;
    const bookedCount = d.slots.filter(s => s.reason === 'booked').length;
    const blockedCount = d.slots.filter(s => s.reason === 'blocked').length;
    if (bookedCount > 0 && availCount > 0) return 'partial';
    if (bookedCount > 0 && availCount === 0) return 'fully-booked';
    if (blockedCount === d.slots.length) return 'blocked';
    if (availCount === 0) return 'unavailable';
    if (availCount > 5) return 'available-plenty';
    return 'available-limited';
  }, [monthAvailability]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const isPrevMonthDisabled = () => {
    const today = new Date();
    return year <= today.getFullYear() && month <= today.getMonth();
  };

  const selectedModalityObj = MODALITIES.find(m => m.id === selectedModality);

  const getGCalLink = () => {
    if (!selectedDate || !selectedTime || !selectedModalityObj) return "#";
    
    const [y, m, d] = selectedDate.split('-').map(Number);
    const [timeStr, modifier] = selectedTime.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const start = new Date(y, m - 1, d, hours, minutes);
    const durationMins = 15;
    const end = new Date(start.getTime() + durationMins * 60000);
    
    const formatDateISO = (dt: Date) => dt.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = encodeURIComponent(`Free Initial Consultation: ${selectedModalityObj.title} with Sankalpa Counseling`);
    const details = encodeURIComponent(`Your free initial consultation.\nFormat: ${formData.mode === 'virtual' ? 'Virtual (Video Call)' : 'Phone Call'}\nNotes: ${formData.notes || 'None'}`);
    const dates = `${formatDateISO(start)}/${formatDateISO(end)}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedModalityObj) return;
    // Live double-check: re-verify slot availability at submit time
    try {
      const checkRes = await fetch(`/api/available-slots?date=${selectedDate}`);
      if (checkRes.ok) {
        const d = await checkRes.json();
        const match = d.slots.find((s: SlotInfo) => s.time === selectedTime);
        if (!match || !match.available) {
          setSubmitError('Sorry, that slot is no longer available. Please choose another time.');
          return;
        }
      }
    } catch (e) { /* skip */ }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          email: formData.email,
          phone: formData.phone,
          sessionType: `${selectedModalityObj.title} (${formData.mode})`,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
          message: formData.notes,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && selectedModalityObj && selectedDate && selectedTime) {
    return (
      <div className="booking-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="booking-card">
            <div className="booking-success">
              <div className="success-badge">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="success-title">Your Consultation is Booked!</h2>
              <p className="success-desc">
                Thank you, {formData.name}. A confirmation email with the session details has been sent to {formData.email}.
              </p>

              <div className="details-summary-box">
                <div className="summary-row">
                  <span className="summary-label">Date</span>
                  <span className="summary-val">{formatFriendlyDate(selectedDate)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Time</span>
                  <span className="summary-val">{selectedTime}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Session Type</span>
                  <span className="summary-val">{selectedModalityObj.title} ({selectedModalityObj.duration})</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Format</span>
                  <span className="summary-val">
                    {formData.mode === 'virtual' ? 'Virtual (Video Call)' : 'Phone Call'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={getGCalLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-booking-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '4px' }}>
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                  Add to Google Calendar
                </a>
                <Link href="/" className="btn-booking-secondary" style={{ textDecoration: 'none' }}>
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center">
          <span className="booking-pill">Free Initial Consultation</span>
          <h1 className="booking-title">Book a Consultation</h1>
          <p className="booking-subtitle">
            Choose a time that works for you. Your first consultation is completely free and confidential.
          </p>
        </div>

        <div className="booking-stepper">
          <div className="stepper-step">
            <div className={`stepper-number ${step >= 1 ? 'active' : 'inactive'}`}>1</div>
            <span className={`stepper-text ${step >= 1 ? 'active' : 'inactive'}`}>Date & Time</span>
          </div>
          <div className="stepper-line"></div>
          <div className="stepper-step">
            <div className={`stepper-number ${step >= 2 ? 'active' : 'inactive'}`}>2</div>
            <span className={`stepper-text ${step >= 2 ? 'active' : 'inactive'}`}>Session Type</span>
          </div>
          <div className="stepper-line"></div>
          <div className="stepper-step">
            <div className={`stepper-number ${step >= 3 ? 'active' : 'inactive'}`}>3</div>
            <span className={`stepper-text ${step >= 3 ? 'active' : 'inactive'}`}>Your Details</span>
          </div>
        </div>

        <div className="booking-card">
          {step === 1 && (
            <div>
              <div className="booking-grid">
                <div>
                  <div className="calendar-header">
                    <button 
                      className="calendar-nav-btn" 
                      onClick={handlePrevMonth} 
                      disabled={isPrevMonthDisabled() || monthLoading}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="calendar-month-title">
                      {MONTH_NAMES[month]} {year}
                      {monthLoading && <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginLeft: '0.5rem', fontWeight: 400 }}>…</span>}
                    </h3>
                    <button 
                      className="calendar-nav-btn" 
                      onClick={handleNextMonth}
                      disabled={monthLoading}
                      aria-label="Next month"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="calendar-grid-header">
                    {DAYS_OF_WEEK.map((d, i) => (
                      <span key={d} className={i === 0 ? 'sunday' : ''}>{d}</span>
                    ))}
                  </div>

                  <div className="calendar-days-grid">
                    {cells.map((cellDate, index) => {
                      if (!cellDate) return <div key={`empty-${index}`} />;

                      const dateKey = formatDateKey(cellDate);
                      const isSelected = selectedDate === dateKey;
                      const disabled = isDateDisabled(cellDate);
                      const status = dateStatusClass(dateKey);
                      const hasAvail = dateHasAnyAvailability(dateKey);

                      const statusBgMap: Record<string, string> = {
                        'available-plenty': 'rgba(125,145,130,0.12)',
                        'available-limited': 'rgba(125,145,130,0.06)',
                        'partial': '#FFFBEB',
                        'fully-booked': '#FEF2F2',
                        'blocked': '#F9FAFB',
                        'unavailable': '#FAFAFA',
                        'unconfigured': '#FAFAFA',
                        'past': '#FAFAFA',
                        'unknown': '#FAFAFA',
                      };
                      const todayIs = dateKey === todayKey();

                      return (
                        <button
                          key={dateKey}
                          className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setSelectedTime(null);
                          }}
                          disabled={disabled || !hasAvail}
                          type="button"
                          style={{
                            backgroundColor: isSelected
                              ? undefined
                              : disabled || !hasAvail
                                ? '#FAFAFA'
                                : statusBgMap[status],
                            borderColor: isSelected
                              ? undefined
                              : status === 'fully-booked' ? '#FECACA'
                              : status === 'partial' ? '#FDE68A'
                              : status === 'available-plenty' || status === 'available-limited' ? '#C9D8C5'
                              : undefined,
                            cursor: disabled || !hasAvail ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.45 : !hasAvail ? 0.6 : 1,
                            color: disabled || !hasAvail ? '#9CA3AF' : undefined,
                            fontWeight: todayIs ? 600 : undefined,
                            boxShadow: todayIs && !isSelected ? 'inset 0 0 0 2px #F59E0B' : undefined,
                          }}
                          title={
                            disabled ? 'Past date — unavailable'
                            : !hasAvail ? 'No slots available on this date'
                            : undefined
                          }
                        >
                          {cellDate.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem', color: '#6B7280' }}>
                    <LegendDot color="rgba(125,145,130,0.12)" label="Available" />
                    <LegendDot color="#FFFBEB" label="Some booked" />
                    <LegendDot color="#FEF2F2" label="Fully booked" />
                    <LegendDot color="#FAFAFA" label="Unavailable / No schedule" />
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: '2rem' }} className="available-times-pane">
                  <h3 className="times-header">
                    <Clock size={20} /> Available Times
                  </h3>

                  {!selectedDate ? (
                    <div className="times-placeholder">
                      <CalendarIcon size={48} strokeWidth={1} />
                      <p style={{ fontSize: '0.95rem', margin: 0 }}>Select a date to see available times</p>
                    </div>
                  ) : dayLoading ? (
                    <div className="times-placeholder">
                      <p style={{ fontSize: '0.95rem', margin: 0, color: '#6B7280' }}>Loading times…</p>
                    </div>
                  ) : !selectedDayData || selectedDayData.slots.length === 0 ? (
                    <div className="times-placeholder" style={{ border: '1px dashed #E5E7EB', borderRadius: '10px', padding: '1.5rem 1rem' }}>
                      <AlertCircle size={36} color="#9CA3AF" />
                      <p style={{ fontSize: '0.95rem', margin: '0.5rem 0 0 0', color: '#374151', fontWeight: 500 }}>
                        No times available on this date
                      </p>
                      <p style={{ fontSize: '0.825rem', margin: '0.25rem 0 0 0', color: '#6B7280' }}>
                        Please choose another day on the calendar.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="times-grid animate-fade-in">
                        {selectedDayData.slots.map(slot => {
                          const isSelected = selectedTime === slot.time;
                          const isDisabled = !slot.available;
                          const state = slot.reason || (slot.available ? 'open' : 'other');
                          let title = '';
                          if (state === 'booked') title = 'Already booked';
                          else if (state === 'blocked') title = 'Unavailable';
                          else if (state === 'past') title = 'This time has already passed today';
                          return (
                            <button
                              key={slot.time}
                              className={`time-slot-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                              onClick={() => setSelectedTime(slot.time)}
                              disabled={isDisabled}
                              title={title}
                              type="button"
                              style={{
                                opacity: isDisabled && !isSelected ? 0.55 : undefined,
                                textDecoration: isDisabled ? 'line-through' : undefined,
                              }}
                            >
                              {slot.time}
                              {state === 'booked' && (
                                <span style={{ display: 'block', fontSize: '0.6rem', color: '#B91C1C', marginTop: '2px' }}>Booked</span>
                              )}
                              {state === 'blocked' && (
                                <span style={{ display: 'block', fontSize: '0.6rem', color: '#6B7280', marginTop: '2px' }}>Unavailable</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {apiError && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#B45309' }}>
                          {apiError}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="booking-actions">
                <div></div>
                <button
                  className="btn-booking-primary"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                  type="button"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="modality-grid">
                {MODALITIES.map((modality) => {
                  const isSelected = selectedModality === modality.id;
                  return (
                    <button
                      key={modality.id}
                      className={`modality-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedModality(modality.id)}
                      type="button"
                    >
                      <div className="modality-header">
                        <h4 className="modality-title">{modality.title}</h4>
                        <span className="modality-badge">{modality.badge}</span>
                      </div>
                      <p className="modality-desc">{modality.description}</p>
                      <div className="modality-meta">
                        <span>Duration: {modality.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="booking-actions">
                <button
                  className="btn-booking-secondary"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  className="btn-booking-primary"
                  disabled={!selectedModality}
                  onClick={() => setStep(3)}
                  type="button"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleFormSubmit} className="booking-form">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mode">Session Format</label>
                <select
                  id="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                >
                  <option value="virtual">Virtual (Video Call)</option>
                  <option value="phone">Phone Call</option>
                </select>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: 0 }}>
                  All initial consultations are currently offered virtually via secure video call or by phone.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">
                  Any notes or concerns you&apos;d like to share (Optional)
                </label>
                <textarea
                  id="notes"
                  className="form-input"
                  rows={4}
                  placeholder="Briefly describe what you would like to focus on in therapy..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {submitError && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div>{submitError}</div>
                </div>
              )}

              <div className="booking-actions">
                <button
                  className="btn-booking-secondary"
                  onClick={() => setStep(2)}
                  type="button"
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="btn-booking-primary"
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Free Consultation'} <CheckCircle2 size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '3px',
          backgroundColor: color,
          display: 'inline-block',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      />
      <span>{label}</span>
    </div>
  );
}
