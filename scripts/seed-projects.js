/**
 * Seed Script: Add projects directly to MongoDB
 * 
 * Usage:
 * node scripts/seed-projects.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Project Schema
const ProjectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  liveUrl: { type: String },
  githubUrl: { type: String },
  image: { type: String },
  stack: [{ type: String }],
  tags: [{ type: String }],
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// Projects to seed
const projectsToSeed = [
  {
    title: "CofeeBooks - Online Bookstore",
    slug: "cofeebooks-online-bookstore",
    summary: "A modern online bookstore platform for browsing and purchasing books. Features a clean design with book categories, search functionality, and shopping cart.",
    content: `# CofeeBooks - Online Bookstore

A comprehensive e-commerce platform for book lovers.

## Features
- Book catalog with categories
- Search and filter functionality
- Shopping cart system
- User-friendly interface
- Responsive design
- Book details and descriptions`,
    date: new Date("2024-11-15"),
    category: "E-Commerce",
    featured: true,
    liveUrl: "https://cofeebooks.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["E-Commerce", "Bookstore", "Online Shopping", "Responsive"]
  },
  {
    title: "Al-Attar Herbal Store",
    slug: "al-attar-herbal-store",
    summary: "An elegant e-commerce platform for herbal and natural products. Features Arabic/English support, product catalog, and beautiful traditional design.",
    content: `# Al-Attar Herbal Store

A specialized e-commerce platform for herbal and natural remedies.

## Features
- Bilingual support (Arabic/English)
- Product categories for herbs and remedies
- Traditional elegant design
- Product search and filtering
- Mobile responsive layout
- Shopping cart functionality`,
    date: new Date("2024-10-20"),
    category: "E-Commerce",
    featured: true,
    liveUrl: "https://al-attar.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["E-Commerce", "Herbal", "Bilingual", "Arabic"]
  },
  {
    title: "Noor Islamic Library",
    slug: "noor-islamic-library",
    summary: "A digital Islamic library platform featuring Quran, Hadith, and Islamic books. Beautiful spiritual design with dark theme and easy navigation.",
    content: `# Noor Islamic Library

A comprehensive digital Islamic resource platform.

## Features
- Quran reading and listening
- Hadith collections
- Islamic books library
- Beautiful spiritual design
- Dark theme optimized
- Search functionality
- Mobile responsive`,
    date: new Date("2024-10-05"),
    category: "Education",
    featured: true,
    liveUrl: "https://noor-islamic-library.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["Islamic", "Library", "Education", "Quran", "Digital Library"]
  },
  {
    title: "MeNs Fashion Store",
    slug: "mens-fashion-store",
    summary: "A modern men's fashion e-commerce platform. Features trendy clothing collections, size guides, and a sleek shopping experience.",
    content: `# MeNs Fashion Store

A stylish e-commerce platform for men's fashion.

## Features
- Clothing catalog with categories
- Size guides and recommendations
- Shopping cart and wishlist
- Modern clean design
- Product filtering and search
- Mobile optimized layout`,
    date: new Date("2024-09-25"),
    category: "E-Commerce",
    featured: true,
    liveUrl: "https://me-ns-fashion-store.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["E-Commerce", "Fashion", "Clothing", "Men's Wear"]
  },
  {
    title: "Perfume Order Store",
    slug: "perfume-order-store",
    summary: "An elegant perfume e-commerce platform. Features luxury fragrance collections, detailed scent descriptions, and a premium shopping experience.",
    content: `# Perfume Order Store

A luxury e-commerce platform for premium fragrances.

## Features
- Perfume catalog with brands
- Detailed scent descriptions
- Premium elegant design
- Shopping cart system
- Product filtering
- Gift options
- Mobile responsive`,
    date: new Date("2024-09-18"),
    category: "E-Commerce",
    featured: true,
    liveUrl: "https://perfume-order-store.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["E-Commerce", "Perfume", "Luxury", "Fragrance"]
  },
  {
    title: "Koutob Library",
    slug: "koutob-library",
    summary: "A digital library platform for Arabic books and literature. Features a vast collection of books with categories, search, and reading features.",
    content: `# Koutob Library

A comprehensive Arabic digital library platform.

## Features
- Arabic book collections
- Category organization
- Search functionality
- Book reading interface
- User-friendly design
- Mobile responsive
- Dark/Light themes`,
    date: new Date("2024-09-12"),
    category: "Education",
    featured: true,
    liveUrl: "https://koutob-library-wrga.vercel.app/",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    tags: ["Library", "Arabic", "Books", "Education", "Digital"]
  },
  {
    title: "Sales System Dashboard",
    slug: "sales-system-dashboard",
    summary: "A comprehensive sales management dashboard with authentication. Features real-time analytics, sales tracking, inventory management, and detailed reporting.",
    content: `# Sales System Dashboard

A full-featured sales management system with admin dashboard.

## Features
- Secure login authentication
- Sales analytics and reporting
- Inventory management
- Customer tracking
- Real-time dashboard
- Data visualization
- User role management`,
    date: new Date("2024-09-05"),
    category: "Web Development",
    featured: true,
    liveUrl: "https://sales-system-doshboard.vercel.app/login",
    githubUrl: "",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "MongoDB"],
    tags: ["Dashboard", "Admin Panel", "Sales", "Analytics", "Authentication"]
  }
];

async function seedProjects() {
  console.log('🌱 Starting project seeding...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0;
    let skipped = 0;

    for (const project of projectsToSeed) {
      try {
        const existing = await Project.findOne({ slug: project.slug });
        
        if (existing) {
          console.log(`⏭️  Skipping "${project.title}" (already exists)`);
          skipped++;
          continue;
        }

        await Project.create(project);
        console.log(`✅ Added: "${project.title}"`);
        added++;
      } catch (error) {
        console.error(`❌ Failed to add "${project.title}":`, error.message);
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${projectsToSeed.length}`);
    console.log('\n🎉 Seeding complete!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedProjects();
