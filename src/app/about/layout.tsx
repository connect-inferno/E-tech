import { Metadata } from 'next';
import { siteContent } from '@/data/siteContent';

export const metadata: Metadata = {
  title: 'About Us',
  description: siteContent.about.storyParagraph1,
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
