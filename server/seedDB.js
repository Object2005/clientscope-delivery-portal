const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Client = require('./models/Client');
const Project = require('./models/Project');

const initialUsers = [
  {
    name: "Aashray Narang",
    email: "admin@75way.com",
    password: "$2a$10$X87XvL7Uf0d14U/n0aTffOx1Q5015gUfxlVn0F7Yl7i10yLwM8EKe", // admin123
    role: "admin",
  },
  {
    name: "John Miller",
    email: "pm@75way.com",
    password: "$2a$10$X87XvL7Uf0d14U/n0aTffOx1Q5015gUfxlVn0F7Yl7i10yLwM8EKe", // admin123
    role: "manager",
  }
];

const initialClients = [
  {
    name: "David Vance",
    company: "Apex Global FinTech",
    country: "United States",
    email: "david@apexfintech.io",
    phone: "+1 (555) 234-8901",
    status: "active",
  },
  {
    name: "Sarah Lindqvist",
    company: "Nordic Health AI",
    country: "Sweden",
    email: "sarah@nordichealth.se",
    phone: "+46 8 123 4567",
    status: "active",
  },
  {
    name: "Liam O'Connor",
    company: "Dublin Logistics Cloud",
    country: "Ireland",
    email: "liam@dublinlogistics.ie",
    phone: "+353 1 496 0000",
    status: "active",
  }
];

const initialProjects = [
  {
    title: "AI Mobile Banking Application",
    description: "Next-gen FinTech application with biometric auth, real-time FX currency exchange, and AI spend categorization.",
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
    ]
  },
  {
    title: "Clinical AI Diagnostics Web Portal",
    description: "Cloud-native DICOM medical imaging viewer, HL7/FHIR compliance integration, and radiologist automated reporting pipeline.",
    clientName: "Nordic Health AI",
    clientCountry: "Sweden",
    budget: 24000,
    currency: "USD",
    status: "in-progress",
    startDate: "2026-03-25",
    deadline: "2026-12-15",
    milestones: [
      {
        id: "m_201",
        title: "Cloud Infrastructure Setup (HIPAA & GDPR)",
        amount: 5000,
        deadline: "2026-05-01",
        status: "completed"
      },
      {
        id: "m_202",
        title: "DICOM 3D Web Viewer & GPU Inference Pipeline",
        amount: 9000,
        deadline: "2026-08-15",
        status: "completed"
      },
      {
        id: "m_203",
        title: "EHR / Hospital System Interoperability Gateway",
        amount: 6000,
        deadline: "2026-10-30",
        status: "in-progress"
      },
      {
        id: "m_204",
        title: "EU MDR Medical Device Compliance Validation",
        amount: 4000,
        deadline: "2026-12-15",
        status: "pending"
      }
    ]
  },
  {
    title: "IoT Fleet Telematics & Route Optimization",
    description: "High-throughput telemetry ingestion platform for 5,000+ European refrigerated freight carriers with sub-second alert triggers.",
    clientName: "Dublin Logistics Cloud",
    clientCountry: "Ireland",
    budget: 14000,
    currency: "USD",
    status: "in-progress",
    startDate: "2026-04-10",
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
    ]
  }
];

const seedDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGODB_URI is not set in environment or .env file.');
    console.log('ℹ️  Please set MONGODB_URI in server/.env and run again.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.');

    console.log('🧹 Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Project.deleteMany({})
    ]);

    console.log('🌱 Seeding Users...');
    await User.insertMany(initialUsers);

    console.log('🌱 Seeding Clients...');
    const createdClients = await Client.insertMany(initialClients);

    console.log('🌱 Seeding Projects...');
    // Link clients by ID if matching
    const projectsToInsert = initialProjects.map((proj, idx) => ({
      ...proj,
      client: createdClients[idx] ? createdClients[idx]._id : undefined
    }));
    await Project.insertMany(projectsToInsert);

    console.log('\n🎉 SUCCESS! MongoDB Database successfully seeded with:');
    console.log(` - ${initialUsers.length} Users`);
    console.log(` - ${createdClients.length} Clients`);
    console.log(` - ${initialProjects.length} Projects`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedDB();
