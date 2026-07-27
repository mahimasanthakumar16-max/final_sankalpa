"use client";

import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function AdminNavbar() {
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          setAdminName(data.admin.name || 'Admin');
        }
      } catch (e) {
        // Silent error
      }
    }
    fetchMe();
  }, []);

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'fixed',
      top: 0,
      right: 0,
      left: '260px',
      zIndex: 9,
    }}>
      {/* Search Bar Placeholder */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        width: '300px',
        gap: '0.5rem',
      }}>
        <Search size={16} color="#6B7280" />
        <input
          type="text"
          placeholder="Global search..."
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontSize: '0.875rem',
            width: '100%',
            color: '#1F2937',
          }}
        />
      </div>

      {/* Right Navbar Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        {/* Notifications Icon */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          color: '#4B5563',
        }}>
          <Bell size={20} />
          {/* Notification Badge */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
          }}></span>
        </button>

        {/* User profile dropdown activator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderLeft: '1px solid #E5E7EB',
          paddingLeft: '1.5rem',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-sage)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--eucalyptus-green)',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}>
            {adminName[0].toUpperCase()}
          </div>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
          }}>{adminName}</span>
        </div>
      </div>
    </header>
  );
}
