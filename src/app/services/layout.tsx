import type { Metadata } from 'next';
import BreadcrumbsSchema from '@/components/BreadcrumbsSchema';

export const metadata: Metadata = {
  title: "Therapeutic Services | Sankalpa Counseling",
  description: "Explore clinical counseling and psychotherapy services in Tamil Nadu, including individual therapy, couples counseling, trauma recovery, and adolescent support.",
  alternates: {
    canonical: '/services',
  }
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbsSchema items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" }
      ]} />
      {children}
    </>
  );
}
