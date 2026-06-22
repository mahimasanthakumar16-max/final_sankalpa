"use client";

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function GroupCounselingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            alert('Thank you for your interest! We will be in touch soon.');
            (e.target as HTMLFormElement).reset();
        }, 500);
    };

    return (
        <div className="group-counseling-form-wrapper">
            <div className="group-form-header">
                <h3>Stay informed as this offering becomes available.</h3>
                <p>Let us know what topics and support you would like to see.</p>
            </div>

            <form className="group-counseling-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="full-name">Full Name</label>
                        <input id="full-name" type="text" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="topics">What topics would you like to see?</label>
                    <textarea id="topics" placeholder="e.g., anxiety, relationships, grief, self-esteem..." rows={2} />
                </div>

                <div className="form-group">
                    <label htmlFor="support">What support are you looking for?</label>
                    <textarea id="support" placeholder="Tell us about your needs..." rows={2} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Interest'} <ArrowRight size={18} />
                </button>
            </form>
        </div>
    );
}
