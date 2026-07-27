"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Testimonial {
  id: string;
  clientName: string;
  review: string;
  rating: number;
  location: string | null;
  displayOrder: number;
  enabled: boolean;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [enabled, setEnabled] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setClientName('');
    setReview('');
    setRating(5);
    setLocation('');
    setDisplayOrder(0);
    setEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setReview(t.review);
    setRating(t.rating);
    setLocation(t.location || '');
    setDisplayOrder(t.displayOrder);
    setEnabled(t.enabled);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTestimonials();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId,
      clientName,
      review,
      rating,
      location: location || null,
      displayOrder,
      enabled,
    };

    try {
      const url = '/api/admin/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
        showToast(editingId ? 'Testimonial updated successfully!' : 'Testimonial created successfully!', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Something went wrong', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--soft-charcoal)', margin: 0 }}>
            Testimonials
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>Manage client reviews displayed on the website.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>No testimonials found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              opacity: t.enabled ? 1 : 0.6,
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#FBBF24' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(t.rating) ? '#FBBF24' : 'none'} color="#FBBF24" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenEdit(t)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--eucalyptus-green)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', fontStyle: 'italic', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                  "{t.review}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '1rem', fontSize: '0.8rem' }}>
                <div>
                  <strong style={{ color: '#111827' }}>{t.clientName}</strong>
                  {t.location && <span style={{ color: '#6B7280' }}> • {t.location}</span>}
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: '#9CA3AF' }}>
                  <span>Order: <strong>{t.displayOrder}</strong></span>
                  <span style={{ fontWeight: 600, color: t.enabled ? '#10B981' : '#F59E0B' }}>
                    {t.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '2rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Client Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Chennai, India"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Review *</label>
                <textarea
                  required
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Rating (1-5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <label htmlFor="enabled" style={{ fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Enable this review on website</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}>
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
