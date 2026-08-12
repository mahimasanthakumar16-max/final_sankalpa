"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarRange,
  CalendarDays, 
  MessageSquare, 
  Library, 
  HeartHandshake, 
  User, 
  LogOut 
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
  { name: 'Availability', path: '/admin/availability', icon: CalendarDays },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarRange },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Resources', path: '/admin/resources', icon: Library },
  { name: 'Testimonials', path: '/admin/testimonials', icon: HeartHandshake },
  { name: 'Profile', path: '/admin/profile', icon: User },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid #F3F4F6',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--eucalyptus-green)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>Sankalpa</h2>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#9CA3AF',
            fontWeight: 600,
          }}>Admin Dashboard</span>
        </Link>
      </div>

      <nav style={{
        flex: 1,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--eucalyptus-green)' : '#4B5563',
                backgroundColor: isActive ? 'var(--surface-sage)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.925rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{
        padding: '1rem',
        borderTop: '1px solid #F3F4F6',
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#DC2626',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: 500,
            fontSize: '0.925rem',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
