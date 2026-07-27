"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Link as LinkIcon, FileText } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function ResourcesAdminPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [published, setPublished] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/resources?search=${encodeURIComponent(search)}&category=${categoryFilter}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Wellness');
    setDescription('');
    setFileUrl('');
    setThumbnailUrl('');
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setEditingId(res.id);
    setTitle(res.title);
    setCategory(res.category);
    setDescription(res.description);
    setFileUrl(res.fileUrl);
    setThumbnailUrl(res.thumbnailUrl || '');
    setPublished(res.published);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchResources();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId,
      title,
      category,
      description,
      fileUrl,
      thumbnailUrl: thumbnailUrl || null,
      published,
    };

    try {
      const url = '/api/admin/resources';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchResources();
        showToast(editingId ? 'Resource updated successfully!' : 'Resource added successfully!', 'success');
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
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--soft-charcoal)', margin: 0 }}>
            Resource Library
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>Upload and manage client resources & worksheets.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Resource
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
              placeholder="Search resources..."
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
          <input
            type="text"
            placeholder="Category filter..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              outline: 'none',
              fontSize: '0.875rem',
            }}
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading resources...</p>
      ) : resources.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>No resources found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {resources.map((res) => (
            <div key={res.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--surface-sage)', color: 'var(--eucalyptus-green)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    {res.category}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenEdit(res)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--eucalyptus-green)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(res.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600, color: '#111827' }}>{res.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: '0 0 1rem 0' }}>{res.description}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
                <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--eucalyptus-green)', textDecoration: 'none', fontWeight: 500 }}>
                  <FileText size={16} /> Download File Link
                </a>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF' }}>
                  <span>Created: {new Date(res.createdAt).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 600, color: res.published ? '#10B981' : '#F59E0B' }}>
                    {res.published ? 'Published' : 'Hidden'}
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
            maxWidth: '550px',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Category *</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Anxiety, Relationships, Mindfulness"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>File URL (PDF Link) *</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Thumbnail Image URL</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <label htmlFor="published" style={{ fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Publish immediately</label>
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
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
