import type { Metadata } from 'next';
import BreadcrumbsSchema from '@/components/BreadcrumbsSchema';

export const metadata: Metadata = {
  title: "Book a Consultation | Sankalpa Counseling",
  description: "Schedule a complimentary 15-minute introductory virtual consultation with Mahima to discuss your therapy goals and fit.",
  alternates: {
    canonical: '/booking',
  }
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbsSchema items={[
        { name: "Home", url: "/" },
        { name: "Booking", url: "/booking" }
      ]} />
      {children}
    </>
  );
}
