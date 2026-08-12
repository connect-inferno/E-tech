import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Featured Projects',
  description: 'Discover our portfolio of bespoke elevator installations across luxury residential, commercial, and hospitality architectures.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
