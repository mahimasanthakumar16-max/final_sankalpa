"use client";

import { useState, useEffect } from 'react';
import { Search, Trash2, Download, Calendar, Mail, Phone, Clock, FileSpreadsheet } from 'lucide-react';

interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  sessionType: string;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Client Name', 'Email', 'Phone', 'Session Type', 'Preferred Date', 'Preferred Time', 'Message', 'Status', 'Created Date'];
    const rows = bookings.map(b => [
      b.clientName,
      b.email,
      b.phone,
      b.sessionType,
      b.preferredDate,
      b.preferredTime,
      b.message || '',
      b.status,
      new Date(b.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sankalpa_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--soft-charcoal)', margin: 0 }}>
            Consultation Bookings
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>Track and manage patient session inquiries.</p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: bookings.length === 0 ? 0.6 : 1 }} disabled={bookings.length === 0}>
          <FileSpreadsheet size={18} /> Export CSV
        </button>
      </div>

      {/* Filter Options */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              outline: 'none',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>No bookings found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '1rem' }}>Client Details</th>
                  <th style={{ padding: '1rem' }}>Service Type</th>
                  <th style={{ padding: '1rem' }}>Schedule</th>
                  <th style={{ padding: '1rem' }}>Message</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{booking.clientName}</span>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={12} /> {booking.email}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={12} /> {booking.phone}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4B5563', fontWeight: 500 }}>
                      {booking.sessionType}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: '#4B5563' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {booking.preferredDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {booking.preferredTime}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6B7280', maxWidth: '250px', whiteSpace: 'normal', fontSize: '0.825rem' }}>
                      {booking.message || <span style={{ color: '#D1D5DB', fontStyle: 'italic' }}>None</span>}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          backgroundColor: booking.status === 'CONFIRMED' ? '#DEF7EC' : booking.status === 'PENDING' ? '#FEF08A' : booking.status === 'COMPLETED' ? '#E1EFFE' : '#FDE8E8',
                          color: booking.status === 'CONFIRMED' ? '#03543F' : booking.status === 'PENDING' ? '#713F12' : booking.status === 'COMPLETED' ? '#1E429F' : '#9B1C1C',
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(booking.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
