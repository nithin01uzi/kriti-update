import { FlaskConical, Boxes, Gauge, Users, Database, TrendingUp, Cloud, Headset, Rocket, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

/** Put image files in /public/images and list their paths here (or use the Upload button on any slot while running). */
export const IMAGES: Record<string, string> = { about: "" };
export const CONTACT = {
  web: "www.kritilims.in",
  emails: ["info@kritisoft.com", "kritisoft@gmail.com"],
  offices: [
    { tag: "India · Trivandrum", name: "KRITI Microsystems", address: ["T.C- 9/2205, Sreelane 2,", "Sasthamangalam,", "Trivandrum - 695010", "Kerala, India"], phones: ["+91 471 2724453"] },
    { tag: "Development Center", name: "ASMAN Park", address: ["Pallinada, Opp. Technopark,", "Trivandrum - 695 582,", "Kerala, India"], phones: ["+91 6282309348", "+91 9446045233", "+91 8714523679"] },
    { tag: "USA", name: "Kritisoft LLC", address: ["1241 Summer Blossom Avenue,", "San Jose, CA, 95122"], phones: ["+1 559 709 2423"] },
  ],
};

/** Hero slideshow: put photos in /public/images and edit the paths. Missing files fall back to the built-in illustration. */
export const HERO_SLIDES = [
  { src: "/images/hero-1.jpg", title: "Sample-to-report, fully automated", text: "Track every sample, test, result and invoice in one cloud LIMS." },
  { src: "/images/hero-2.jpg", title: "Built for ISO 17025 laboratories", text: "Audit trails, compliance and traceability across every workflow." },
  { src: "/images/hero-3.jpg", title: "Live in as little as three days", text: "Rapid cloud deployment backed by 24x7 technical support." },
];

export const NAV = ["About", "Products", "Divisions", "Solutions", "Clients", "Contact"];
export const STATS = [
  { to: 2000, suffix: "", label: "Established" },
  { to: 100, suffix: "+", label: "Man-years of expertise" },
  { to: 3, suffix: " days", label: "Cloud go-live" },
  { to: 24, suffix: "x7", label: "Technical support" },
];
export const CERTS = [["ISO 9001:2015", "Quality Management Systems"], ["ISO 27001:2018", "Information Security Management"], ["ISO 17025:2017", "Accredited-lab ready LIMS"]];

export const PRODUCTS: { icon: ReactNode; name: string; text: string }[] = [
  { icon: <FlaskConical />, name: "Laboratory Information Management System", text: "Kriti Smart LIMS: cloud-based, configurable, built on a robust open-source platform." },
  { icon: <Boxes />, name: "Materials & Inventory Management", text: "Materials & asset management across the laboratory." },
  { icon: <Gauge />, name: "Instrument & Calibration Management", text: "Calibration monitoring and instrument tracking with uncertainty factors." },
  { icon: <Users />, name: "Customer Portal", text: "Interactive customer portal design for requests, status and reports." },
  { icon: <Database />, name: "Scientific Data Management System", text: "SDMS integrated with laboratory instruments and data acquisition." },
  { icon: <TrendingUp />, name: "Business Development Management System", text: "CRM and business development workflows for laboratories." },
];

export const DIVISIONS = [
  { icon: <FlaskConical />, name: "LIMS Software Projects", intro: "Design, customization and implementation of LIMS across diverse industry domains, combining domain expertise, technology proficiency and project management.",
    items: ["Project Implementation: End-to-end deployment of LIMS for laboratories across industries.", "Customization & Integration: Tailored workflows, integrated with ERP, SAP and third-party applications.", "Cloud & On-Premise Solutions: Secure, scalable architecture for both deployments.", "Regulatory Compliance: ISO 17025:2017, GLP and ISO 15189.", "Training & Support: User training, knowledge transfer and dedicated support.", "Global Project Delivery: Corporate, government and commercial testing organizations worldwide."],
    value: "Laboratories achieve digital transformation, efficiency and compliance through robust project execution and a customer-centric approach." },
  { icon: <Cloud />, name: "Cloud & IT Infrastructure", intro: "Robust, scalable and secure IT infrastructure for cloud-based and on-premise deployments, tailored to customer needs.",
    items: ["Cloud Services: Design, deployment and management of public, private and hybrid cloud.", "IT Infrastructure Management: Servers, networks, storage and virtualization.", "Deployment & Migration: Cloud migration, application hosting and modernization.", "Security & Compliance: Information security frameworks and data protection.", "Business Continuity & DR: Disaster recovery, backup and high-availability design.", "Managed Services: Monitoring, performance optimization and technical support."],
    value: "High availability, efficiency and security, with cost-effective, future-ready infrastructure aligned to business goals." },
  { icon: <Headset />, name: "Customer Service & Support", intro: "The primary interface for customer engagement, addressing technical, functional and operational requirements through proactive support.",
    items: ["Helpdesk & Ticket Management: Central logging, tracking and resolution of issues.", "Remote & On-Site Support: Flexible models to respond quickly.", "Service Level Management: Response and resolution aligned with agreed SLAs.", "Product Updates & Enhancements: Upgrades, patches and new feature rollouts.", "Customer Training & Knowledge Sharing: Programs, documentation and user guidance.", "Feedback & Continuous Improvement: Customer feedback drives enhancements."],
    value: "Customer satisfaction, reliability and trust, building long-term relationships through partnership." },
  { icon: <Rocket />, name: "Marketing & Implementation", intro: "Bridges customer requirements with technology, promoting LIMS, understanding client needs and ensuring successful adoption.",
    items: ["Market Development & Outreach: Presentations, proposals and client engagements globally.", "Requirement Analysis: Capturing business processes, workflows and domain needs.", "Implementation & Deployment: End-to-end, cloud and on-premise.", "User Training & Adoption: Workshops and user guidance.", "Post-Implementation Support: Smooth transition to long-term maintenance.", "Global Client Engagement: Corporates, public sector and government laboratories."],
    value: "Maximum value from Kritisoft's LIMS with a focus on satisfaction, compliance and digital transformation." },
];

export const CONSULT = ["Selection and sizing of infrastructure", "Deployment of resources", "Software evaluation and selection", "Implementation scheduling", "Human resource development", "Calibration monitoring", "Materials & asset management", "Interactive customer portal design"];

export const SOLUTIONS = [
  { id: "food", img: "/images/food-testing.jpg", name: "Food Testing", count: "100+ labs", blurb: "Web-based, highly configurable LIMS for food and beverages testing laboratories, with end-to-end workflow automation.",
    feats: ["Sample tracking and testing", "Quality control and R&D", "Test result printing and report generation", "Invoicing, statements and MIS reports", "Packaged foods, produce, feeds, seafood, grains, pulses, beverages, supplements, meat", "Physical, chemical, microbiological, PFA, pesticide residue and toxic parameters"] },
  { id: "commercial", img: "/images/commercial-testing.jpg", name: "Commercial Testing", count: "150+ labs", blurb: "End-to-end LIMS for commercial analytical labs: sample intake, testing, QC, R&D, results, reports and revenue accounting, managing Turn Around Time.",
    feats: ["Sample lifecycle control, audit trails, ISO 17025, CFR 21, GLP", "Centralized or distributed lab networks, multilingual, cloud or on-premise", "Integrated CRM, inventory and MIS dashboards; Excel, PDF, HTML export", "Rapid go-live: as little as three working days on cloud", "Modules for Environmental, Food, Calibration and Civil Engineering materials"] },
  { id: "textiles", img: "/images/textiles-testing.jpg", name: "Textiles Testing", count: "60+ labs", blurb: "Fully cloud-based LIMS for textiles, garments, fiber, yarn, cotton, silk, jute, coir, chemicals and dyes laboratories.",
    feats: ["Total workflow automation from sampling to billing and MIS", "Physical, chemical, microbiological and mechanical testing", "Ecological & safety: aryl amines, pesticide residues, toxic substances", "Resource-based configuration around equipment and personnel", "Traceability, accuracy and compliance across all testing"] },
  { id: "environment", img: "/images/environment-testing.jpg", name: "Environment Testing", count: "65+ labs", blurb: "Fully web-based LIMS for environmental testing: air, water, solid waste, sludge, wastewater and noise.",
    feats: ["Sample tracking, testing, QC, R&D, reports, invoicing and MIS", "For utility providers and commercial monitoring laboratories", "Physical, chemical, microbiological, pesticide and toxic parameters", "Detailed reports, dashboards and statements", "Scalable for commercial and in-house laboratories"] },
  { id: "calibration", img: "/images/calibration-testing.jpg", name: "Calibration", count: "Calibration Version", blurb: "Cloud-based LIMS for calibration laboratories, managing assets and instruments and deriving uncertainty factors.",
    feats: ["Physical & mechanical: mass, dimensions, force, hardness, pressure, vacuum, temperature, humidity", "Electrical & electronic: AC/DC voltage and current, impedance, power & energy, microwave", "Acoustic & vibration: ultrasonic, vibration, environmental measurements", "Specialized tests: nanoscale, optical radiation, insulation resistance, motor tests", "Certificates, statements and customer asset follow-up"] },
];

export const CLIENTS = [
  ["Export Inspection Agency Laboratories", "Kochi, Mumbai, Kolkata, Chennai, Delhi & more", "http://eicindia.gov.in"],
  ["Envirocare Laboratories Pvt. Ltd.", "Thane", "https://www.envirocare.co.in"],
  ["NCML Ltd.", "Mumbai", "http://www.ncml.com"],
  ["National Food Lab", "Chennai", ""],
  ["Mewaholeo Industries Sdn. Bhd.", "Johor, Malaysia", "https://mewahgroup.com"],
  ["Lonestar Alpha Laboratories", "Muscat", "https://www.lonestaralpha.com"],
  ["TUV India Private Limited", "Mumbai", "https://www.tuv-nord.com/in/en/home/"],
  ["Ashwamedh Laboratories", "Nashik", "https://ashwamedh.net/"],
  ["Page Industries (Jockey India)", "Hassan", "http://www.jockey.in"],
  ["SASMIRA", "Mumbai", "http://www.sasmira.org"],
  ["Reliance Retail Limited", "Surat", ""],
  ["Aditya Birla Fashions & Lifestyle", "Bangalore", "https://www.adityabirla.com"],
  ["Testtex India Laboratories", "Mumbai", "http://www.testtex.com"],
  ["Neyveli Lignite Corporation", "Tamil Nadu", "https://www.nlcindia.in"],
  ["FHHL Private Limited", "Pune", "https://fhhl.in/"],
  ["Maarc Laboratories", "Pune", ""],
  ["Kerala State Pollution Control Board", "Ernakulam", "https://keralapcbonline.com"],
  ["NAPESCO", "Kuwait", "http://www.napesco.com"],
  ["Qualitas Material Testing Lab", "Abu Dhabi", "https://www.qualitasme.com"],
  ["ACE Laboratories", "Dubai", "https://acelab.me"],
  ["CMTI", "Bangalore", "https://cmti.res.in"],
  ["Larsen & Toubro, Construction", "Chennai", "https://www.lntecc.com"],
  ["IAPMO", "Bangalore & Indonesia", "https://iapmoindonesia.org"],
];
export { ShieldCheck };

/** Contact form delivery via Web3Forms: get a free access key at https://web3forms.com (enter the email that should receive enquiries),
 *  then paste it into accessKey. Leave "" to fall back to the visitor's email app. */
export const FORM = { endpoint: "https://api.web3forms.com/submit", accessKey: "", site: "www.cloudlims.in" };