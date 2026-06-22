"use client";

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ServiceInquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            alert('Thank you for your inquiry. We will respond within 24–48 business hours.');
            (e.target as HTMLFormElement).reset();
        }, 500);
    };

    return (
        <div className="service-inquiry-card">
            <form className="service-inquiry-form" onSubmit={handleSubmit}>
                <div className="inquiry-section">
                    <div className="inquiry-section-title">
                        <div className="inquiry-step-number">1</div>
                        <div>
                            <h3>Your Details</h3>
                        </div>
                    </div>

                    <div className="inquiry-grid">
                        <div className="form-group">
                            <label htmlFor="inquiry-full-name">Full Name *</label>
                            <input id="inquiry-full-name" type="text" placeholder="Your full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry-age">Age *</label>
                            <input id="inquiry-age" type="number" min={1} max={120} placeholder="e.g. 28" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry-mobile">Mobile Number *</label>
                            <input id="inquiry-mobile" type="tel" placeholder="Your mobile number" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry-email">Email Address *</label>
                            <input id="inquiry-email" type="email" placeholder="your@email.com" required />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="inquiry-city">City *</label>
                            <input id="inquiry-city" type="text" placeholder="e.g. Chennai" required />
                        </div>
                    </div>
                </div>

                <div className="inquiry-section">
                    <div className="inquiry-section-title">
                        <div className="inquiry-step-number">2</div>
                        <div>
                            <h3>Therapy Preferences</h3>
                        </div>
                    </div>

                    <div className="inquiry-grid">
                        <div className="form-group">
                            <label htmlFor="inquiry-service">Service Interested In *</label>
                            <select id="inquiry-service" required>
                                <option value="">Select a service</option>
                                <option>Individual Counseling</option>
                                <option>Couples Counseling</option>
                                <option>Trauma Counseling</option>
                                <option>Group Counseling (Coming Soon)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry-concern">Primary Concern *</label>
                            <select id="inquiry-concern" required>
                                <option value="">Select your primary concern</option>
                                <option>Anxiety</option>
                                <option>Depression</option>
                                <option>Trauma</option>
                                <option>Life Transitions</option>
                                <option>Identity Exploration</option>
                                <option>Relationship Challenges</option>
                                <option>Stress Management</option>
                                <option>Disordered Eating</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label>Preferred Contact Method *</label>
                            <div className="radio-group">
                                <label className="radio-button">
                                    <input type="radio" name="contact-method" value="whatsapp" required />
                                    <span>WhatsApp</span>
                                </label>
                                <label className="radio-button">
                                    <input type="radio" name="contact-method" value="phone" />
                                    <span>Phone Call</span>
                                </label>
                                <label className="radio-button">
                                    <input type="radio" name="contact-method" value="email" />
                                    <span>Email</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry-time">Preferred Time *</label>
                            <select id="inquiry-time" required>
                                <option value="">Select a time</option>
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                                <option>Flexible</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="inquiry-section inquiry-section-notes">
                    <div className="form-group full-width">
                        <label htmlFor="inquiry-notes">Anything else you&apos;d like me to know?</label>
                        <textarea
                            id="inquiry-notes"
                            rows={4}
                            placeholder="Share anything that feels important or helpful for me to know. No pressure to explain everything now."
                        />
                    </div>

                    <label className="inquiry-consent">
                        <input type="checkbox" required />
                        <span>
                            I understand this form is for inquiry purposes and does not establish a
                            therapeutic relationship until services begin.
                        </span>
                    </label>
                </div>

                <button type="submit" className="btn btn-primary btn-large inquiry-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'} <ArrowRight size={18} />
                </button>
            </form>
        </div>
    );
}
