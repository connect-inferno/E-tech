import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteContent } from "@/data/siteContent";
import { Lock, ShieldCheck, Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const info = siteContent.contact.info;

  return (
    <main className="min-h-screen bg-luxury-bg text-luxury-text-primary overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/5 bg-gradient-to-b from-luxury-card/60 via-luxury-bg to-luxury-bg">
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumbs />

          <div className="inline-flex items-center gap-2 px-3 py-1 border border-luxury-accent/30 bg-luxury-accent/10 rounded-sm text-xs font-mono uppercase tracking-widest text-luxury-accent mt-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Privacy</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-light tracking-tight text-white">
            Privacy Policy &amp; <span className="text-luxury-accent">Data Protection</span>
          </h1>

          <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
            Last Updated: August 2026 | Compliant with DPDP Act &amp; International Privacy Guidelines
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-10 text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
          
          <div className="space-y-3 bg-luxury-card/40 p-6 border border-white/5 rounded-sm">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-luxury-accent" />
              1. Our Commitment to Your Privacy
            </h2>
            <p>
              E-Tech Elevators &amp; Escalators ("E-Tech", "we", "us") is dedicated to protecting the privacy and security of customer, site owner, and visitor personal data. This privacy policy explains how we collect, process, store, and protect your information when using our website and communication channels.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white">
              2. Information We Collect
            </h2>
            <p>When you fill out an enquiry or breakdown form on our portal, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-luxury-text-secondary">
              <li>Contact Details: Customer Name, Company Name, Mobile Number, Email Address.</li>
              <li>Site Specifications: Site/Project Location, Building Type, Floor &amp; Stop Counts.</li>
              <li>Technical Requirements: Preferred Elevator Type, Capacity, Door Type, and Urgency.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white">
              3. How We Use Your Data
            </h2>
            <p>Your details are used exclusively for engineering &amp; operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-luxury-text-secondary">
              <li>Generating accurate site estimate quotations and engineering layouts.</li>
              <li>Dispatching 24/7 emergency breakdown technicians to your location.</li>
              <li>Fulfilling periodic Annual Maintenance Contract (AMC) service schedules.</li>
            </ul>
            <p className="pt-2 text-white font-medium">
              Zero Commercial Sharing: We strictly enforce zero third-party data sharing. We do not sell, lease, or rent customer details to external marketing vendors.
            </p>
          </div>

          {/* RIGHT TO DELETE SECTION */}
          <div className="space-y-4 bg-luxury-accent/5 p-6 border border-luxury-accent/30 rounded-sm">
            <h2 className="text-base md:text-lg font-heading font-semibold text-luxury-accent flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              4. Right to Erasure &amp; Data Deletion (GDPR / DPDP Compliance)
            </h2>
            <p className="text-white font-medium">
              You hold full rights under the Data Protection and Digital Personal Data Protection (DPDP) Act to request complete deletion of your records.
            </p>
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">How to Exercise Your Right to Delete:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Send an email with the subject <strong className="text-white">"Data Deletion Request"</strong> to{" "}
                  <a href={`mailto:${info.email}`} className="text-luxury-accent hover:underline font-mono">
                    {info.email}
                  </a>.
                </li>
                <li>Specify the full name, phone number, and location associated with your previous form submissions or AMC account.</li>
                <li>Our Data Security Desk will process your request within 5 working days and issue a formal deletion confirmation notice.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white">
              5. Contact Our Privacy Desk
            </h2>
            <p>For any privacy queries, regulatory questions, or compliance requests, reach out directly:</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={`mailto:${info.email}`}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-luxury-accent/40 rounded-sm text-xs font-mono text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-luxury-accent" />
                <span>{info.email}</span>
              </a>
              <a
                href={`tel:${info.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-luxury-accent/40 rounded-sm text-xs font-mono text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-luxury-accent" />
                <span>{info.phone}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
