"use client";

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [service, setService] = useState('Individual Therapy');
    const [message, setMessage] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, service, message, subject: `Inquiry: ${service}` }),
            });

            if (res.ok) {
                setSubmitted(true);
                setName('');
                setEmail('');
                setMessage('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to send message.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="card text-center" style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DEF7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03543F' }}>
                    <CheckCircle2 size={36} />
                </div>
                <div>
                    <h2 className="mb-2">Thank You!</h2>
                    <p style={{ fontSize: '1rem', color: '#4B5563', maxWidth: '350px', margin: '0 auto' }}>
                        Your message has been sent successfully. We will get back to you within 48–72 business hours.
                    </p>
                </div>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: '3rem' }}>
            <h2 className="mb-6">Send a Message</h2>
            <p className="mb-8" style={{ fontSize: '0.95rem', color: '#6B7280' }}>I will get back to you within 48–72 business hours.</p>

            {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <form className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none' }}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none' }}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label htmlFor="service" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Interested Service</label>
                    <select
                        id="service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none' }}
                    >
                        <option>Individual Therapy</option>
                        <option>Couples Therapy</option>
                        <option>Adolescent Counseling</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Your Message</label>
                    <textarea
                        id="message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none', resize: 'vertical' }}
                        placeholder="How can we help you?"
                    ></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending...' : 'Send Message'} {!loading && <Send size={18} />}
                </button>
            </form>
        </div>
    );
}
