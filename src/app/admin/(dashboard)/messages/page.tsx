"use client";

import { useState, useEffect } from 'react';
import { Search, Trash2, MailOpen, Mail, FileSpreadsheet } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  service: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?search=${encodeURIComponent(search)}&readStatus=${readFilter}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, readFilter]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentRead }),
      });
      if (res.ok) fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    if (messages.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Service Interested', 'Message', 'Read Status', 'Date Received'];
    const rows = messages.map(m => [
      m.name,
      m.email,
      m.phone || '',
      m.subject || '',
      m.service || '',
      m.message,
      m.isRead ? 'Read' : 'Unread',
      new Date(m.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sankalpa_ContactMessages_${new Date().toISOString().split('T')[0]}.csv`);
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
            Contact Messages
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>View client inquiries submitted through the contact form.</p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: messages.length === 0 ? 0.6 : 1 }} disabled={messages.length === 0}>
          <FileSpreadsheet size={18} /> Export CSV
        </button>
      </div>

      {/* Filters */}
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
              placeholder="Search by name, email, subject or message..."
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
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              outline: 'none',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: msg.isRead ? '1px solid #E5E7EB' : '4px solid var(--eucalyptus-green)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0', fontWeight: msg.isRead ? 500 : 700 }}>
                    {msg.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Email: <strong>{msg.email}</strong></span>
                    {msg.phone && <span>Phone: <strong>{msg.phone}</strong></span>}
                    {msg.service && <span>Interested in: <strong>{msg.service}</strong></span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.isRead)}
                    title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--eucalyptus-green)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {msg.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button onClick={() => handleDelete(msg.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
                {msg.subject && (
                  <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', fontWeight: 600, color: '#374151' }}>
                    Subject: {msg.subject}
                  </h4>
                )}
                <p style={{
                  fontSize: '0.875rem',
                  color: '#4B5563',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                }}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
