// In-memory fallback and seed data store
// Ensures seamless out-of-the-box execution even if MongoDB is not locally running!

let users = [
  {
    _id: "usr_1",
    name: "Aashray Narang",
    email: "admin@75way.com",
    // hashed version of 'admin123'
    password: "$2a$10$X87XvL7Uf0d14U/n0aTffOx1Q5015gUfxlVn0F7Yl7i10yLwM8EKe",
    role: "admin",
    createdAt: new Date("2026-01-10")
  },
  {
    _id: "usr_2",
    name: "John Miller",
    email: "pm@75way.com",
    password: "$2a$10$X87XvL7Uf0d14U/n0aTffOx1Q5015gUfxlVn0F7Yl7i10yLwM8EKe",
    role: "manager",
    createdAt: new Date("2026-02-01")
  }
];

let clients = [
  {
    _id: "cl_1",
    name: "David Vance",
    company: "Apex Global FinTech",
    country: "United States",
    email: "david@apexfintech.io",
    phone: "+1 (555) 234-8901",
    status: "active",
    createdAt: new Date("2026-03-01")
  },
  {
    _id: "cl_2",
    name: "Sarah Lindqvist",
    company: "Nordic Health AI",
    country: "Sweden",
    email: "sarah@nordichealth.se",
    phone: "+46 8 123 4567",
    status: "active",
    createdAt: new Date("2026-03-15")
  },
  {
    _id: "cl_3",
    name: "Liam O'Connor",
    company: "Dublin Logistics Cloud",
    country: "Ireland",
    email: "liam@dublinlogistics.ie",
    phone: "+353 1 496 0000",
    status: "active",
    createdAt: new Date("2026-04-05")
  }
];

let projects = [
  {
    _id: "proj_1",
    title: "AI Mobile Banking Application",
    description: "Next-gen FinTech application with biometric auth, real-time FX currency exchange, and AI spend categorization.",
    client: "cl_1",
    clientName: "Apex Global FinTech",
    clientCountry: "United States",
    budget: 18500,
    currency: "USD",
    status: "in-progress",
    startDate: "2026-03-10",
    deadline: "2026-11-30",
    milestones: [
      {
        id: "m_101",
        title: "Architecture & Figma UI/UX System",
        amount: 4500,
        deadline: "2026-04-15",
        status: "completed"
      },
      {
        id: "m_102",
        title: "Node.js Core Microservices & Banking APIs",
        amount: 6500,
        deadline: "2026-07-20",
        status: "completed"
      },
      {
        id: "m_103",
        title: "React Native Mobile App & Biometric Flow",
        amount: 5000,
        deadline: "2026-09-30",
        status: "in-progress"
      },
      {
        id: "m_104",
        title: "Security Penetration Audit & Production Deployment",
        amount: 2500,
        deadline: "2026-11-30",
        status: "pending"
      }
    ],
    createdAt: new Date("2026-03-10")
  },
  {
    _id: "proj_2",
    title: "Telemedicine Video Consultation Suite",
    description: "HIPAA-compliant WebRTC audio/video consultations, automated prescription generation, and appointment scheduler.",
    client: "cl_2",
    clientName: "Nordic Health AI",
    clientCountry: "Sweden",
    budget: 24000,
    currency: "USD",
    status: "in-progress",
    startDate: "2026-04-01",
    deadline: "2026-12-15",
    milestones: [
      {
        id: "m_201",
        title: "EHR Integration & Medical Data Compliance Schema",
        amount: 6000,
        deadline: "2026-05-15",
        status: "completed"
      },
      {
        id: "m_202",
        title: "WebRTC Video/Audio Consultation Engine",
        amount: 9000,
        deadline: "2026-08-30",
        status: "in-progress"
      },
      {
        id: "m_203",
        title: "Doctor Dashboard, Prescription PDF & Patient Portal",
        amount: 9000,
        deadline: "2026-12-15",
        status: "pending"
      }
    ],
    createdAt: new Date("2026-04-01")
  },
  {
    _id: "proj_3",
    title: "IoT Fleet Telematics & Route Optimization",
    description: "Real-time GPS vehicle tracking with geofencing, fuel consumption analysis, and driver behavior reports.",
    client: "cl_3",
    clientName: "Dublin Logistics Cloud",
    clientCountry: "Ireland",
    budget: 14000,
    currency: "USD",
    status: "in-review",
    startDate: "2026-05-01",
    deadline: "2026-10-15",
    milestones: [
      {
        id: "m_301",
        title: "MQTT Broker & GPS Sensor Ingestion Pipeline",
        amount: 4500,
        deadline: "2026-06-30",
        status: "completed"
      },
      {
        id: "m_302",
        title: "Live Map Clustering Dashboard (Mapbox)",
        amount: 5500,
        deadline: "2026-08-25",
        status: "completed"
      },
      {
        id: "m_303",
        title: "Client Acceptance Testing & Fleet Dispatch Sign-off",
        amount: 4000,
        deadline: "2026-10-15",
        status: "in-progress"
      }
    ],
    createdAt: new Date("2026-05-01")
  }
];

module.exports = {
  users,
  clients,
  projects
};
