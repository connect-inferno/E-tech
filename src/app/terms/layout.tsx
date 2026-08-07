import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | E TECH ELEVATORS",
  description: "Terms of Service, technical quotations, site preparedness guidelines, and IS 14665 elevator compliance standards.",
  alternates: {
    canonical: "https://www.e-techelevators.com/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
