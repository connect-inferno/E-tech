export interface StatItem {
  value: string;
  number: number;
  suffix: string;
  label: string;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
}

export interface CoreValueItem {
  title: string;
  description: string;
  iconName: string;
}

export const siteContent = {
  metadata: {
    title: "E TECH ELEVATORS | Elevating Safety, Reliability & Trust",
    description: "ISO-certified elevator installation, AMC, modernization and 24/7 breakdown support across Maharashtra. Based in Pune, serving 500+ lifts with 120+ active AMC clients.",
  },
  company: {
    name: "E TECH ELEVATORS",
    tagline: "Elevating Safety, Reliability & Trust",
    logoText: "E TECH",
    ctaText: "Get Quote",
    certifications: "ISO Certified · 7+ Years of Excellence · Maharashtra Operations",
    founded: 2019,
    headquarters: "Pune, Maharashtra",
    employees: "25+",
  },
  navigation: {
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Products", href: "/products" },
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Contact", href: "/contact" },
    ],
  },
  hero: {
    phase1: {
      title: "E TECH ELEVATORS",
      subtitle: "Elevating Safety, Reliability & Trust",
    },
    phase2: {
      title: "Reliable Vertical Mobility",
      description: "Trusted elevator installation, maintenance and modernization across Maharashtra since 2019.",
    },
    phase3: {
      title: "Designed Around Safety",
      description: "Every service call, every AMC, every install is built on a foundation of Safety, Quality and Customer First.",
    },
    phase4: {
      title: "Precision Engineering",
      features: [
        "15-minute emergency response",
        "100% Genuine OEM Spare Parts",
        "Factory-Trained Engineers",
        "Digital Service Reporting",
        "Annual Safety Audits",
      ],
    },
    phase5: {
      title: "E TECH ELEVATORS",
      subtitle: "Elevating Safety, Reliability & Trust",
      cta: "Explore Our Solutions",
    },
  },
  about: {
    title: "The Standard of Reliable Elevation",
    subtitle: "About Us",
    storyTitle: "A Message from Our Leadership",
    storyParagraph1: "Dear Valued Clients, Partners,\n\nIt is with immense pride and gratitude that I welcome you to E Tech Elevators — a company built on trust, safety, and engineering excellence. Since our founding in 2019, we have grown from a Pune-based service provider into one of Maharashtra's most respected elevator companies, today serving 120+ active AMC clients and 500+ lifts under maintenance across the region.",
    storyParagraph2: "Our journey has been driven by one core belief: every person who steps into an elevator deserves the highest standard of safety and reliability. This belief shapes every decision we make — from the 100% genuine OEM parts we install, to the factory-trained engineers who service them, to the transparent digital reports we deliver to every client.",
    missionTitle: "Our Mission",
    missionText: "Provide superior elevator services with fast response times, high safety standards, and transparent reporting to every building we serve.",
    visionTitle: "Our Vision",
    visionText: "To become India's most trusted elevator service company by delivering world-class safety, reliability, and innovation.",
    stats: [
      { value: "500+", number: 500, suffix: "+", label: "Lifts Under Maintenance" },
      { value: "120+", number: 120, suffix: "+", label: "Active AMC Clients" },
      { value: "94%", number: 94, suffix: "%", label: "First-Time Fix Rate" },
      { value: "24/7", number: 24, suffix: "/7", label: "Emergency Support" },
    ] as StatItem[],
    coreValues: [
      { title: "Safety", description: "Every decision, every install, every service call starts with safety first.", iconName: "ShieldCheck" },
      { title: "Quality", description: "100% genuine OEM parts, factory-trained engineers, IS:14665 and ISO 9001:2015 aligned processes.", iconName: "Award" },
      { title: "Innovation", description: "Digital service reporting and smart monitoring so clients see everything we do.", iconName: "Cpu" },
      { title: "Reliability", description: "94% first-time fix rate and a 15-minute emergency response commitment.", iconName: "Zap" },
      { title: "Customer First", description: "Transparent quarterly and annual reports — no hidden work, no hidden costs.", iconName: "Headphones" },
    ] as CoreValueItem[],
    milestones: [
      { year: "2019", title: "Company founded in Pune" },
      { year: "2020", title: "100+ AMC clients onboarded" },
      { year: "2021", title: "Installation & Modernization divisions launched" },
      { year: "2022", title: "ISO Certification achieved" },
      { year: "2024", title: "500+ AMC contracts under maintenance" },
      { year: "2025", title: "Expansion to Pimpri-Chinchwad & Nashik" },
      { year: "2026", title: "Pan-Maharashtra expansion" },
    ] as MilestoneItem[],
    performance: [
      { value: "94%", label: "First-time fix rate" },
      { value: "100%", label: "Engineer certification" },
      { value: "100%", label: "Genuine OEM parts" },
      { value: "85%", label: "Digital reporting adoption" },
      { value: "100%", label: "Annual safety audit pass rate" },
      { value: "91%", label: "Employee retention" },
    ],
    compliance: [
      "IS:14665 compliant",
      "ISO 9001:2015 Quality Management",
      "LOTO procedures on every site",
      "Emergency Rescue Protocol",
      "Continuous quality improvement",
    ],
  },
  products: {
    title: "Vertical Systems Portfolio",
    subtitle: "Our Products",
    categories: [
      {
        id: "passenger",
        title: "Passenger Lifts",
        description: "Smooth, quiet passenger elevators for residential and commercial buildings.",
        longDescription: "Reliable everyday transit engineered for comfort, silent operation and predictable service life. Cabin finishes tailored to your building's design.",
        features: ["Smooth ride profile", "Intelligent traffic allocation", "Custom cabin interiors"],
        image: "passenger",
      },
      {
        id: "mrl",
        title: "MRL Lifts",
        description: "Machine-Room-Less setups that save architectural space.",
        longDescription: "Compact gearless motor sits inside the hoistway, freeing up rooftop space and reducing civil work.",
        features: ["No separate machine room", "Energy-efficient gearless traction", "Ideal for space-constrained buildings"],
        image: "mrl",
      },
      {
        id: "geared",
        title: "Geared Lifts",
        description: "Proven geared traction systems for medium-rise buildings.",
        longDescription: "Robust, easy-to-service geared traction machines suited to buildings where lifetime cost and serviceability matter more than top speed.",
        features: ["Rugged, long-life gearbox", "Lower installation cost", "Familiar service ecosystem"],
        image: "geared",
      },
      {
        id: "gearless",
        title: "Gearless Lifts",
        description: "Modern PMSM gearless drives for premium ride quality.",
        longDescription: "Permanent-magnet synchronous motors deliver silent, smooth transit with minimal maintenance and superior energy efficiency.",
        features: ["Silent operation", "High energy efficiency", "Minimal wear parts"],
        image: "gearless",
      },
      {
        id: "hydraulic",
        title: "Hydraulic Lifts",
        description: "High-load, space-saving mechanisms ideal for low-rise structures.",
        longDescription: "Best for 2-5 floor buildings where smooth acceleration and minimum top clearance are required.",
        features: ["Exceptional weight bearing", "Smooth piston drive", "Low overhead requirement"],
        image: "hydraulic",
      },
      {
        id: "hospital",
        title: "Hospital Lifts",
        description: "Heavy-duty bed elevators focused on care, hygiene and reliability.",
        longDescription: "Engineered with accurate deck-leveling, extra-wide entrances and priority emergency routing for patient movement.",
        features: ["Accurate deck-leveling", "Hygienic stainless-steel walls", "Priority emergency routing"],
        image: "hospital",
      },
      {
        id: "goods",
        title: "Goods / Freight Lifts",
        description: "High-capacity freight elevators for warehouses, factories and retail.",
        longDescription: "Built for heavy daily load cycles with reinforced flooring, protective wall panels and robust safety controls.",
        features: ["High load capacity", "Reinforced flooring & walls", "Heavy-duty safety controls"],
        image: "goods",
      },
      {
        id: "car",
        title: "Car Lifts",
        description: "Vehicle elevators for stack parking and multi-level automotive access.",
        longDescription: "Engineered platforms sized and reinforced for cars, with precision leveling for smooth drive-on / drive-off.",
        features: ["Sized for standard vehicles", "Precision leveling", "Heavy platform reinforcement"],
        image: "car",
      },
      {
        id: "home",
        title: "Home Lifts",
        description: "Compact, quiet, luxury-tailored elevators designed for private villas.",
        longDescription: "Minimal headroom and pit-depth requirements make these ideal for retrofits into existing homes without major structural work.",
        features: ["No major structural modifications", "Single-phase power compatibility", "Custom bespoke design"],
        image: "home",
      },
      {
        id: "capsule",
        title: "Capsule Lifts",
        description: "Panoramic vertical capsules that turn transit into an architectural feature.",
        longDescription: "Designed for malls, premium hotels, and showroom lobbies where the lift itself is part of the design language.",
        features: ["Panoramic glass views", "Pneumatic or gearless drive", "Ambient base lighting"],
        image: "capsule",
      },
    ] as ProductItem[],
  },
  services: {
    title: "Complete Elevator Services Lifecycle",
    subtitle: "Our Services",
    items: [
      {
        id: "installation",
        title: "Elevator Installation",
        description: "New elevator installation across residential, commercial and industrial buildings — from site survey to commissioning.",
        icon: "Wrench",
      },
      {
        id: "amc-comprehensive",
        title: "Comprehensive AMC",
        description: "All-inclusive Annual Maintenance Contracts covering parts, routine inspections and priority breakdown response.",
        icon: "Briefcase",
      },
      {
        id: "amc-non-comprehensive",
        title: "Non-Comprehensive AMC",
        description: "Scheduled maintenance and inspections with parts billed as needed — a cost-effective option for well-maintained lifts.",
        icon: "ClipboardList",
      },
      {
        id: "breakdown",
        title: "Breakdown Maintenance",
        description: "24/7 emergency dispatch with a 15-minute response commitment. On-call engineers, genuine OEM parts.",
        icon: "PhoneCall",
      },
      {
        id: "preventive",
        title: "Preventive Maintenance",
        description: "Scheduled inspections and predictive checks that catch wear before it becomes a breakdown.",
        icon: "ShieldAlert",
      },
      {
        id: "modernization",
        title: "Lift Modernization",
        description: "Upgrade older mechanical systems to modern gearless drives, new control boards, and refreshed cabin interiors.",
        icon: "Activity",
      },
      {
        id: "safety-audits",
        title: "Safety Audits",
        description: "Independent annual safety audits aligned to IS:14665 with a written report and remediation plan.",
        icon: "ShieldCheck",
      },
      {
        id: "consultancy",
        title: "Technical Consultancy",
        description: "Specification, selection and layout consultancy for architects, developers and facility teams.",
        icon: "Settings",
      },
    ] as ServiceItem[],
  },
  whyChooseUs: {
    title: "Why Buildings Across Maharashtra Choose E Tech",
    subtitle: "Why Choose Us",
    items: [
      {
        id: "response",
        title: "15-Minute Emergency Response",
        description: "Dedicated dispatch line and on-call engineers for breakdown calls, 24/7 across our service region.",
        iconName: "Zap",
      },
      {
        id: "engineers",
        title: "Factory-Trained Engineers",
        description: "100% engineer certification. Every technician is trained on the systems they service.",
        iconName: "Award",
      },
      {
        id: "oem",
        title: "100% Genuine OEM Parts",
        description: "No third-party substitutes. Every replacement part is genuine OEM — protecting warranty and safety.",
        iconName: "Layers",
      },
      {
        id: "digital",
        title: "Digital Service Reporting",
        description: "Every service visit is logged digitally. Clients see monthly, quarterly and annual reports with 85% adoption today.",
        iconName: "Cpu",
      },
      {
        id: "safety",
        title: "Annual Safety Audits",
        description: "IS:14665 aligned safety audits with a 100% annual pass rate, plus a written remediation plan.",
        iconName: "ShieldCheck",
      },
      {
        id: "support",
        title: "24/7 Customer Support",
        description: "Real people, real engineers, no ticket queues. Direct WhatsApp and phone lines to our support team.",
        iconName: "Headphones",
      },
      {
        id: "custom",
        title: "Fully Customized Solutions",
        description: "From capsule lifts to freight and car elevators — we deliver what standard catalogue vendors can't.",
        iconName: "Sliders",
      },
    ] as WhyItem[],
  },
  projects: {
    title: "Featured Installations",
    subtitle: "Our Projects",
    categories: ["All", "Residential", "Commercial", "Hospitality", "Medical"],
    items: [
      {
        id: "p1",
        title: "Premium Residential Capsule Lift",
        category: "Residential",
        location: "Pune, MH",
        image: "p1",
      },
      {
        id: "p2",
        title: "Commercial Tower AMC Fleet",
        category: "Commercial",
        location: "Pimpri-Chinchwad, MH",
        image: "p2",
      },
      {
        id: "p3",
        title: "Hospitality Glass Elevator",
        category: "Hospitality",
        location: "Nashik, MH",
        image: "p3",
      },
      {
        id: "p4",
        title: "Hospital Bed Elevators",
        category: "Medical",
        location: "Pune, MH",
        image: "p4",
      },
      {
        id: "p5",
        title: "Multi-Building MRL Modernization",
        category: "Commercial",
        location: "Chh. Sambhajinagar, MH",
        image: "p5",
      },
      {
        id: "p6",
        title: "Private Villa Bespoke Home Lift",
        category: "Residential",
        location: "Kolhapur, MH",
        image: "p6",
      },
    ] as ProjectItem[],
  },
  contact: {
    title: "Let's Talk About Your Building",
    subtitle: "Contact Us",
    description: "Whether you're planning a new install, need an AMC quote, or want an emergency response — reach the team directly.",
    ctaLabel: "Send Enquiry",
    info: {
      address: "E Tech Elevator, Pune, Maharashtra – 410505",
      phone: "+91 95884 09957",
      whatsapp: "+91 90491 14482",
      email: "e.tech5534@gmail.com",
      hours: "Mon – Sat: 9:00 AM – 6:30 PM · 24/7 Emergency Line",
      emergencyPhone: "+91 95884 09957 (24/7 Emergency)",
    },
    serviceAreas: [
      "Pune",
      "Pimpri-Chinchwad",
      "Nashik",
      "Chhatrapati Sambhajinagar",
      "Kolhapur",
    ],
    googleMapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.5!2d73.856!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin",
  },
  footer: {
    disclaimer: "© 2026 E Tech Elevators. All Rights Reserved. ISO Certified · Serving Maharashtra since 2019.",
    tagline: "Safety, reliability and transparent service — from Pune to every corner of Maharashtra.",
    socials: [
      { name: "Instagram", href: "https://www.instagram.com/etechelevator5534?utm_source=qr&igsh=eDRiaG90ZnlneXY5" },
    ],
  },
};
