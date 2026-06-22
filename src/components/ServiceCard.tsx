"use client";

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
    title: string;
    description: string;
    idealFor: string[];
    duration: string;
    icon: LucideIcon;
    subtitle?: string;
}

export default function ServiceCard({
    title,
    description,
    idealFor,
    duration,
    icon: Icon,
    subtitle
}: ServiceCardProps) {
    return (
        <article className="service-card-wrapper">
            <div className="service-card-copy">
                <div className="service-card-heading">
                    <span className="service-card-icon-pill">
                        <Icon size={18} />
                    </span>
                    <div>
                        <h3>{title}</h3>
                        {subtitle && <p className="service-card-subtitle">{subtitle}</p>}
                    </div>
                </div>

                <p className="service-description">{description}</p>

                <div className="service-pill-grid">
                    {idealFor.map((item, idx) => (
                        <span key={idx} className="service-pill">{item}</span>
                    ))}
                </div>

                <div className="service-card-meta">
                    <div>
                        <h4>Duration</h4>
                        <p>{duration}</p>
                    </div>
                    <Link href="/booking" className="btn btn-outline service-cta">
                        Book Consultation <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
}
