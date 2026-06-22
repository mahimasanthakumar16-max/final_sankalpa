"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
    settings?: {
        title?: string;
        logo?: string;
        navLinks?: { title: string; url: string; }[];
    }
}

export default function Navigation({ settings }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = settings?.navLinks || [
        { title: 'Home', url: '/' },
        { title: 'About', url: '/about' },
        { title: 'Services', url: '/services' },
        { title: 'Blog', url: '/blog' },
        { title: 'Fees', url: '/fees' },
        { title: 'FAQ', url: '/faq' },
    ];

    return (
        <header className="nav-header">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    <img src={settings?.logo || "/images/LOTO.png"} alt="Logo" className="logo" style={{ height: '80px', marginRight: '8px', verticalAlign: 'middle', mixBlendMode: 'multiply' }} />
                    {settings?.title || "Sankalpa Counseling"}
                </Link>

                <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link, i) => (
                        <Link key={i} href={link.url} className="nav-link" onClick={() => setIsOpen(false)}>
                            {link.title}
                        </Link>
                    ))}
                    <Link href="/booking" className="btn btn-primary" onClick={() => setIsOpen(false)}>Book Consultation</Link>
                </nav>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}

