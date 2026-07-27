"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--warm-cream)',
      padding: '2rem',
    }}>
      <div className="card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '3rem',
        boxShadow: 'var(--shadow-soft)',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.25rem',
            color: 'var(--eucalyptus-green)',
            marginBottom: '0.5rem',
          }}>Sankalpa</h1>
          <p style={{ fontSize: '0.95rem', color: '#6B7280' }}>
            Enter your credentials to access the secure admin portal.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FEE2E2',
            color: '#991B1B',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9CA3AF" style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
              }} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sankalpa.care"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="password" style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
              }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
              }} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              gap: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem' }}>
          <Link href="/" style={{
            fontSize: '0.875rem',
            color: 'var(--eucalyptus-green)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            ← Return to main website
          </Link>
        </div>
      </div>
    </div>
  );
}
