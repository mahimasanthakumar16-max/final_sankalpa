import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CalendarRange, 
  MessageSquare, 
  Library, 
  HeartHandshake,
  ArrowRight,
  UserCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import AdminCard from '@/components/admin/AdminCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverview() {
  // Fetch stats and lists in parallel using Prisma
  const [
    blogCount,
    bookingCount,
    messageCount,
    resourceCount,
    testimonialCount,
    recentBookings,
    recentMessages,
    recentBlogs
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.booking.count(),
    prisma.contactMessage.count(),
    prisma.resource.count(),
    prisma.testimonial.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          color: 'var(--soft-charcoal)',
          margin: '0 0 0.5rem 0',
        }}>Overview</h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
          Welcome back to the Sankalpa Admin Portal. Here is your dashboard summary.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
      }}>
        <AdminCard 
          title="Total Blogs" 
          value={blogCount} 
          icon={<BookOpen size={22} />} 
        />
        <AdminCard 
          title="Bookings" 
          value={bookingCount} 
          icon={<CalendarRange size={22} />} 
        />
        <AdminCard 
          title="Messages" 
          value={messageCount} 
          icon={<MessageSquare size={22} />} 
        />
        <AdminCard 
          title="Resources" 
          value={resourceCount} 
          icon={<Library size={22} />} 
        />
        <AdminCard 
          title="Testimonials" 
          value={testimonialCount} 
          icon={<HeartHandshake size={22} />} 
        />
      </div>

      {/* Tables/Widgets Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
      }}>
        
        {/* Recent Bookings Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Recent Bookings</h3>
            <Link href="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--eucalyptus-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', textAlign: 'center', margin: '2rem 0' }}>No bookings received yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentBookings.map((booking) => (
                <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{booking.clientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{booking.sessionType} • {booking.preferredDate} @ {booking.preferredTime}</div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    backgroundColor: booking.status === 'CONFIRMED' ? '#DEF7EC' : booking.status === 'PENDING' ? '#FEF08A' : booking.status === 'COMPLETED' ? '#E1EFFE' : '#FDE8E8',
                    color: booking.status === 'CONFIRMED' ? '#03543F' : booking.status === 'PENDING' ? '#713F12' : booking.status === 'COMPLETED' ? '#1E429F' : '#9B1C1C',
                  }}>
                    {booking.status.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Recent Messages</h3>
            <Link href="/admin/messages" style={{ fontSize: '0.85rem', color: 'var(--eucalyptus-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', textAlign: 'center', margin: '2rem 0' }}>No messages received yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.name}</div>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: msg.isRead ? 400 : 600 }}>
                    {msg.subject || 'No Subject'}
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Blog Posts Widget */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Recent Blog Posts</h3>
          <Link href="/admin/blogs" style={{ fontSize: '0.85rem', color: 'var(--eucalyptus-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
            Manage Blogs <ArrowRight size={14} />
          </Link>
        </div>
        {recentBlogs.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', textAlign: 'center', margin: '2rem 0' }}>No blogs created yet.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {recentBlogs.map((blog) => (
              <div key={blog.id} style={{
                borderRadius: '8px',
                border: '1px solid #F3F4F6',
                overflow: 'hidden',
                backgroundColor: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {blog.mainImage && (
                  <img src={blog.mainImage} alt={blog.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF' }}>
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    <span style={{
                      fontWeight: 600,
                      color: blog.status === 'PUBLISHED' ? '#10B981' : '#F59E0B'
                    }}>{blog.status}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600, color: '#1F2937', lineClamp: 2 }}>{blog.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
