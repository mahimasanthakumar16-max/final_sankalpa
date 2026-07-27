import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <AdminSidebar />
      <div style={{
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <AdminNavbar />
        <main style={{
          marginTop: '70px',
          padding: '2rem',
          flex: 1,
          backgroundColor: '#F9FAFB',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
