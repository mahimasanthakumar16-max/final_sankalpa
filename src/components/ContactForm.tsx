"use client";

import { Send } from 'lucide-react';

export default function ContactForm() {
    return (
        <div className="card" style={{ padding: '3rem' }}>
            <h2 className="mb-6">Send a Message</h2>
            <p className="mb-8" style={{ fontSize: '0.95rem' }}>Thank you for reaching out. I will get back to you within 48–72 business hours.</p>

            <form className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                    <input
                        id="name"
                        type="text"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none' }}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                    <input
                        id="email"
                        type="email"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none' }}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="service" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Interested Service</label>
                    <select
                        id="service"
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
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', outline: 'none', resize: 'vertical' }}
                        placeholder="How can we help you?"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                    Send Message <Send size={18} />
                </button>
            </form>
        </div>
    );
}
