export const homeContent = {
  hero: {
    badge: "Verified Rescue Coordination",
    headline: "Help Street Animals Get Help Faster",
    subheadline:
      "Report injured, abandoned, or distressed animals nearby. We connect your report with verified rescuers, NGOs, and volunteers.",
    primaryCta: { label: "Report an Animal", href: "/dashboard/report" },
    secondaryCta: { label: "Track My Report", href: "/dashboard/track" },
    trustLine: "Privacy protected reporting with community-led follow-up.",
    floatingCards: {
      response: { label: "Real-time Rescue Coordination", value: "Live" },
      activity: { label: "Case tracking updates", value: "Enabled" },
      location: "Location-enabled response",
    },
  },
  features: [
    {
      title: "Verified NGO Network",
      desc: "Reports are shared with verified organizations and trained responders.",
    },
    {
      title: "Real-time Rescue Coordination",
      desc: "Teams receive structured case details to coordinate faster on urgent rescues.",
    },
    {
      title: "Privacy Protected Reports",
      desc: "Sensitive user details are protected while teams still get the context they need.",
    },
    {
      title: "Community Volunteer Support",
      desc: "Volunteers can assist with transport, local guidance, and case follow-ups.",
    },
    {
      title: "Location Enabled Response",
      desc: "Shared location helps responders prioritize and navigate to the reported case.",
    },
    {
      title: "Track Case Progress Live",
      desc: "Follow status updates from report submission to case closure.",
    },
  ],
  partnerHeading: "Open for NGO registrations",
  partnerCards: ["Partner NGOs coming soon", "Apply as an NGO", "Volunteer Network"],
  testimonials: [
    "Easy to use during an emergency. Report reached volunteers quickly.",
    "Clear updates helped us coordinate support without confusion.",
    "Reporting was simple, and the response team followed up responsibly.",
  ],
  cta: {
    headline: "Be the reason help arrives on time.",
    subheadline:
      "Whether you report, volunteer, or coordinate, every reliable action helps an animal in distress.",
  },
};

export const chatbotContent = {
  title: "Rescue Guide",
  status: "Online",
  welcome: "Hi, I am your Rescue Guide. Tell me what happened and I will help with safe next steps.",
  prompts: [
    "How do I help an injured dog?",
    "What should I do if an animal is bleeding?",
    "Find nearby rescue help",
    "Track my report status",
  ],
  fallback:
    "Thanks for sharing this. If the case is urgent, use Emergency to report immediately and alert responders.",
};

export const emergencyContent = {
  title: "Animal in Distress?",
  subtitle: "Choose the quickest way to request help.",
  items: [
    { title: "Report Emergency", desc: "Submit a priority rescue report for quick routing.", href: "/dashboard/report" },
    { title: "Call Helpline", desc: "Speak with a rescue coordinator.", href: "mailto:support@resqpaws.org" },
    { title: "First Aid Guidance", desc: "Get immediate care guidance while help is on the way.", href: "#first-aid" },
    { title: "Find NGO Support", desc: "View verified organizations and response partners.", href: "/ngo/map" },
  ],
};

export const footerContent = {
  blurb: "Built to make streets safer for animals.",
  contact: "support@resqpaws.org",
};
