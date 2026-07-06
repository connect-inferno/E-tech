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
  image: string; // Will use local placeholders / stylized canvas/gradients
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

export const siteContent = {
  metadata: {
    title: "E TECH ELEVATORS | Elevating Safety, Reliability & Trust",
    description: "Experience premium, luxury elevator engineering. Cinematic vertical mobility systems for passenger, capsule, glass, home, and industrial architectures.",
  },
  company: {
    name: "E TECH ELEVATORS",
    tagline: "Elevating Safety, Reliability & Trust",
    logoText: "E TECH",
    ctaText: "Get Quote",
  },
  navigation: {
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Products", href: "/products" },
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Contact", href: "/#contact" },
    ],
  },
  hero: {
    // 0-20%
    phase1: {
      title: "E TECH ELEVATORS",
      subtitle: "Elevating Safety, Reliability & Trust",
    },
    // 20-40%
    phase2: {
      title: "Luxury Vertical Mobility",
      description: "Crafting premium elevator systems where engineering, architecture and innovation move together.",
    },
    // 40-60%
    phase3: {
      title: "Designed Around Experience",
      description: "Every detail is engineered for comfort, silence and elegance. Transitioning seamlessly through space.",
    },
    // 60-80%
    phase4: {
      title: "Precision Engineering",
      features: [
        "Advanced Safety Systems",
        "Smooth Ride Technology",
        "Silent Performance",
        "Energy Efficient Design",
        "Premium Architectural Components",
      ],
    },
    // 80-100%
    phase5: {
      title: "E TECH ELEVATORS",
      subtitle: "Elevating Safety, Reliability & Trust",
      cta: "Explore Our Solutions",
    },
  },
  about: {
    title: "The Standard of Architectural Elevation",
    subtitle: "About Us",
    storyTitle: "Engineering Luxury Motion",
    storyParagraph1: "At E Tech Elevators, we define the future of architectural vertical transitions. Driven by an uncompromising commitment to safety, silence, and sophisticated engineering, we craft vertical pathways that integrate seamlessly into the world's most luxurious residential, commercial, and clinical spaces.",
    storyParagraph2: "Our elevators are not mere utility devices; they are architectural statements. By blending advanced heavy engineering with premium materials like brushed bronze, textured leather, and polished marble, we create elevators that elevate experience itself.",
    missionTitle: "Our Mission",
    missionText: "To design and deliver vertical mobility systems that guarantee absolute safety, unparalleled riding comfort, and striking aesthetic beauty, setting the new benchmark for luxury elevators worldwide.",
    visionTitle: "Our Vision",
    visionText: "To bridge the gap between engineering complexity and aesthetic simplicity, creating vertical journeys that feel weightless, architectural, and timeless.",
    stats: [
      { value: "500+", number: 500, suffix: "+", label: "Global Installations" },
      { value: "0", number: 0, suffix: " incidents", label: "Safety Records Unmatched" }, // will animate
      { value: "99.9%", number: 99.9, suffix: "%", label: "System Uptime" },
      { value: "24/7", number: 24, suffix: "/7", label: "Proactive Response Support" },
    ] as StatItem[],
  },
  products: {
    title: "Vertical Systems Portfolio",
    subtitle: "Our Products",
    categories: [
      {
        id: "passenger",
        title: "Passenger Elevators",
        description: "Elegant and smooth transit systems for premium residential and commercial spaces.",
        longDescription: "Crafted with micro-engineered vibration dampers and luxury cabin options ranging from brushed titanium to customized walnut paneling.",
        features: ["Ultra-smooth ride profile", "Intelligent traffic allocation", "Custom luxury interior styles"],
        image: "passenger"
      },
      {
        id: "capsule",
        title: "Capsule Elevators",
        description: "Panoramic vertical capsules designed to turn vertical transitions into artistic events.",
        longDescription: "Designed for malls, premium hotels, and luxury spaces seeking to display architectural transit in style.",
        features: ["180-degree panoramic glass views", "Pneumatic or gearless drive options", "Ambient architectural base lighting"],
        image: "capsule"
      },
      {
        id: "glass",
        title: "Glass Elevators",
        description: "Minimalist structural glass systems that integrate seamlessly into modern luxury homes.",
        longDescription: "Features invisible architectural frames and maximum glass surface area to retain spatial transparency.",
        features: ["Frameless glass architecture", "Hydraulic or MRL configuration", "Silent motor technology"],
        image: "glass"
      },
      {
        id: "home",
        title: "Home Elevators",
        description: "Compact, quiet, and luxury-tailored elevators designed for private villas.",
        longDescription: "Requiring minimal headroom and pit depth, E Tech Private home systems represent the peak of personalized engineering.",
        features: ["No major structural modifications", "Single-phase power compatibility", "Custom bespoke design styles"],
        image: "home"
      },
      {
        id: "hospital",
        title: "Hospital Elevators",
        description: "Precision-engineered, heavy-duty bed elevators focusing on care and reliability.",
        longDescription: "Engineered with specialized leveling systems, extra-wide entrances, and emergency backup configurations.",
        features: ["Accurate deck-leveling technology", "Hygienic stainless steel walls", "Priority emergency response routing"],
        image: "hospital"
      },
      {
        id: "freight",
        title: "Freight Elevators",
        description: "Heavy-duty cargo systems engineered to withstand structural impacts.",
        longDescription: "Built with reinforced steel cabins, high load capacity motors, and structural floor plating to support industrial transport.",
        features: ["High load capacities (up to 10 tons)", "Micro-stop safety brakes", "Anti-skid steel floors"],
        image: "freight"
      },
      {
        id: "hydraulic",
        title: "Hydraulic Elevators",
        description: "High-load, space-saving mechanisms ideal for low-rise structures.",
        longDescription: "Ideal for residential buildings of 2-5 floors where smooth acceleration and minimum top clearance are required.",
        features: ["Exceptional weight bearing capabilities", "Smooth, silent piston drives", "Low maintenance costs"],
        image: "hydraulic"
      },
      {
        id: "mrl",
        title: "MRL Elevators",
        description: "Machine-Room-Less setups that save architectural space.",
        longDescription: "By locating the compact gearless motor directly inside the hoistway, MRL elevators free up premium penthouse spaces.",
        features: ["Eco-friendly energy consumption", "No separate machine room required", "Sleek gearless traction design"],
        image: "mrl"
      },
      {
        id: "automobile",
        title: "Automobile Elevators",
        description: "Heavy-duty transit systems designed for luxury penthouses and car collectors.",
        longDescription: "Engineered with dual operating panels and infrared positioning beams to transport luxury vehicles between floors.",
        features: ["Wide profile cabins", "Precision positioning guidance", "Reinforced double-deck structures"],
        image: "automobile"
      },
      {
        id: "escalators",
        title: "Escalators",
        description: "Continuous vertical transit systems built for retail and transit hubs.",
        longDescription: "Quiet mechanical walkways and escalators designed with step-chain sensors and automated speed governors.",
        features: ["Smart standby energy-saver mode", "LED step guidance lighting", "Intelligent wear detectors"],
        image: "escalators"
      },
    ] as ProductItem[],
  },
  services: {
    title: "Engineering Services Lifecycle",
    subtitle: "Our Services",
    items: [
      {
        id: "installation",
        title: "Precision Installation",
        description: "Seamless on-site integration using state-of-the-art laser alignment systems for absolute vertical precision.",
        icon: "Wrench"
      },
      {
        id: "maintenance",
        title: "Predictive Maintenance",
        description: "Regular diagnostics and telemetry monitoring to keep mechanisms functioning perfectly before wear occurs.",
        icon: "ShieldAlert"
      },
      {
        id: "amc",
        title: "Premium AMC Services",
        description: "All-inclusive Annual Maintenance Contracts covering certified spare parts, routine inspections, and priority support.",
        icon: "Briefcase"
      },
      {
        id: "modernization",
        title: "Modernization & Upgrades",
        description: "Transform outdated mechanical systems into advanced, silent gearless platforms with contemporary luxury cabin styles.",
        icon: "Activity"
      },
      {
        id: "repair",
        title: "Rapid Mechanical Repair",
        description: "Immediate corrective action using original equipment manufacturer (OEM) parts to minimize downtime.",
        icon: "Settings"
      },
      {
        id: "emergency",
        title: "24/7 Emergency Support",
        description: "Dedicated emergency dispatcher line and quick-response technician dispatch, operating 365 days a year.",
        icon: "PhoneCall"
      },
    ] as ServiceItem[],
  },
  whyChooseUs: {
    title: "The Pillars of E Tech Engineering",
    subtitle: "Why Choose Us",
    items: [
      {
        id: "tech",
        title: "Latest German Technology",
        description: "Gearless PMSM machines, regenerative energy drives, and micro-processor telemetry boards.",
        iconName: "Cpu"
      },
      {
        id: "engineers",
        title: "Certified Engineers",
        description: "Every technician is extensively certified under European safety regulations and mechanical codes.",
        iconName: "Award"
      },
      {
        id: "materials",
        title: "Premium Materials Only",
        description: "We use high-grade 304/316 stainless steel, structural carbon glass, and custom luxury metals.",
        iconName: "Layers"
      },
      {
        id: "installation",
        title: "Fast & Precise Installation",
        description: "Standardized assembly workflows and digital scheduling ensure on-time project deliveries.",
        iconName: "Zap"
      },
      {
        id: "safety",
        title: "Absolute Safety Standards",
        description: "Triple safety redundancy system including rope brake governors, buffers, and battery rescues.",
        iconName: "ShieldCheck"
      },
      {
        id: "support",
        title: "24x7 Critical Support",
        description: "Direct access to mechanical engineers and rapid deployment crews around the clock.",
        iconName: "Headphones"
      },
      {
        id: "custom",
        title: "Fully Customized Solutions",
        description: "From curved glass capsules to invisible residential shafts, we build what standard companies cannot.",
        iconName: "Sliders"
      },
    ] as WhyItem[],
  },
  projects: {
    title: "Featured Architectural Journeys",
    subtitle: "Our Projects",
    categories: ["All", "Residential", "Commercial", "Hospitality", "Medical"],
    items: [
      {
        id: "p1",
        title: "The Lumina Penthouse Capsule",
        category: "Residential",
        location: "Mumbai, MH",
        image: "p1"
      },
      {
        id: "p2",
        title: "Aura Premium Commercial Hub",
        category: "Commercial",
        location: "Bangalore, KA",
        image: "p2"
      },
      {
        id: "p3",
        title: "Grand Regent Architectural Glass Lift",
        category: "Hospitality",
        location: "New Delhi, DL",
        image: "p3"
      },
      {
        id: "p4",
        title: "Medipath Care Bed Elevators",
        category: "Medical",
        location: "Pune, MH",
        image: "p4"
      },
      {
        id: "p5",
        title: "Zenith Tower MRL Fleet",
        category: "Commercial",
        location: "Hyderabad, TS",
        image: "p5"
      },
      {
        id: "p6",
        title: "Seaside Villa Bespoke Home Lift",
        category: "Residential",
        location: "Goa, GA",
        image: "p6"
      },
    ] as ProjectItem[],
  },
  contact: {
    title: "Let's Build Your Next Vertical Journey",
    subtitle: "Contact Us",
    description: "Begin a consultation with our structural engineers. Discover how E Tech Elevators can integrate seamless safety and luxury into your layout.",
    ctaLabel: "Send Design Brief",
    info: {
      address: "E Tech Elevators, Corporate Towers, Level 14, MG Road, Bangalore, India",
      phone: "+91 (80) 4900 1200",
      email: "engineering@e-techelevators.com",
      hours: "Mon - Sat: 9:00 AM - 6:30 PM",
      emergencyPhone: "+91 99000 88000 (24/7 Helpline)",
    },
    googleMapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.028773950858!2d77.6083049112933!3d12.970058287291419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167e766e4a2d%3A0xe5eb6c433383a152!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin",
  },
  footer: {
    disclaimer: "© 2026 E Tech Elevators. All Rights Reserved. Engineered to premium architectural standards.",
    tagline: "Uncompromising safety, silent engineering, and timeless design.",
    socials: [
      { name: "LinkedIn", href: "https://linkedin.com" },
      { name: "Instagram", href: "https://instagram.com" },
      { name: "Vimeo", href: "https://vimeo.com" },
      { name: "Pinterest", href: "https://pinterest.com" },
    ],
  },
};
