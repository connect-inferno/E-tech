"use client";

import React, { useState } from "react";
import {
  User,
  Building,
  List,
  Building2,
  Wrench,
  FileText,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { siteContent } from "@/data/siteContent";

// E-Tech's WhatsApp Business number — digits only.
const ETECH_WHATSAPP = siteContent.contact.info.whatsapp.replace(/[^\d]/g, "");

// Google Apps Script webhook
const SHEETS_WEBHOOK = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || "";

const pushToSheets = (payload: Record<string, string>) => {
  if (!SHEETS_WEBHOOK) return Promise.resolve();
  return fetch(SHEETS_WEBHOOK, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
};

// Input validation helpers
const sanitizePositiveInteger = (val: string, maxLen?: number) => {
  const digits = val.replace(/[^\d]/g, "");
  if (maxLen) return digits.slice(0, maxLen);
  return digits;
};

const sanitizePositiveNonZeroInteger = (val: string, maxLen?: number) => {
  let digits = val.replace(/[^\d]/g, "");
  digits = digits.replace(/^0+/, "");
  if (maxLen) return digits.slice(0, maxLen);
  return digits;
};

const sanitizeTextInput = (val: string): string => {
  if (!val) return "";
  return val
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
};

const validateEmail = (emailStr: string): boolean => {
  if (!emailStr) return true;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(emailStr.trim());
};

const blockNonDigitKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "+", "e", "E", "."].includes(e.key)) {
    e.preventDefault();
  }
};

const COUNTRY_CODES = [
  { code: "+91", label: "+91 (IN)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+966", label: "+966 (SA)" },
  { code: "+1", label: "+1 (US/CA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+974", label: "+974 (QA)" },
  { code: "+968", label: "+968 (OM)" },
  { code: "+965", label: "+965 (KW)" },
  { code: "+65", label: "+65 (SG)" },
  { code: "+61", label: "+61 (AU)" },
  { code: "+49", label: "+49 (DE)" },
];

type EnqType = "new" | "mod" | "amc" | "";

export default function CrmForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Bot protection & rate limit
  const [b_hp_website, setB_hp_website] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Form Fields
  const [cname, setCname] = useState("");
  const [coname, setConame] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pname, setPname] = useState("");
  const [ploc, setPloc] = useState("");
  const [btype, setBtype] = useState("");
  const [bstatus, setBstatus] = useState("");
  const [floors, setFloors] = useState("");
  const [stops, setStops] = useState("");
  const [enqType, setEnqType] = useState<EnqType>("new");
  const [notes, setNotes] = useState("");

  // Result state
  const [reportRef, setReportRef] = useState("");
  const [reportDate, setReportDate] = useState("");

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => {
      setErrorMsg((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot protection
    if (b_hp_website.trim()) {
      return;
    }

    // Submission throttling
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      triggerError("Please wait a moment before resubmitting.");
      return;
    }
    setLastSubmitTime(now);

    const cleanCname = sanitizeTextInput(cname);
    const cleanConame = sanitizeTextInput(coname);
    const cleanEmail = sanitizeTextInput(email);
    const cleanPname = sanitizeTextInput(pname);
    const cleanPloc = sanitizeTextInput(ploc);
    const cleanNotes = sanitizeTextInput(notes);

    setCname(cleanCname);
    setConame(cleanConame);
    setEmail(cleanEmail);
    setPname(cleanPname);
    setPloc(cleanPloc);
    setNotes(cleanNotes);

    if (!cleanCname || cleanCname.length < 2) {
      triggerError("Please enter a valid Customer / Contact Name (at least 2 characters)");
      return;
    }
    if (!mobile.trim() || mobile.trim().length !== 10) {
      triggerError("Mobile number must be exactly 10 digits");
      return;
    }
    if (cleanEmail && !validateEmail(cleanEmail)) {
      triggerError("Please enter a valid email address (e.g. name@domain.com)");
      return;
    }
    if (!cleanPloc || cleanPloc.length < 2) {
      triggerError("Please enter a valid Project Site / City Location");
      return;
    }
    if (!btype) {
      triggerError("Please select a building type");
      return;
    }
    if (!bstatus) {
      triggerError("Please select building status");
      return;
    }
    if (!enqType) {
      triggerError("Please select an enquiry category");
      return;
    }
    if (!privacyAgreed) {
      triggerError("Please accept the Privacy Policy & Terms to submit your details");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const submissionDate = new Date();
    const formattedDate = submissionDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const refNum = `ETE-${submissionDate.getFullYear()}${String(submissionDate.getMonth() + 1).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setReportRef(refNum);
    setReportDate(formattedDate);

    const typeLabels: Record<string, string> = {
      new: "New Installation",
      mod: "Modernization",
      amc: "AMC Enquiry",
    };
    const typeLabel = enqType ? typeLabels[enqType] || "General Enquiry" : "General Enquiry";

    try {
      await pushToSheets({
        date: formattedDate,
        refId: refNum,
        customerName: cleanCname,
        company: cleanConame,
        mobile: `${countryCode} ${mobile}`,
        email: cleanEmail,
        projectName: cleanPname,
        location: cleanPloc,
        buildingType: btype,
        buildingStatus: bstatus,
        floors: floors || "—",
        stops: stops || floors || "—",
        enquiryType: typeLabel,
        notes: cleanNotes || "—",
        status: "New",
      });
      setIsSubmitted(true);
    } catch {
      triggerError("Could not submit your details at this time. Please contact us directly via phone or WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setErrorMsg(null);
    setPrivacyAgreed(false);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setCname("");
    setConame("");
    setMobile("");
    setEmail("");
    setPname("");
    setPloc("");
    setBtype("");
    setBstatus("");
    setFloors("");
    setStops("");
    setEnqType("new");
    setNotes("");
    setReportRef("");
    setReportDate("");
  };

  const handleSendWhatsApp = () => {
    const typeLabels: Record<string, string> = {
      new: "New Installation",
      mod: "Modernization",
      amc: "AMC Enquiry",
    };
    const typeLabel = enqType ? typeLabels[enqType] || "General Enquiry" : "General Enquiry";

    let msg = `*E-TECH ELEVATORS & ESCALATORS*\n`;
    msg += `Engineering Technology | Safety First\n`;
    msg += `━━━━━━━✦━━━━━━━\n`;
    msg += `*Lead Ref:* ${reportRef}\n`;
    msg += `*Date:* ${reportDate}\n`;
    msg += `*Requirement:* ${typeLabel}\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `• Name: ${cname}\n`;
    if (coname) msg += `• Company: ${coname}\n`;
    msg += `• Mobile: ${countryCode} ${mobile}\n`;
    if (email) msg += `• Email: ${email}\n`;
    msg += `• Location: ${ploc}\n`;
    if (pname) msg += `• Project: ${pname}\n`;
    msg += `• Building: ${btype} (${bstatus})\n`;
    if (floors) msg += `• Floors/Stops: ${floors} Floors / ${stops || floors} Stops\n`;
    if (notes) msg += `• Notes: ${notes}\n`;
    msg += `\n━━━━━━━✦━━━━━━━\n`;
    msg += `I have submitted my details online. Please provide technical specifications & quote.`;

    const waUrl = `https://api.whatsapp.com/send?phone=${ETECH_WHATSAPP}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      id="crm-form-container"
      className="bg-luxury-card border border-white/5 rounded-sm p-6 md:p-8 shadow-2xl relative transition-all duration-500 overflow-hidden"
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/5 pb-6 mb-6 relative z-10">
        <div className="bg-white/95 rounded-sm flex items-center justify-center shadow-lg w-20 h-16 shrink-0 p-1.5">
          <img
            src="/images/etech_logo.png"
            alt="E-Tech Elevators"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="text-center sm:text-left flex-1 space-y-1">
          <div className="text-lg font-heading font-light tracking-wider text-luxury-text-primary">
            E-TECH DETAILS PORTAL
          </div>
          <div className="text-[9px] text-luxury-accent uppercase tracking-[0.25em] font-medium">
            ✦ LIFT WITH FUTURE ✦ SAFETY FIRST ✦
          </div>
        </div>
      </div>

      {/* Inline Toast Alert Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-sm border border-red-500/40 bg-red-950/60 backdrop-blur-md flex items-center justify-between gap-3 text-red-200 text-xs font-medium shadow-[0_0_20px_rgba(239,68,68,0.25)] relative z-20 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN FORM: DETAILS ONLY */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Honeypot for bot protection */}
          <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="b_hp_website">Do not fill this field</label>
            <input
              type="text"
              id="b_hp_website"
              name="b_hp_website"
              tabIndex={-1}
              autoComplete="new-password"
              value={b_hp_website}
              onChange={(e) => setB_hp_website(e.target.value)}
            />
          </div>

          {/* Section 1: Customer Information */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2">
            <User className="w-4 h-4" /> Customer Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Company / Firm
              </label>
              <input
                type="text"
                placeholder="Firm / Company Name"
                value={coname}
                onChange={(e) => setConame(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Mobile Number * (10 Digits)
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 sm:w-28 bg-black/40 border border-white/5 rounded-sm px-2 py-3 text-xs text-luxury-accent font-semibold focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all shrink-0 cursor-pointer text-center"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0c0c0e] text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onKeyDown={blockNonDigitKeys}
                  onChange={(e) => setMobile(sanitizePositiveInteger(e.target.value, 10))}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Building / Project Name"
                value={pname}
                onChange={(e) => setPname(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="City, State"
                value={ploc}
                onChange={(e) => setPloc(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
          </div>

          {/* Section 2: Building Details */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2 pt-2">
            <Building className="w-4 h-4" /> Building Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Building Type *
              </label>
              <select
                value={btype}
                required
                onChange={(e) => setBtype(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0c0c0e]">Select Type</option>
                <option value="Residential" className="bg-[#0c0c0e]">Residential</option>
                <option value="Commercial" className="bg-[#0c0c0e]">Commercial</option>
                <option value="Hospital" className="bg-[#0c0c0e]">Hospital</option>
                <option value="Hotel" className="bg-[#0c0c0e]">Hotel</option>
                <option value="Industrial" className="bg-[#0c0c0e]">Industrial</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Building Status *
              </label>
              <select
                value={bstatus}
                required
                onChange={(e) => setBstatus(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0c0c0e]">Select Status</option>
                <option value="Under Construction" className="bg-[#0c0c0e]">Under Construction</option>
                <option value="Existing Building" className="bg-[#0c0c0e]">Existing Building</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                No. of Floors (Min: 1)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={floors}
                onKeyDown={blockNonDigitKeys}
                onChange={(e) => setFloors(sanitizePositiveNonZeroInteger(e.target.value))}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                No. of Stops (Min: 1)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={stops}
                onKeyDown={blockNonDigitKeys}
                onChange={(e) => setStops(sanitizePositiveNonZeroInteger(e.target.value))}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              />
            </div>
          </div>

          {/* Section 3: Enquiry Category Selector */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2 pt-2">
            <List className="w-4 h-4" /> Requirement Category *
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "new", label: "New Installation", icon: Building2, desc: "Plan & install brand new elevator systems" },
              { id: "mod", label: "Modernization", icon: Wrench, desc: "Aesthetic upgrades & controller overhaul" },
              { id: "amc", label: "AMC Contract", icon: FileText, desc: "Long-term certified service agreements" },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = enqType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEnqType(item.id as EnqType)}
                  className={`p-4 border rounded-sm text-left transition-all duration-300 group flex flex-col justify-between min-h-[110px] relative overflow-hidden focus:outline-none cursor-pointer ${
                    isSelected
                      ? "border-luxury-accent bg-luxury-accent/10 text-luxury-text-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                      : "border-white/10 hover:border-luxury-accent/40 bg-black/30 hover:bg-luxury-card-hover text-luxury-text-secondary hover:text-luxury-text-primary"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`p-2 rounded-sm border shrink-0 transition-colors duration-300 ${
                        isSelected
                          ? "bg-luxury-accent text-black border-luxury-accent"
                          : "bg-white/5 border-white/10 text-luxury-text-secondary group-hover:text-luxury-accent group-hover:border-luxury-accent/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-luxury-accent font-semibold bg-luxury-accent/15 px-2 py-0.5 rounded-sm border border-luxury-accent/30">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs uppercase tracking-wider font-semibold block text-luxury-text-primary group-hover:text-luxury-accent transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-light leading-relaxed block text-luxury-text-secondary">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
              Additional Requirements / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Specify any custom load capacity, architectural finishes, or scheduling targets..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all resize-none"
            />
          </div>

          {/* Privacy Policy Agreement */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-luxury-text-secondary select-none">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="w-4 h-4 rounded-xs border-white/20 bg-black/40 text-luxury-accent focus:ring-luxury-accent focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
              />
              <span className="leading-snug text-[11px]">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="text-luxury-accent hover:underline font-semibold cursor-pointer underline-offset-2"
                >
                  Privacy Policy &amp; Terms
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 rounded-sm ${
                isSubmitting
                  ? "bg-white/5 border border-white/10 text-luxury-text-secondary cursor-wait"
                  : "luxury-btn cursor-pointer shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Details...
                </>
              ) : (
                <>
                  Submit Details <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* SUCCESS CONFIRMATION STATE */
        <div className="space-y-6 relative z-10 animate-fadeIn">
          <div className="p-6 rounded-sm border border-emerald-500/30 bg-emerald-950/20 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase">
                  Details Submitted Successfully!
                </h3>
                <p className="text-xs text-emerald-300/80 font-light mt-0.5">
                  Reference ID: <span className="font-mono font-bold text-white">{reportRef}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
              Thank you, <strong className="text-luxury-text-primary font-medium">{cname}</strong>. Our engineering desk has received your project details for <span className="text-luxury-text-primary">{ploc}</span> and will review the specifications to contact you shortly.
            </p>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary block">Contact</span>
                <span className="text-luxury-text-primary font-medium">{countryCode} {mobile}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary block">Building</span>
                <span className="text-luxury-text-primary font-medium">{btype}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary block">Status</span>
                <span className="text-luxury-text-primary font-medium">{bstatus}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary block">Floors</span>
                <span className="text-luxury-text-primary font-medium">{floors || "—"} Floors</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 luxury-btn py-3.5 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Connect on WhatsApp
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-white/10 hover:bg-white/5 transition-all py-3.5 text-xs uppercase tracking-widest rounded-sm text-luxury-text-primary flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-luxury-accent" /> Submit Another Request
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy & Terms Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e0e12] border border-white/10 rounded-sm max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-10">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-luxury-accent" />
                <h3 className="text-sm font-heading font-semibold uppercase tracking-widest text-luxury-text-primary">
                  Privacy Policy &amp; Terms
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 text-luxury-text-secondary hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-luxury-text-secondary font-light leading-relaxed">
              <p className="text-luxury-text-primary font-medium">
                E-Tech Elevators &amp; Escalators ("E-Tech") Commitment to Client Privacy &amp; Service Terms.
              </p>
              <div className="space-y-2 pt-2">
                <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">1. Information Usage</h4>
                <p>When you submit your details, your contact information (Name, Mobile, Location, Building Specifications) is used strictly by E-Tech's engineering desk to generate technical quotes and schedule site surveys.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">2. Zero 3rd Party Sharing</h4>
                <p>Your details are never sold, rented, or shared with outside telemarketers or third-party vendors.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">3. Technical Estimates Disclaimer</h4>
                <p>All preliminary calculations or budget estimates are subject to physical hoistway audit and structural verification by certified E-Tech engineers.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">4. IS 14665 Safety Compliance</h4>
                <p>All installations and maintenance work comply with Bureau of Indian Standards IS 14665 and Maharashtra Lift Rules.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
              <span className="text-[10px] text-luxury-text-secondary">E-Tech Elevators • Safety First</span>
              <button
                type="button"
                onClick={() => {
                  setPrivacyAgreed(true);
                  setPrivacyModalOpen(false);
                }}
                className="luxury-btn px-6 py-2.5 text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                I Agree &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
