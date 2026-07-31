import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with E-Tech Elevators for elevator installation, AMC quotes, modernization, or 24/7 emergency breakdown support across Maharashtra. Call, WhatsApp, or use our enquiry form.",
  keywords: [
    "Contact E-Tech Elevators",
    "Elevator quote Pune",
    "Elevator AMC enquiry Maharashtra",
    "Emergency elevator repair contact",
    "Lift service enquiry Pune",
  ],
  openGraph: {
    title: "Contact E-Tech Elevators | Get a Quote or Emergency Support",
    description:
      "Reach E-Tech Elevators for installation, AMC, modernization or 24/7 emergency breakdown support across Maharashtra.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
