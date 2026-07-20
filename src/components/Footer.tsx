"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FooterProps {
    settings?: {
        title?: string;
        description?: string;
        footerText?: string;
        socialLinks?: { platform: string; url: string; }[];
    }
}

export default function Footer({ settings }: FooterProps) {
  const [year, setYear] = useState<string | number>(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="footer">
            <div className="container grid grid-cols-4">
                <div>
                    <h3>{settings?.title || "Sankalpa Counseling"}</h3>
                    <p className="mb-4">{settings?.description || "Cultivating emotional wellness and therapeutic healing in a safe, warm environment."}</p>
                    <address style={{ fontStyle: 'normal' }}>
                        <p>Virtual Counseling Available Across India<br />Providing secure online counseling sessions for clients throughout India.</p>
                    </address>
                </div>

                <div>
                    <h3>Services</h3>
                    <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/services#individual">Individual Therapy</Link>
                        <Link href="/services#couples">Couples Therapy</Link>
                        <Link href="/services#adolescent">Adolescent Counseling</Link>
                        <Link href="/services#trauma">Trauma Recovery</Link>
                    </div>
                </div>

                <div>
                    <h3>Quick Links</h3>
                    <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/about">About the Therapist</Link>
                        <Link href="/blog">Wellness Journal</Link>
                        <Link href="/fees">Fees & Financials</Link>
                        <Link href="/faq">FAQ</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>
                </div>

                <div>
                    <h3>Connect</h3>
                    <p className="mb-4">Follow us for mental wellness insights and updates.</p>
                    <div className="flex gap-4" style={{ alignItems: 'center' }}>
                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/sankalpacounseling/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="social-icon-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <circle cx="12" cy="12" r="4"/>
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/company/sankalpa-counseling/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="social-icon-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/message/CFABZDBLQVSIE1"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="social-icon-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.487a.5.5 0 0 0 .608.625l5.805-1.525A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.4l-.371-.22-3.844 1.01 1.03-3.727-.242-.385A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="container footer-bottom">
                <p>&copy; {year} {settings?.footerText || "Sankalpa Counseling. All rights reserved."} | <Link href="/privacy">Privacy Policy</Link> | <Link href="/accessibility">Accessibility</Link></p>
            </div>
        </footer>
    );
}

