import React from 'react';

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

export default function AdminCard({ title, value, icon, subtitle }: AdminCardProps) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>{title}</span>
        <span style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#111827',
          fontFamily: 'var(--font-sans)',
        }}>{value}</span>
        {subtitle && (
          <span style={{
            fontSize: '0.75rem',
            color: '#10B981',
            fontWeight: 500,
          }}>{subtitle}</span>
        )}
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'var(--surface-sage)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--eucalyptus-green)',
      }}>
        {icon}
      </div>
    </div>
  );
}
