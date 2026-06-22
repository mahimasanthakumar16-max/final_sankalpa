import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact Us | Sankalpa Counseling",
    description: "Reach out to Sankalpa Counseling to schedule a consultation or learn more about our therapy services in Chennai, Tamil Nadu.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
