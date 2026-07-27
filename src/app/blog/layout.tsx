import type { Metadata } from 'next';
import BreadcrumbsSchema from '@/components/BreadcrumbsSchema';

export const metadata: Metadata = {
    title: "Wellness Journal | Sankalpa Counseling",
    description: "Explore mental wellbeing resources, therapeutic reflections, and practical tools for healing and personal growth from Sankalpa Counseling.",
    alternates: {
        canonical: '/blog',
    }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BreadcrumbsSchema items={[
                { name: "Home", url: "/" },
                { name: "Blog", url: "/blog" }
            ]} />
            {children}
        </>
    );
}
