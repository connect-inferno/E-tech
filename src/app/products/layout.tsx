import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products Portfolio',
  description: 'Explore our comprehensive range of luxury elevator systems including passenger, capsule, glass, home, and commercial elevators.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
