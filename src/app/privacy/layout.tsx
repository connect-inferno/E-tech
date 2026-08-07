import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security | E TECH ELEVATORS",
  description: "Privacy Policy, data security practices, and GDPR / DPDP Right to Delete procedures for E-Tech Elevators & Escalators.",
  alternates: {
    canonical: "https://www.e-techelevators.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
