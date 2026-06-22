"use client";

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Video, 
  MapPin, 
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import Link from 'next/link';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

const MODALITIES = [
  {
    id: "individual",
    title: "Individual Journey",
    description: "Deep one-on-one therapy sessions designed to address personal challenges, build inner strength, and foster lasting mental wellness.",
    duration: "50 Mins",
    format: "Online & In-Person",
    badge: "Free First Session"
  },
  {
    id: "couples",
    title: "Couples Harmony",
    description: "Collaborative counseling sessions aimed at opening healthy channels of communication, rebuilding trust, and restoring intimacy.",
    duration: "60 Mins",
    format: "Online & In-Person",
    badge: "Free First Session"
  },
  {
    id: "trauma",
    title: "Trauma Recovery",
    description: "A gentle, paced somatic approach designed to safely process trauma, reclaim safety, and integrate healing at your own speed.",
    duration: "50 Mins",
    format: "Online Only",
    badge: "Free First Session"
  },
  {
    id: "adolescent",
    title: "Adolescent Support",
    description: "Tailored counseling for adolescents and young adults navigating developmental transitions, academic stress, or identity exploration.",
    duration: "45 Mins",
    format: "Online & In-Person",
    badge: "Free First Session"
  }
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    // Default to June 2026 if today is earlier, matching user scenario context
    if (today.getFullYear() < 2026 || (today.getFullYear() === 2026 && today.getMonth() < 5)) {
      return new Date(2026, 5, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mode: 'online',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper formatting functions
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatFriendlyDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calendar math
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d < today;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
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
    
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const start = new Date(y, m - 1, d, hours, minutes);
    const durationMins = selectedModalityObj.id === 'couples' ? 60 : selectedModalityObj.id === 'adolescent' ? 45 : 50;
    const end = new Date(start.getTime() + durationMins * 60000);
    
    const formatDateISO = (dt: Date) => {
      return dt.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    
    const title = encodeURIComponent(`Consultation: ${selectedModalityObj.title} with Sankalpa Counseling`);
    const details = encodeURIComponent(`Your free initial therapy consultation.\nFormat: ${formData.mode === 'online' ? 'Online (Video Link will be sent)' : 'In-Person at Sankalpa Counseling'}\nNotes: ${formData.notes || 'None'}`);
    const dates = `${formatDateISO(start)}/${formatDateISO(end)}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
                    {formData.mode === 'online' ? 'Online (Video Call)' : 'In-Person (Office)'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Location</span>
                  <span className="summary-val">
                    {formData.mode === 'online' ? 'Online via Secure Link' : 'Sankalpa Office, Tamil Nadu'}
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
          <span className="booking-pill">Free First Session</span>
          <h1 className="booking-title">Book a Consultation</h1>
          <p className="booking-subtitle">
            Choose a time that works for you. Your first consultation is completely free and confidential.
          </p>
        </div>

        {/* Stepper Progress Bar */}
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

        {/* Main Card */}
        <div className="booking-card">
          {/* Step 1: Date & Time Selector */}
          {step === 1 && (
            <div>
              <div className="booking-grid">
                {/* Left Column: Calendar */}
                <div>
                  <div className="calendar-header">
                    <button 
                      className="calendar-nav-btn" 
                      onClick={handlePrevMonth} 
                      disabled={isPrevMonthDisabled()}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="calendar-month-title">
                      {MONTH_NAMES[month]} {year}
                    </h3>
                    <button 
                      className="calendar-nav-btn" 
                      onClick={handleNextMonth}
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
                      if (!cellDate) {
                        return <div key={`empty-${index}`} />;
                      }

                      const dateKey = formatDateKey(cellDate);
                      const isSelected = selectedDate === dateKey;
                      const isDisabled = isDateDisabled(cellDate);

                      return (
                        <button
                          key={dateKey}
                          className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setSelectedTime(null); // Reset selected time on date change
                          }}
                          disabled={isDisabled}
                          type="button"
                        >
                          {cellDate.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Available Times */}
                <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: '2rem' }} className="available-times-pane">
                  <h3 className="times-header">
                    <Clock size={20} /> Available Times
                  </h3>

                  {!selectedDate ? (
                    <div className="times-placeholder">
                      <CalendarIcon size={48} strokeWidth={1} />
                      <p style={{ fontSize: '0.95rem', margin: 0 }}>Select a date to see available times</p>
                    </div>
                  ) : (
                    <div className="times-grid animate-fade-in">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                          type="button"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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

          {/* Step 2: Session Type (Modality) Selection */}
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
                        <span>{modality.format}</span>
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

          {/* Step 3: Your Details Form */}
          {step === 3 && (
            <form onSubmit={handleFormSubmit} className="booking-form">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
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
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
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
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
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
                <label className="form-label" htmlFor="mode">
                  Session Format
                </label>
                <select
                  id="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                >
                  <option value="online">Online (Video Call)</option>
                  {selectedModality !== 'trauma' && (
                    <option value="in-person">In-Person (Office)</option>
                  )}
                </select>
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

              <div className="booking-actions">
                <button
                  className="btn-booking-secondary"
                  onClick={() => setStep(2)}
                  type="button"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="btn-booking-primary"
                >
                  Confirm Free Appointment <CheckCircle2 size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
