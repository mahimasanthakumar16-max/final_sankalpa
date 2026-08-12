"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, FileText } from 'lucide-react';
import { useToast } from '@/components/Toast';
import RichTextEditor from '@/components/admin/RichTextEditor';

function stripHtml(html: string): string {
  if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  mainImage: string | null;
  categories: string[];
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle: string | null;
  metaDescription: string | null;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Mahima Tirunelveli Santhakumar');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [mainImage, setMainImage] = useState<string | null>(null); // URL string for featured image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [featured, setFeatured] = useState(false);
  const [categoriesInput, setCategoriesInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setAuthor('Mahima Tirunelvi Santhakumar');
    setStatus('DRAFT');
    setMainImage(null); // reset featured image URL
    setSelectedFile(null);
    setPreviewUrl('');
    setFeatured(false);
    setCategoriesInput('');
    setSeoTitle('');
    setMetaDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setAuthor(blog.author);
    setStatus(blog.status);
    setMainImage(blog.mainImage || '');
    setFeatured(blog.featured);
    setCategoriesInput(blog.categories.join(', '));
    setSeoTitle(blog.seoTitle || '');
    setMetaDescription(blog.metaDescription || '');
    // Show existing image preview if present
    setPreviewUrl(blog.mainImage || '');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categories = categoriesInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // If a new image file is selected, upload it first
    let imageUrl = mainImage || null;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadRes = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) {
        showToast('Image upload failed', 'error');
        return;
      }
      const data = await uploadRes.json();
      imageUrl = data.url;
      setMainImage(imageUrl);
    }

    const payload = {
      title,
      excerpt,
      content,
      author,
      status,
      mainImage: imageUrl,
      featured,
      categories,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt.substring(0, 160),
    };

    try {
      const url = editingId ? `/api/admin/blogs/${editingId}` : '/api/admin/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
        showToast(editingId ? 'Blog updated successfully!' : 'Blog created successfully!', 'success');
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
            Blogs Management
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>Create, edit, and publish articles.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Blog Post
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
              placeholder="Search blogs..."
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
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs List */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>No blogs found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Author</th>
                <th style={{ padding: '1rem' }}>Categories</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{blog.title}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 400 }}>/{blog.slug}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#4B5563' }}>{blog.author}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {blog.categories.map((cat, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6B7280' }}>{new Date(blog.publishedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      backgroundColor: blog.status === 'PUBLISHED' ? '#DEF7EC' : '#FEF08A',
                      color: blog.status === 'PUBLISHED' ? '#03543F' : '#713F12',
                    }}>{blog.status}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenEdit(blog)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--eucalyptus-green)' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
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
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Content *</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog article here. Use the toolbar for headings, formatting, lists, links, and images..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Featured Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file) {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                  {previewUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(''); setMainImage(''); }} style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <label htmlFor="featured" style={{ fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Featured Post</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Categories (comma separated)</label>
                <input
                  type="text"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  placeholder="Anxiety, Emotional Wellness"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>SEO Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>SEO Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Same as title if empty"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Same as excerpt if empty"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                    />
                  </div>
                </div>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
