import React from 'react';

export const metadata = {
  title: 'Sankalpa Counseling - Admin Panel',
  description: 'Secure admin portal',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root" style={{ fontFamily: 'var(--font-sans)', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {children}
    </div>
  );
}
