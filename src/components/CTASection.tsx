"use client";

import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content">
                    <h2 className="cta-heading">Your Healing Journey Starts Here</h2>
                    <p className="cta-description">
                        Whether you are navigating anxiety, trauma, life transitions, relationship challenges, or simply seeking a safe space to grow, therapy can provide support that is tailored to your unique story.
                    </p>
                    <Link href="/booking" className="btn btn-primary btn-large">
                        Book a Consultation →
                    </Link>
                </div>
            </div>
        </section>
    );
}
