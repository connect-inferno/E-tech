import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Services',
  description: 'Premium elevator maintenance, installation, modernization, and 24/7 emergency repair services by certified European engineers.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
