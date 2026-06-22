"use client";

import { Laptop } from 'lucide-react';

export default function VirtualCounselingBanner() {
    return (
        <div className="container">
            <div className="virtual-counseling-banner">
                <div className="banner-content">
                    <div className="banner-icon">
                        <Laptop size={24} />
                    </div>
                    <div>
                        <p className="banner-text-primary">Virtual Counseling / Telehealth is currently being offered</p>
                        <p className="banner-text-secondary">In-Person Sessions will be available soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
