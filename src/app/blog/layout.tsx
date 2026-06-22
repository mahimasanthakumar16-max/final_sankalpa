import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Wellness Journal | Sankalpa Counseling",
    description: "Explore mental wellbeing resources, therapeutic reflections, and practical tools for healing and personal growth from Sankalpa Counseling.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
