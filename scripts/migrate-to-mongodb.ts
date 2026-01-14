/**
 * Migration Script: JSON to MongoDB
 * 
 * This script migrates existing projects from the JSON file to MongoDB.
 * 
 * Usage:
 * 1. Make sure MONGODB_URI is set in your .env.local file
 * 2. Run: npx ts-node --skip-project scripts/migrate-to-mongodb.ts
 * 
 * Or add to package.json scripts:
 * "migrate": "ts-node --skip-project scripts/migrate-to-mongodb.ts"
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Project Schema (inline for migration script)
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

async function migrate() {
  console.log('🚀 Starting migration...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Read existing projects from JSON
    const jsonPath = path.join(process.cwd(), 'data', 'projects.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('ℹ️  No projects.json file found. Nothing to migrate.');
      process.exit(0);
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const projects = JSON.parse(jsonData);

    if (!Array.isArray(projects) || projects.length === 0) {
      console.log('ℹ️  No projects found in JSON file. Nothing to migrate.');
      process.exit(0);
    }

    console.log(`📦 Found ${projects.length} projects to migrate`);

    // Migrate each project
    let migrated = 0;
    let skipped = 0;

    for (const project of projects) {
      try {
        // Check if project already exists
        const existing = await Project.findOne({ slug: project.slug });
        
        if (existing) {
          console.log(`⏭️  Skipping "${project.title}" (already exists)`);
          skipped++;
          continue;
        }

        // Create new project
        await Project.create({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          content: project.content,
          date: new Date(project.date),
          category: project.category || 'Web Development',
          featured: project.featured || false,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          image: project.image,
          stack: project.stack || [],
          tags: project.tags || [],
        });

        console.log(`✅ Migrated: "${project.title}"`);
        migrated++;
      } catch (error: any) {
        console.error(`❌ Failed to migrate "${project.title}":`, error.message);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${projects.length}`);

    // Optionally backup and rename the JSON file
    if (migrated > 0) {
      const backupPath = jsonPath.replace('.json', '.backup.json');
      fs.copyFileSync(jsonPath, backupPath);
      console.log(`\n💾 Backup created: ${backupPath}`);
    }

    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

migrate();
