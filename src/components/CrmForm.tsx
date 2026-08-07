"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Building,
  List,
  Building2,
  Wrench,
  Settings,
  AlertTriangle,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  MessageCircle,

  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Clock,
  Briefcase,
  X
} from "lucide-react";
import { siteContent } from "@/data/siteContent";

// E-Tech's WhatsApp Business number — digits only, no leading + or spaces.
// Every lead submission is sent HERE, not to the customer's own number.
const ETECH_WHATSAPP = siteContent.contact.info.whatsapp.replace(/[^\d]/g, "");


// Input validation helpers — restricts input to positive digits (0-9) only, blocking negative signs and letters
const sanitizePositiveInteger = (val: string, maxLen?: number) => {
  const digits = val.replace(/[^\d]/g, "");
  if (maxLen) return digits.slice(0, maxLen);
  return digits;
};

// Strips leading zeros so values like 0 or 00 cannot be entered
const sanitizePositiveNonZeroInteger = (val: string, maxLen?: number) => {
  let digits = val.replace(/[^\d]/g, "");
  digits = digits.replace(/^0+/, "");
  if (maxLen) return digits.slice(0, maxLen);
  return digits;
};

// Input sanitization helper — strips dangerous HTML/script tags, control characters, and excess whitespace
const sanitizeTextInput = (val: string): string => {
  if (!val) return "";
  return val
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
};

// RFC-compliant basic email format validator
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

type EnqType = "new" | "mod" | "svc" | "brk" | "amc" | "";

export default function CrmForm() {
  const [step, setStep] = useState<number>(0);
  const [enqType, setEnqType] = useState<EnqType>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => {
      setErrorMsg((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Bot protection & submission rate limit state
  const [b_hp_email, setB_hp_email] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Step 0 states
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

  // Step 1 states (Enquiry-specific fields)
  // New Installation
  const [liftType, setLiftType] = useState("");
  const [otherLiftType, setOtherLiftType] = useState("");
  const [capPer, setCapPer] = useState("");
  const [capKg, setCapKg] = useState("");
  const [doorType, setDoorType] = useState("");
  const [mr, setMr] = useState("");
  const [power, setPower] = useState("");
  const [shaft, setShaft] = useState("");
  const [oh, setOh] = useState("");
  const [finish, setFinish] = useState("");
  const [compDate, setCompDate] = useState("");
  const [budget, setBudget] = useState("");

  // Modernization
  const [mBrand, setMBrand] = useState("");
  const [mAge, setMAge] = useState("");
  const [mCap, setMCap] = useState("");
  const [mBudget, setMBudget] = useState("");
  const [mReason, setMReason] = useState("");
  const [mDate, setMDate] = useState("");
  const [mProbs, setMProbs] = useState("");
  const [mScope, setMScope] = useState<string[]>([]);

  // Service
  const [sBrand, setSBrand] = useState("");
  const [sCap, setSCap] = useState("");
  const [sAmc, setSAmc] = useState("");
  const [sLastDate, setSLastDate] = useState("");
  const [sUrgency, setSUrgency] = useState("");
  const [sComp, setSComp] = useState<string[]>([]);
  const [sDesc, setSDesc] = useState("");

  // Breakdown
  const [bBrand, setBBrand] = useState("");
  const [bBuilding, setBBuilding] = useState("");
  const [bLiftNo, setBLiftNo] = useState("");
  const [bErr, setBErr] = useState("");
  const [bTrapped, setBTrapped] = useState("");
  const [bPower, setBPower] = useState("");
  const [bContact, setBContact] = useState("");
  const [bContactNo, setBContactNo] = useState("");
  const [bDesc, setBDesc] = useState("");

  // AMC
  const [aCount, setACount] = useState("");
  const [aBrand, setABrand] = useState("");
  const [aAge, setAAge] = useState("");
  const [aProvider, setAProvider] = useState("");
  const [aFreq, setAFreq] = useState("");

  // Report generation state
  const [reportRef, setReportRef] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [waMessage, setWaMessage] = useState("");

  // Scroll to the form top when the user advances a step — but NOT on mount.
  // This component renders inside the homepage's contact section, so scrolling
  // on the initial effect run would drag the visitor down past the entire hero
  // the moment the page loads.
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    document
      .getElementById("crm-form-container")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const handleNextStep0 = () => {
    // Bot protection: If invisible honeypot field is populated, abort silently
    if (b_hp_email.trim()) {
      return;
    }

    // Submission throttling: Prevent rapid multi-clicking submissions within 3 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      triggerError("Please wait a moment before advancing");
      return;
    }
    setLastSubmitTime(now);

    const cleanCname = sanitizeTextInput(cname);
    const cleanConame = sanitizeTextInput(coname);
    const cleanEmail = sanitizeTextInput(email);
    const cleanPname = sanitizeTextInput(pname);
    const cleanPloc = sanitizeTextInput(ploc);

    setCname(cleanCname);
    setConame(cleanConame);
    setEmail(cleanEmail);
    setPname(cleanPname);
    setPloc(cleanPloc);

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
    if (!btype || !bstatus) {
      triggerError("Please select building type and status");
      return;
    }
    if (floors && parseInt(floors, 10) < 1) {
      triggerError("Number of floors must be at least 1");
      return;
    }
    if (stops && parseInt(stops, 10) < 1) {
      triggerError("Number of stops must be at least 1");
      return;
    }
    if (!enqType) {
      triggerError("Please select an enquiry category");
      return;
    }
    if (!privacyAgreed) {
      triggerError("Please accept the Privacy Policy & Terms to proceed");
      return;
    }
    setErrorMsg(null);
    setStep(1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(step - 1);
  };

  const toggleMScope = (val: string) => {
    if (mScope.includes(val)) {
      setMScope(mScope.filter((x) => x !== val));
    } else {
      setMScope([...mScope, val]);
    }
  };

  const toggleSComp = (val: string) => {
    if (sComp.includes(val)) {
      setSComp(sComp.filter((x) => x !== val));
    } else {
      setSComp([...sComp, val]);
    }
  };

  const generateReport = () => {
    // Validate Step 1 based on Enquiry Type
    if (enqType === "new" && !liftType) {
      triggerError("Please select elevator type");
      return;
    }
    if (enqType === "new" && liftType === "Other" && !otherLiftType.trim()) {
      triggerError("Please specify custom elevator / transport type");
      return;
    }
    if (enqType === "svc" && !sUrgency) {
      triggerError("Please select urgency level");
      return;
    }
    setErrorMsg(null);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const refNum = `ETE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setReportRef(refNum);
    setReportDate(formattedDate);

    // Build active lift type string
    const activeLiftType = liftType === "Other" ? (otherLiftType.trim() ? `Other (${otherLiftType.trim()})` : "Other") : liftType;

    // Build WhatsApp message
    const typeLabels = {
      new: "New Installation",
      mod: "Modernization",
      svc: "Service & Maintenance",
      brk: "Breakdown Call",
      amc: "AMC Enquiry",
    };
    const typeLabel = enqType ? typeLabels[enqType as Exclude<EnqType, "">] : "Enquiry";

    let msg = `*E-TECH ELEVATORS & ESCALATORS*\n`;
    msg += `Engineering Technology | Safety First\n`;
    msg += `━━━━━━━✦━━━━━━━\n`;
    msg += `*Lead Ref:* ${refNum}\n`;
    msg += `*Date:* ${formattedDate}\n`;
    msg += `*Enquiry Type:* ${typeLabel}\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `• Name: ${cname}\n`;
    if (coname) msg += `• Company: ${coname}\n`;
    msg += `• Mobile: ${countryCode} ${mobile}\n`;
    msg += `• Location: ${ploc}\n`;
    msg += `• Building: ${btype} | ${bstatus}\n`;
    if (floors) msg += `• Floors/Stops: ${floors} Floors / ${stops || floors} Stops\n\n`;

    if (enqType === "new") {
      msg += `*Requested Spec:*\n`;
      msg += `• Elevator: ${activeLiftType}\n`;
      if (capKg) msg += `• Capacity: ${capKg} kg (${capPer || "—"} persons)\n`;
      if (doorType) msg += `• Door: ${doorType}\n`;
      if (mr) msg += `• Machine Room: ${mr}\n`;
      if (budget) msg += `• Budget Range: ${budget}\n`;
    } else if (enqType === "mod") {
      msg += `*Modernization Details:*\n`;
      if (mBrand) msg += `• Existing Brand: ${mBrand}\n`;
      if (mAge) msg += `• Age: ${mAge} years\n`;
      if (mReason) msg += `• Upgrade Reason: ${mReason}\n`;
      if (mScope.length > 0) msg += `• Selected Scope: ${mScope.join(", ")}\n`;
    } else if (enqType === "svc") {
      msg += `*Service & Complaints:*\n`;
      msg += `• Urgency: ${sUrgency}\n`;
      if (sBrand) msg += `• Lift Brand: ${sBrand}\n`;
      if (sComp.length > 0) msg += `• Complaints: ${sComp.join(", ")}\n`;
    } else if (enqType === "brk") {
      msg += `⚠️ *BREAKDOWN BRIEF* ⚠️\n`;
      msg += `• Passengers Trapped: ${bTrapped}\n`;
      if (bBuilding) msg += `• Site/Building: ${bBuilding}\n`;
      if (bLiftNo) msg += `• Lift ID: ${bLiftNo}\n`;
      if (bErr) msg += `• Error Code: ${bErr}\n`;
      if (bContact) msg += `• Site Contact: ${bContact} (${bContactNo || "—"})\n`;
    } else if (enqType === "amc") {
      msg += `*AMC Requirement:*\n`;
      msg += `• Total Lifts: ${aCount || 1}\n`;
      if (aBrand) msg += `• Brand: ${aBrand}\n`;
      if (aFreq) msg += `• Service Freq: ${aFreq}\n`;
    }

    msg += `\n━━━━━━━✦━━━━━━━\n`;
    msg += `*Safety First — Lift with Future!*\n`;
    msg += `Our technical desk is processing this. We will get in touch with you shortly.`;

    setWaMessage(msg);
    setStep(2);
  };

  const resetForm = () => {
    setStep(0);
    setEnqType("");
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
    setLiftType("");
    setOtherLiftType("");
    setCapPer("");
    setCapKg("");
    setDoorType("");
    setMr("");
    setPower("");
    setShaft("");
    setOh("");
    setFinish("");
    setCompDate("");
    setBudget("");
    setMBrand("");
    setMAge("");
    setMCap("");
    setMBudget("");
    setMReason("");
    setMDate("");
    setMProbs("");
    setMScope([]);
    setSBrand("");
    setSCap("");
    setSAmc("");
    setSLastDate("");
    setSUrgency("");
    setSComp([]);
    setSDesc("");
    setBBrand("");
    setBBuilding("");
    setBLiftNo("");
    setBErr("");
    setBTrapped("");
    setBPower("");
    setBContact("");
    setBContactNo("");
    setBDesc("");
    setACount("");
    setABrand("");
    setAAge("");
    setAProvider("");
    setAFreq("");
  };

  const handleSendWhatsApp = () => {
    // Send to E-Tech's WhatsApp Business number so leads land in the team's
    // inbox. Customer's own `mobile` is already inside the message body.
    const waUrl = `https://api.whatsapp.com/send?phone=${ETECH_WHATSAPP}&text=${encodeURIComponent(
      waMessage
    )}`;
    window.open(waUrl, "_blank");
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print PDF reports.");
      return;
    }

    const docTypeLabels = {
      new: "NEW INSTALLATION PROJECT REPORT",
      mod: "SYSTEM MODERNIZATION AUDIT REPORT",
      svc: "MAINTENANCE & COMPLAINT TICKET REPORT",
      brk: "EMERGENCY BREAKDOWN DISPATCH TICKET",
      amc: "ANNUAL MAINTENANCE CONTRACT PROPOSAL STATUS",
    };
    const reportTitle = enqType ? docTypeLabels[enqType as Exclude<EnqType, "">] : "CUSTOMER CRM REPORT";

    // Build values arrays for printable table
    const leadDetails = [
      ["Lead Reference Number", reportRef],
      ["Log Date / Timestamp", reportDate],
      ["Customer Full Name", cname],
      ["Firm / Company Name", coname || "—"],
      ["Mobile Contact Number", mobile],
      ["Email Address", email || "—"],
      ["Project Name", pname || "—"],
      ["City / State Location", ploc],
      ["Structure Type", btype],
      ["Construction Status", bstatus],
      ["Total Floors / Stops", `${floors || "—"} Floors / ${stops || floors || "—"} Stops`],
    ];

    let specificDetails: string[][] = [];
    if (enqType === "new") {
      const spd = parseInt(floors || "1") <= 5 ? "0.5–1.0 m/s" : parseInt(floors || "1") <= 10 ? "1.0–1.6 m/s" : "1.6–2.5 m/s";
      const rc = liftType === "Hospital Lift" || liftType === "Stretcher Lift" ? "1000–1600 kg" : liftType === "Goods Lift" ? "1000–3000 kg" : liftType === "Home Lift" ? "250–400 kg" : "630–1000 kg";
      specificDetails = [
        ["Requested Elevator Type", liftType],
        ["Nominal Capacity", capKg ? `${capKg} kg (${capPer || "—"} Pax)` : rc],
        ["Engineering Speed Suggestion", spd],
        ["Door Configuration", doorType || "Automatic Sliding"],
        ["Machine Room Structure", mr || "MRL (Not Required)"],
        ["Power Feeder Line", power || "415V/50Hz 3-Phase"],
        ["Concrete Shaft Prepared", shaft || "No — Civil construction required"],
        ["Overhead Shaft Height", oh ? `${oh} mm` : "Min. 4200 mm"],
        ["Cabin Interior Finish", finish || "Premium Hairline Stainless Steel"],
        ["Target Completion Month", compDate || "TBD"],
        ["Estimated Budget Allocated", budget || "To Be Quoted"],
      ];
    } else if (enqType === "mod") {
      specificDetails = [
        ["Existing Brand Setup", mBrand || "—"],
        ["Equipment Service Age", mAge ? `${mAge} Years` : "—"],
        ["Load Capacity (kg)", mCap ? `${mCap} kg` : "—"],
        ["Budget Budget Allocated", mBudget || "TBD"],
        ["Key Modernization Reason", mReason || "Aesthetic / Safety Concerns"],
        ["Requested Switchover Target", mDate || "TBD"],
        ["Modernization Target Scope", mScope.join(", ") || "Full Control Replacement"],
        ["Reported Defect Checklist", mProbs || "None"],
      ];
    } else if (enqType === "svc") {
      specificDetails = [
        ["Elevator Brand Name", sBrand || "—"],
        ["Cab Capacity Rating", sCap ? `${sCap} kg` : "—"],
        ["Existing AMC Contract Status", sAmc || "No"],
        ["Date of Last Preventive Visit", sLastDate || "None Recorded"],
        ["Dispatch Urgency Priority", sUrgency],
        ["Complaint Types Selected", sComp.join(", ") || "General Servicing"],
        ["Symptomatic Details", sDesc || "General mechanical noise and minor lag"],
      ];
    } else if (enqType === "brk") {
      specificDetails = [
        ["Passengers Active Trapped Status", bTrapped === "Yes" ? "YES - EMERGENCY CRITICAL" : "NO"],
        ["Emergency Dispatch Class", bTrapped === "Yes" ? "P1 — IMMEDIATE DISPATCH" : "P2 — URGENT CHECK"],
        ["System Brand Name", bBrand || "—"],
        ["Project / Site Location Name", bBuilding || ploc],
        ["Elevator Shaft Identifier / ID", bLiftNo || "L-01"],
        ["Diagnosed Controller Error Code", bErr || "None"],
        ["Hoistway Power Feeder Status", bPower || "Yes"],
        ["Active Site Attendant Person", bContact || cname],
        ["Attendant Phone Number", bContactNo || mobile],
        ["Incident Log Description", bDesc || "Traction lock due to unexplained safety loop trip"],
      ];
    } else if (enqType === "amc") {
      specificDetails = [
        ["Total Number of Lift Shafts", aCount || "1"],
        ["Systems Manufacturer Brand", aBrand || "—"],
        ["Average Equipment Age", aAge ? `${aAge} Years` : "—"],
        ["Current Maintenance Provider", aProvider || "None / Local Vendor"],
        ["Proposed Routine Frequency", aFreq || "Monthly Routine Checkups"],
      ];
    }

    const printHtml = `
      <html>
        <head>
          <title>${reportRef} - E-Tech Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; margin: 40px; font-size: 13px; line-height: 1.6; }
            .header-container { display: flex; align-items: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-wrap { background: #ffffff; padding: 6px 10px; border-radius: 4px; display: inline-block; margin-right: 20px; }
            .logo-wrap img { height: 56px; width: auto; display: block; }
            .title-block { flex: 1; }
            .title-block h1 { margin: 0; font-size: 18px; letter-spacing: 0.05em; font-weight: 700; color: #0c0c0e; }
            .title-block p { margin: 4px 0 0; font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.1em; }
            .doc-title { font-size: 14px; font-weight: 700; color: #d4af37; margin-bottom: 20px; letter-spacing: 0.05em; text-transform: uppercase; border-left: 3px solid #d4af37; padding-left: 10px; }
            .table-wrap { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table-wrap th { background: #f5f6f8; font-weight: 600; text-transform: uppercase; font-size: 10px; color: #444; border: 1px solid #e1e4ea; padding: 10px; text-align: left; }
            .table-wrap td { border: 1px solid #e1e4ea; padding: 10px; vertical-align: top; }
            .table-wrap td.k { font-weight: 600; color: #555; width: 40%; font-size: 11px; }
            .table-wrap td.v { color: #111; }
            .section-label { font-size: 11px; font-weight: 700; color: #1a2d5a; text-transform: uppercase; letter-spacing: 0.05em; margin: 25px 0 10px; }
            .footer-note { border-top: 1px solid #e1e4ea; padding-top: 15px; margin-top: 40px; font-size: 9px; color: #888; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo-wrap">
              <img src="${window.location.origin}/images/etech-logo.png" alt="E-Tech Elevators">
            </div>
            <div class="title-block">
              <h1>E-TECH ELEVATORS</h1>
              <p>Engineering Technology • Lift with Future • Safety First</p>
            </div>
          </div>

          <div class="doc-title">${reportTitle}</div>

          <div class="section-label">1. Primary Customer & Project Information</div>
          <table class="table-wrap">
            <tbody>
              ${leadDetails
                .map(
                  ([k, v]) => `
                <tr>
                  <td class="k">${k}</td>
                  <td class="v">${v}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="section-label">2. Technical Specifications & Recommendations</div>
          <table class="table-wrap">
            <tbody>
              ${specificDetails
                .map(
                  ([k, v]) => `
                <tr>
                  <td class="k">${k}</td>
                  <td class="v">${v}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="section-label">3. Dynamic Operations Roadmap</div>
          <table class="table-wrap">
            <thead>
              <tr>
                <th>Operations Phase</th>
                <th>Standard Timeline</th>
                <th>Phase Scope Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Phase 01: Audit & Survey</td>
                <td>1–2 Weeks</td>
                <td>Hoistway coordinate mapping, shaft plumb lines audit, layout finalization.</td>
              </tr>
              <tr>
                <td>Phase 02: Core Engineering</td>
                <td>4–8 Weeks</td>
                <td>Custom parts manufacturing, PMSM gearless motor calibration, structural rails.</td>
              </tr>
              <tr>
                <td>Phase 03: Field Assembly</td>
                <td>2–4 Weeks</td>
                <td>Guide rails anchors installation, motor rigging, mechanical hoist alignment.</td>
              </tr>
              <tr>
                <td>Phase 04: Safety Validation</td>
                <td>1 Week</td>
                <td>Emergency rescue calibration, overspeed governor drop tests, ride quality telemetry.</td>
              </tr>
            </tbody>
          </table>

          <div class="footer-note">
            <span>E-Tech Elevators Dispatch Bureau • Generated dynamically on ${reportDate}</span>
            <span>Ref ID: ${reportRef} • Page 1 of 1</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  return (
    <div
      id="crm-form-container"
      className="bg-luxury-card border border-white/5 rounded-sm p-6 md:p-8 shadow-2xl relative transition-all duration-500 overflow-hidden"
    >
      {/* Dynamic Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/5 pb-6 mb-6 relative z-10">
        <div className="bg-white/95 rounded-sm flex items-center justify-center shadow-lg w-20 h-16 shrink-0 p-1.5">
          <img
            src="/images/etech-logo.png"
            alt="E-Tech Elevators"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="text-center sm:text-left flex-1 space-y-1">
          <div className="text-lg font-heading font-light tracking-wider text-luxury-text-primary">
            E-TECH CRM PORTAL
          </div>
          <div className="text-[9px] text-luxury-accent uppercase tracking-[0.25em] font-medium">
            ✦ LIFT WITH FUTURE ✦ SAFETY FIRST ✦
          </div>
        </div>
      </div>

      {/* Steps Progress Indicator bar */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between max-w-md mx-auto relative px-6">
          {/* Connector Line Base */}
          <div className="absolute top-3.5 left-10 right-10 h-[2px] bg-white/10 z-0 pointer-events-none" />
          {/* Active Progress line */}
          <div
            className="absolute top-3.5 left-10 h-[2px] bg-luxury-accent z-0 transition-all duration-500 pointer-events-none"
            style={{
              width: step === 0 ? "0%" : step === 1 ? "50%" : "calc(100% - 80px)",
            }}
          />

          {/* Node 1: Details */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setStep(0);
            }}
            className="flex flex-col items-center gap-2 relative z-10 group focus:outline-none cursor-pointer"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all duration-300 ${
                step > 0
                  ? "bg-luxury-accent border-luxury-accent text-black font-bold"
                  : step === 0
                  ? "bg-luxury-accent/15 border-luxury-accent text-luxury-accent shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-black/90 border-white/15 text-luxury-text-secondary group-hover:border-white/30"
              }`}
            >
              {step > 0 ? <CheckCircle className="w-3.5 h-3.5" /> : 1}
            </div>
            <span
              className={`text-[9px] uppercase tracking-widest font-medium transition-colors ${
                step >= 0 ? "text-luxury-accent font-semibold" : "text-luxury-text-secondary"
              }`}
            >
              Details
            </span>
          </button>

          {/* Node 2: Enquiry */}
          <button
            type="button"
            onClick={() => {
              if (step > 1 || (cname && mobile && ploc && btype && bstatus && enqType)) {
                setErrorMsg(null);
                setStep(1);
              }
            }}
            className={`flex flex-col items-center gap-2 relative z-10 group focus:outline-none ${
              step >= 1 || (cname && mobile && ploc && btype && bstatus && enqType)
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-60"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all duration-300 ${
                step > 1
                  ? "bg-luxury-accent border-luxury-accent text-black font-bold"
                  : step === 1
                  ? "bg-luxury-accent/15 border-luxury-accent text-luxury-accent shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-black/90 border-white/15 text-luxury-text-secondary"
              }`}
            >
              {step > 1 ? <CheckCircle className="w-3.5 h-3.5" /> : 2}
            </div>
            <span
              className={`text-[9px] uppercase tracking-widest font-medium transition-colors ${
                step >= 1 ? "text-luxury-accent font-semibold" : "text-luxury-text-secondary"
              }`}
            >
              Enquiry
            </span>
          </button>

          {/* Node 3: Report */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all duration-300 ${
                step === 2
                  ? "bg-luxury-accent border-luxury-accent text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-black/90 border-white/15 text-luxury-text-secondary"
              }`}
            >
              3
            </div>
            <span
              className={`text-[9px] uppercase tracking-widest font-medium transition-colors ${
                step === 2 ? "text-luxury-accent font-semibold" : "text-luxury-text-secondary"
              }`}
            >
              Report
            </span>
          </div>
        </div>
      </div>

      {/* Luxury Inline Toast Alert Banner */}
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

      {/* STEP 0: DETAILS & CATEGORY SELECTION */}
      {step === 0 && (
        <div className="space-y-6 relative z-10">
          {/* Invisible Honeypot Trap for Bot Protection — hidden from real human users */}
          <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="b_hp_email">Do not fill this field</label>
            <input
              type="text"
              id="b_hp_email"
              name="b_hp_email"
              tabIndex={-1}
              autoComplete="off"
              value={b_hp_email}
              onChange={(e) => setB_hp_email(e.target.value)}
            />
          </div>

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
                onChange={(e) => setBtype(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              >
                <option value="" className="bg-[#0c0c0e]">Select</option>
                <option value="Residential" className="bg-[#0c0c0e]">Residential</option>
                <option value="Commercial" className="bg-[#0c0c0e]">Commercial</option>
                <option value="Hospital" className="bg-[#0c0c0e]">Hospital</option>
                <option value="Hotel" className="bg-[#0c0c0e]">Hotel</option>
                <option value="Industrial" className="bg-[#0c0c0e]">Industrial</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                Status *
              </label>
              <select
                value={bstatus}
                onChange={(e) => setBstatus(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
              >
                <option value="" className="bg-[#0c0c0e]">Select</option>
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

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2 pt-2">
            <List className="w-4 h-4" /> Enquiry Category Selector
          </div>

          {/* Grid Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "new", label: "New Installation", icon: Building2, desc: "Plan and install premium new lift systems" },
              { id: "mod", label: "Modernization", icon: Wrench, desc: "Aesthetic upgrades and controller overhauls" },
              { id: "amc", label: "AMC Enquiry", icon: FileText, desc: "Long-term certified service agreements" }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = enqType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEnqType(item.id as EnqType)}
                  className={`p-5 border rounded-sm text-left transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden focus:outline-none ${
                    isSelected
                      ? "border-luxury-accent bg-luxury-accent/10 text-luxury-text-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                      : "border-white/10 hover:border-luxury-accent/40 bg-black/30 hover:bg-luxury-card-hover text-luxury-text-secondary hover:text-luxury-text-primary"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`p-2.5 rounded-sm border shrink-0 transition-colors duration-300 ${
                        isSelected
                          ? "bg-luxury-accent text-black border-luxury-accent"
                          : "bg-white/5 border-white/10 text-luxury-text-secondary group-hover:text-luxury-accent group-hover:border-luxury-accent/40"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-luxury-accent font-semibold bg-luxury-accent/15 px-2 py-0.5 rounded-sm border border-luxury-accent/30">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider font-semibold block text-luxury-text-primary group-hover:text-luxury-accent transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-light leading-relaxed block text-luxury-text-secondary">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Privacy Policy & Terms Agreement Checkbox */}
          <div className="pt-2">
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
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleNextStep0}
              className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 rounded-sm ${
                privacyAgreed
                  ? "luxury-btn cursor-pointer shadow-lg"
                  : "bg-white/5 border border-white/10 text-luxury-text-secondary cursor-not-allowed opacity-60 hover:border-red-500/30"
              }`}
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* In-Form Glassmorphic Privacy Policy & Terms Modal */}
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
                <p>When you submit an enquiry, your contact details (Name, Mobile, Location, Building Specifications) are used strictly by E-Tech's engineering desk to generate technical quotes and schedule site surveys.</p>
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

      {/* STEP 1: ENQUIRY SPECIFIC SUB-FORMS */}
      {step === 1 && (
        <div className="space-y-6 relative z-10">
          {/* 1.1 NEW INSTALLATION FORM */}
          {enqType === "new" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2">
                <Building2 className="w-4 h-4" /> New Installation Details
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Elevator / Vertical Transport Type *
                </label>
                <select
                  value={liftType}
                  onChange={(e) => setLiftType(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent transition-all"
                >
                  <option value="" className="bg-[#0c0c0e]">Select Elevator Type</option>
                  <option value="Passenger Lift" className="bg-[#0c0c0e]">Passenger Lift</option>
                  <option value="MRL (Machine-Room-Less) Lift" className="bg-[#0c0c0e]">MRL (Machine-Room-Less) Lift</option>
                  <option value="Hydraulic Lift" className="bg-[#0c0c0e]">Hydraulic Lift</option>
                  <option value="Hospital / Stretcher Lift" className="bg-[#0c0c0e]">Hospital / Stretcher Lift</option>
                  <option value="Goods / Freight Lift" className="bg-[#0c0c0e]">Goods / Freight Lift</option>
                  <option value="Car Lift" className="bg-[#0c0c0e]">Car Lift</option>
                  <option value="Home Lift" className="bg-[#0c0c0e]">Home Lift</option>
                  <option value="Capsule Lift" className="bg-[#0c0c0e]">Capsule Lift</option>
                  <option value="Escalators" className="bg-[#0c0c0e]">Escalators</option>
                  <option value="Traveleators / Moving Walkways" className="bg-[#0c0c0e]">Traveleators / Moving Walkways</option>
                  <option value="Other" className="bg-[#0c0c0e]">Other (Specify Custom)</option>
                </select>

                {liftType === "Other" && (
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold">
                      Specify Custom Elevator / Transport Type *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Service Dumbwaiter / Inclined Platform Lift"
                      value={otherLiftType}
                      onChange={(e) => setOtherLiftType(e.target.value)}
                      className="w-full bg-black/40 border border-luxury-accent/50 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Capacity (persons)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 8"
                    value={capPer}
                    onKeyDown={blockNonDigitKeys}
                    onChange={(e) => setCapPer(sanitizePositiveInteger(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 630"
                    value={capKg}
                    onKeyDown={blockNonDigitKeys}
                    onChange={(e) => setCapKg(sanitizePositiveInteger(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Door Type
                  </label>
                  <select
                    value={doorType}
                    onChange={(e) => setDoorType(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Automatic Sliding</option>
                    <option className="bg-[#0c0c0e]">Manual Collapsible</option>
                    <option className="bg-[#0c0c0e]">Center Opening</option>
                    <option className="bg-[#0c0c0e]">Side Opening</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Machine Room
                  </label>
                  <select
                    value={mr}
                    onChange={(e) => setMr(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Required</option>
                    <option className="bg-[#0c0c0e]">MRL (Not Required)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Power Supply Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 415V/50Hz 3-Phase"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Shaft Available?
                  </label>
                  <select
                    value={shaft}
                    onChange={(e) => setShaft(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Yes</option>
                    <option className="bg-[#0c0c0e]">No — to construct</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Overhead Height (mm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 4500"
                    value={oh}
                    onKeyDown={blockNonDigitKeys}
                    onChange={(e) => setOh(sanitizePositiveInteger(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Cabin Internal Finish
                  </label>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Stainless Steel</option>
                    <option className="bg-[#0c0c0e]">Mirror Finish SS</option>
                    <option className="bg-[#0c0c0e]">Powder Coated</option>
                    <option className="bg-[#0c0c0e]">Wooden Panel</option>
                    <option className="bg-[#0c0c0e]">Premium Decorative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Expected Completion Month
                  </label>
                  <input
                    type="month"
                    value={compDate}
                    onChange={(e) => setCompDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Budget Range (INR)
                  </label>
                  <input
                    type="text"
                    placeholder="₹ range"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 1.2 MODERNIZATION FORM */}
          {enqType === "mod" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2">
                <Wrench className="w-4 h-4" /> Modernization Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Existing Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OTIS, KONE"
                    value={mBrand}
                    onChange={(e) => setMBrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift Age (years)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={mAge}
                    onChange={(e) => setMAge(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 630"
                    value={mCap}
                    onChange={(e) => setMCap(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Target Budget (INR)
                  </label>
                  <input
                    type="text"
                    placeholder="₹ range"
                    value={mBudget}
                    onChange={(e) => setMBudget(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Upgrade Reason
                  </label>
                  <select
                    value={mReason}
                    onChange={(e) => setMReason(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Safety concerns</option>
                    <option className="bg-[#0c0c0e]">Frequent breakdowns</option>
                    <option className="bg-[#0c0c0e]">Energy efficiency</option>
                    <option className="bg-[#0c0c0e]">Aesthetic upgrade</option>
                    <option className="bg-[#0c0c0e]">Regulatory compliance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Completion Deadline
                  </label>
                  <input
                    type="month"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Current Problems
                </label>
                <textarea
                  placeholder="Describe issues..."
                  value={mProbs}
                  onChange={(e) => setMProbs(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold block">
                  Modernization Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Controller", "Machine", "Doors", "COP/LOP", "Cabin", "ARD", "Door Sensor", "Complete"].map((scope) => {
                    const checked = mScope.includes(scope);
                    return (
                      <label
                        key={scope}
                        className={`flex items-center gap-3 border rounded-sm p-3 cursor-pointer text-xs transition-all duration-300 ${
                          checked
                            ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                            : "border-white/5 bg-black/20 text-luxury-text-secondary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMScope(scope)}
                          className="w-4 h-4 accent-luxury-accent cursor-pointer rounded-sm"
                        />
                        <span>{scope === "Complete" ? "Complete lift" : scope}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 1.3 SERVICE & MAINTENANCE FORM */}
          {enqType === "svc" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2">
                <Settings className="w-4 h-4" /> Service Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kone, Schindler"
                    value={sBrand}
                    onChange={(e) => setSBrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 630"
                    value={sCap}
                    onChange={(e) => setSCap(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    AMC Contract Active?
                  </label>
                  <select
                    value={sAmc}
                    onChange={(e) => setSAmc(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select</option>
                    <option className="bg-[#0c0c0e]">Yes</option>
                    <option className="bg-[#0c0c0e]">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    value={sLastDate}
                    onChange={(e) => setSLastDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none text-luxury-text-secondary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Urgency Level *
                </label>
                <select
                  value={sUrgency}
                  onChange={(e) => setSUrgency(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                >
                  <option value="" className="bg-[#0c0c0e]">Select Urgency</option>
                  <option className="bg-[#0c0c0e]">Normal</option>
                  <option className="bg-[#0c0c0e]">Urgent</option>
                  <option className="bg-[#0c0c0e]">Emergency</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold block">
                  Complaint Checklist
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Lift Not Working",
                    "Lift Stuck",
                    "Door Problem",
                    "ARD Problem",
                    "Machine Noise",
                    "Controller Fault",
                    "Sensor Fault",
                    "Display Fault",
                  ].map((comp) => {
                    const checked = sComp.includes(comp);
                    return (
                      <label
                        key={comp}
                        className={`flex items-center gap-3 border rounded-sm p-3 cursor-pointer text-xs transition-all duration-300 ${
                          checked
                            ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                            : "border-white/5 bg-black/20 text-luxury-text-secondary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSComp(comp)}
                          className="w-4 h-4 accent-luxury-accent cursor-pointer rounded-sm"
                        />
                        <span>{comp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Problem Description
                </label>
                <textarea
                  placeholder="Describe the issue..."
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* 1.4 EMERGENCY BREAKDOWN FORM */}
          {enqType === "brk" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-500 font-medium border-b border-red-500/20 pb-2">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> Breakdown Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OTIS, Schindler"
                    value={bBrand}
                    onChange={(e) => setBBrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Building / Site Name
                  </label>
                  <input
                    type="text"
                    placeholder="Wing A / Block B"
                    value={bBuilding}
                    onChange={(e) => setBBuilding(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift No. / ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. L-01"
                    value={bLiftNo}
                    onChange={(e) => setBLiftNo(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Error Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. E24, F01"
                    value={bErr}
                    onChange={(e) => setBErr(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Passengers Trapped?
                  </label>
                  <select
                    value={bTrapped}
                    onChange={(e) => setBTrapped(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none border-red-500/30"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select Status</option>
                    <option className="bg-[#0c0c0e]">Yes</option>
                    <option className="bg-[#0c0c0e]">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Power Available?
                  </label>
                  <select
                    value={bPower}
                    onChange={(e) => setBPower(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  >
                    <option value="" className="bg-[#0c0c0e]">Select Status</option>
                    <option className="bg-[#0c0c0e]">Yes</option>
                    <option className="bg-[#0c0c0e]">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Site Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Name of person at site"
                    value={bContact}
                    onChange={(e) => setBContact(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX"
                    value={bContactNo}
                    onChange={(e) => setBContactNo(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Problem Description
                </label>
                <textarea
                  placeholder="Describe breakdown symptoms..."
                  value={bDesc}
                  onChange={(e) => setBDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* 1.5 AMC ENQUIRY FORM */}
          {enqType === "amc" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium border-b border-white/5 pb-2">
                <FileText className="w-4 h-4" /> AMC Enquiry Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    No. of Lifts
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={aCount}
                    onChange={(e) => setACount(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kone, Schindler"
                    value={aBrand}
                    onChange={(e) => setABrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Lift Age (years)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={aAge}
                    onChange={(e) => setAAge(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                    Current Maintenance Provider
                  </label>
                  <input
                    type="text"
                    placeholder="Vendor name or None"
                    value={aProvider}
                    onChange={(e) => setAProvider(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-semibold">
                  Service Frequency
                </label>
                <select
                  value={aFreq}
                  onChange={(e) => setAFreq(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-xs text-luxury-text-primary focus:outline-none"
                >
                  <option value="" className="bg-[#0c0c0e]">Select Frequency</option>
                  <option className="bg-[#0c0c0e]">Monthly</option>
                  <option className="bg-[#0c0c0e]">Bi-Monthly</option>
                  <option className="bg-[#0c0c0e]">Quarterly</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest py-4 rounded-sm text-luxury-text-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={generateReport}
              className="flex-1 luxury-btn py-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
            >
              Generate Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUMMARY REPORT OUTPUT */}
      {step === 2 && (
        <div className="space-y-6 relative z-10 text-luxury-text-primary">
          {/* Dynamic header / Summary hero depending on breakdown/urgency */}
          {enqType === "brk" && bTrapped === "Yes" ? (
            <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border border-red-500/20 p-5 rounded-sm flex items-start gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-sm text-red-500 animate-pulse animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-semibold text-red-500 uppercase tracking-widest animate-pulse">
                  CRITICAL BREAKDOWN ACTIVE
                </h3>
                <p className="text-[10px] text-red-400 font-light leading-relaxed">
                  Passengers Trapped. Emergency dispatch team is preparing for immediate deployment.
                </p>
                <div className="text-[9px] uppercase tracking-wider text-red-500 font-semibold pt-1">
                  Reference: {reportRef} | logged: {reportDate}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-luxury-accent/15 via-[#0e0e11] to-[#0c0c0e] border border-luxury-accent/20 p-6 rounded-sm flex items-start gap-4 shadow-xl">
              <div className="p-3 bg-luxury-accent/10 border border-luxury-accent/40 rounded-sm text-luxury-accent shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-heading font-semibold text-luxury-accent uppercase tracking-widest">
                  Enquiry Report Generated
                </h3>
                <p className="text-[10px] text-luxury-text-secondary font-light">
                  Primary parameters evaluated. Engineering specification checklist generated below.
                </p>
                <div className="text-[9px] uppercase tracking-wider text-luxury-accent/70 font-semibold pt-1">
                  Reference: {reportRef} | date: {reportDate}
                </div>
              </div>
            </div>
          )}

          {/* Detailed summary grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Primary customer & site data */}
            <div className="bg-black/40 border border-white/5 rounded-sm overflow-hidden flex flex-col justify-between">
              <div className="bg-white/3 border-b border-white/5 p-4 flex items-center gap-2">
                <User className="w-4 h-4 text-luxury-accent" />
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-text-primary">
                  Client & Project Brief
                </h4>
              </div>
              <div className="divide-y divide-white/5 text-[11px] p-2 flex-1">
                {[
                  ["Customer", cname],
                  ["Company", coname || "—"],
                  ["Mobile", mobile],
                  ["Email", email || "—"],
                  ["Project", pname || "—"],
                  ["Location", ploc],
                  ["Building Type", `${btype} | ${bstatus}`],
                  ["Floors / Stops", `${floors || "—"} Floors / ${stops || floors || "—"} Stops`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 px-3">
                    <span className="text-luxury-text-secondary font-light">{k}</span>
                    <span className="text-luxury-text-primary font-medium text-right max-w-[60%] truncate">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Technical Specs / Recommendations */}
            <div className="bg-black/40 border border-white/5 rounded-sm overflow-hidden flex flex-col justify-between">
              <div className="bg-white/3 border-b border-white/5 p-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-luxury-accent" />
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-text-primary">
                  Technical Recommendations
                </h4>
              </div>
              <div className="divide-y divide-white/5 text-[11px] p-2 flex-1">
                {enqType === "new" && (
                  <>
                    {[
                      ["Elevator Type", liftType],
                      [
                        "Nominal Capacity",
                        capKg
                          ? `${capKg} kg (${capPer || "—"} Pax)`
                          : liftType === "Home Lift"
                          ? "250-400 kg"
                          : "630-1000 kg",
                      ],
                      [
                        "Suggested Speed",
                        parseInt(floors || "1") <= 5
                          ? "0.5 - 1.0 m/s"
                          : parseInt(floors || "1") <= 10
                          ? "1.0 - 1.6 m/s"
                          : "1.6 - 2.5 m/s",
                      ],
                      ["Door Config", doorType || "Automatic Sliding"],
                      ["Machine Room", mr || "MRL (Not Required)"],
                      ["Overhead Ht (mm)", oh ? `${oh} mm` : "Min. 4200 mm"],
                      ["Cabin Finish", finish || "Stainless Steel"],
                      ["Budget (INR)", budget || "To Be Quoted"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 px-3">
                        <span className="text-luxury-text-secondary font-light">{k}</span>
                        <span className="text-luxury-text-primary font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </>
                )}

                {enqType === "mod" && (
                  <>
                    {[
                      ["Existing Brand", mBrand || "—"],
                      ["Lift Age", mAge ? `${mAge} Years` : "—"],
                      ["Capacity", mCap ? `${mCap} kg` : "—"],
                      ["Target Budget", mBudget || "TBD"],
                      ["Upgrade Reason", mReason || "Safety / Code Compliance"],
                      ["Target Date", mDate || "TBD"],
                      ["Scope of Upgrade", mScope.join(", ") || "General overhaul"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 px-3">
                        <span className="text-luxury-text-secondary font-light">{k}</span>
                        <span className="text-luxury-text-primary font-medium text-right max-w-[60%] truncate">
                          {v}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {enqType === "svc" && (
                  <>
                    {[
                      ["Lift Brand", sBrand || "—"],
                      ["Capacity", sCap ? `${sCap} kg` : "—"],
                      ["Active AMC Status", sAmc || "No"],
                      ["Last Service", sLastDate || "None Recorded"],
                      ["Dispatch Urgency", sUrgency],
                      ["Selected Issues", sComp.join(", ") || "Routine Diagnostics"],
                      ["Symptom Log", sDesc || "Routine checkup needed"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 px-3">
                        <span className="text-luxury-text-secondary font-light">{k}</span>
                        <span className="text-luxury-text-primary font-medium text-right max-w-[60%] truncate">
                          {v}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {enqType === "brk" && (
                  <>
                    {[
                      ["Active Trap Risk", bTrapped === "Yes" ? "Emergency Callout" : "No Active Risk"],
                      ["Dispatch Target", bTrapped === "Yes" ? "Under 30 Minutes" : "1–2 Hours"],
                      ["Incident Site Contact", bContact || cname],
                      ["Contact Mobile", bContactNo || mobile],
                      ["Lift Brand / ID", `${bBrand || "—"} | ID: ${bLiftNo || "L-01"}`],
                      ["Diagnostics Error Code", bErr || "None"],
                      ["Power Source Line", bPower || "Yes"],
                      ["Breakdown Symptoms", bDesc || "Unclassified Safety Trip"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 px-3">
                        <span className="text-luxury-text-secondary font-light">{k}</span>
                        <span className="text-luxury-text-primary font-medium text-right max-w-[60%] truncate">
                          {v}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {enqType === "amc" && (
                  <>
                    {[
                      ["Total Lifts", aCount || "1"],
                      ["Lift Brand Setup", aBrand || "—"],
                      ["Average Lift Age", aAge ? `${aAge} Years` : "—"],
                      ["Previous Vendor", aProvider || "None"],
                      ["AMC Frequency", aFreq || "Monthly Checks (Recommended)"],
                      ["Response SLA Contract", "24/7 Breakdown Coverage"],
                      ["Inclusions", "Lubrication, safety loops audit, safety cert."],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 px-3">
                        <span className="text-luxury-text-secondary font-light">{k}</span>
                        <span className="text-luxury-text-primary font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Checklists & Documents */}
          {enqType === "new" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/5 bg-black/40 rounded-sm p-5 space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-accent flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Hoistway Site Requirements
                </h4>
                <ul className="text-xs space-y-2 text-luxury-text-secondary font-light">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Pit depth minimum of 1200 mm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Overhead clearance height of 4200 mm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Plumb concrete shaft with smooth walls
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> 3-Phase power feed line at machine level
                  </li>
                </ul>
              </div>

              <div className="border border-white/5 bg-black/40 rounded-sm p-5 space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-accent flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Civil Drawings Checklist
                </h4>
                <ul className="text-xs space-y-2 text-luxury-text-secondary font-light">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Architectural structural blueprints
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Hoistway elevation and cross section
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Building structural calculation sheets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" /> Electrical layout drawings
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 4: Operational timelines */}
          <div className="border border-white/5 bg-black/40 rounded-sm p-5 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-accent flex items-center gap-2">
              <Clock className="w-4 h-4" /> Project Operations Roadmap
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { phase: "Audit Survey", time: "1–2 Weeks" },
                { phase: "Manufacturing", time: "4–8 Weeks" },
                { phase: "Field Assembly", time: "2–4 Weeks" },
                { phase: "Safety Sign-off", time: "1 Week" }
              ].map((p, idx) => (
                <div key={idx} className="border border-white/5 p-3 rounded-sm bg-white/3 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block font-semibold">
                    {p.phase}
                  </span>
                  <span className="text-xs text-luxury-accent font-medium">{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Details Grid entry */}
          <div className="border border-white/5 rounded-sm overflow-hidden bg-black/40">
            <div className="bg-[#121216] border-b border-white/5 p-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-luxury-accent" />
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-luxury-text-primary">
                CRM Lead Entry Ledger
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x divide-white/5 text-[11px]">
              <div className="p-3">
                <div className="text-[9px] uppercase tracking-wider text-luxury-text-secondary mb-1">
                  Lead Ref
                </div>
                <div className="font-semibold text-luxury-text-primary">{reportRef}</div>
              </div>
              <div className="p-3">
                <div className="text-[9px] uppercase tracking-wider text-luxury-text-secondary mb-1">
                  Lead Class
                </div>
                <div className="font-semibold text-luxury-accent">
                  {enqType === "brk" && bTrapped === "Yes" ? "🔴 P1 Emergency" : "🟢 Lead Inflow"}
                </div>
              </div>
              <div className="p-3">
                <div className="text-[9px] uppercase tracking-wider text-luxury-text-secondary mb-1">
                  Site Region
                </div>
                <div className="font-semibold text-luxury-text-primary truncate">{ploc}</div>
              </div>
              <div className="p-3">
                <div className="text-[9px] uppercase tracking-wider text-luxury-text-secondary mb-1">
                  Desk Assignee
                </div>
                <div className="font-semibold text-luxury-text-secondary italic">Pending Dispatcher</div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5 relative z-10">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep(0);
              }}
              className="flex-1 border border-white/10 hover:border-luxury-accent/40 hover:bg-white/5 transition-all text-xs uppercase tracking-widest py-4 rounded-sm text-luxury-text-primary flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-luxury-accent" /> Edit Information
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest py-4 rounded-sm text-luxury-text-secondary flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> New Enquiry
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 transition-all text-xs uppercase tracking-widest py-4 rounded-sm text-white flex items-center justify-center gap-2 font-semibold shadow-lg cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Submit via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
