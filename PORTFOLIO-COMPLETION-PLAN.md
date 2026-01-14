# 🚀 Portfolio Completion Plan
## Full-Stack Portfolio with Next.js + MongoDB Atlas + Vercel Deployment

**Owner:** Garali Abdesslem  
**Date:** January 14, 2026  
**Goal:** Complete a professional, fully-functional portfolio with backend & admin panel

---

## ✅ IMPLEMENTATION STATUS: COMPLETED!

All core phases have been implemented:

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | MongoDB Atlas Integration | ✅ DONE |
| Phase 2 | Cloudinary Image Storage | ✅ DONE |
| Phase 3 | NextAuth.js Authentication | ✅ DONE |
| Phase 4 | Enhanced Admin Dashboard | ✅ DONE |
| Phase 5 | Contact Form + Email (Resend) | ✅ DONE |

### What Was Built:
- ✅ MongoDB connection utility (`src/lib/mongodb.ts`)
- ✅ Mongoose models (Project, User, Message, Settings)
- ✅ All API routes updated to use MongoDB
- ✅ Cloudinary upload utility (`src/lib/cloudinary.ts`)
- ✅ Image upload with cloud storage fallback
- ✅ NextAuth.js authentication system
- ✅ Admin login page with setup flow
- ✅ Protected routes middleware
- ✅ Enhanced admin dashboard with stats
- ✅ Messages management page
- ✅ Settings management page
- ✅ Contact form with email notifications (Resend)
- ✅ Spam protection for contact form

---

## 🗄️ Database Choice: MongoDB Atlas

```
✅ SELECTED: MongoDB Atlas
├── Cost: FREE (512 MB storage)
├── Pros: Flexible schema, great for JSON data, easy setup
├── Driver: Mongoose (ODM for MongoDB)
└── Works perfectly with Vercel
```

---

## 📊 Current State Analysis

### ✅ Already Complete
- [x] Home page with hero section
- [x] About page with skills
- [x] Projects page with filtering
- [x] Project detail pages
- [x] Contact page UI
- [x] Basic admin panel
- [x] Dark/light theme
- [x] Responsive design
- [x] Framer Motion animations

### ⚠️ Needs Improvement
- [ ] Data persistence (currently JSON file - resets on deploy)
- [ ] Contact form (currently simulated)
- [ ] Admin authentication (basic - needs security)
- [ ] Image storage (local files - won't persist)
- [ ] Admin dashboard (needs more features)

---

## 🎯 Phase 1: MongoDB Atlas Setup (Priority: HIGH)
**Goal:** Persistent data storage with MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (FREE M0 tier)
4. Choose cloud provider: AWS (recommended)
5. Choose region: Closest to your users

### 1.2 Configure Database Access
1. Create database user (username + password)
2. Add IP address to whitelist:
   - `0.0.0.0/0` (allows all IPs - needed for Vercel)
3. Get connection string

### 1.3 Install Dependencies
```bash
npm install mongoose
npm install -D @types/mongoose
```

### 1.4 MongoDB Schemas (Mongoose Models)

```typescript
// src/lib/models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: Date;
  category: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  stack: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
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

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
```

```typescript
// src/lib/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

```typescript
// src/lib/models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
```

```typescript
// src/lib/models/Settings.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  ownerName: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  availability: boolean;
  profileImage?: string;
  resumeUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: Array<{ name: string; level: number }>;
}

const SettingsSchema = new Schema<ISettings>({
  siteName: { type: String, default: 'My Portfolio' },
  ownerName: { type: String, default: 'Garali Abdesslem' },
  bio: { type: String },
  location: { type: String },
  email: { type: String },
  phone: { type: String },
  availability: { type: Boolean, default: true },
  profileImage: { type: String },
  resumeUrl: { type: String },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
  },
  skills: [{
    name: { type: String },
    level: { type: Number, min: 0, max: 100 }
  }],
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
```

### 1.5 Database Connection Utility

```typescript
// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### 1.6 Tasks Checklist
- [ ] Create MongoDB Atlas account
- [ ] Create FREE M0 cluster
- [ ] Configure database user
- [ ] Whitelist IP addresses (0.0.0.0/0)
- [ ] Get connection string
- [ ] Install mongoose package
- [ ] Create database connection utility
- [ ] Create Mongoose models (Project, User, Message, Settings)
- [ ] Migrate existing projects from JSON to MongoDB
- [ ] Update API routes to use MongoDB

---

## 🎯 Phase 2: Image Storage with Cloudinary (Priority: HIGH)
**Goal:** Persistent image storage for project screenshots

### Why Cloudinary?
```
✅ FREE tier: 25 GB storage + 25 GB bandwidth/month
✅ Image transformations (resize, crop, optimize)
✅ CDN delivery (fast loading)
✅ Easy integration with Next.js
```

### 2.1 Setup Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 2.2 Install Dependencies
```bash
npm install cloudinary
npm install next-cloudinary  # Optional: React components
```

### 2.3 Cloudinary Configuration

```typescript
// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Buffer, folder: string = 'portfolio') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 630, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file);
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
```

### 2.4 Tasks Checklist
- [ ] Create Cloudinary account
- [ ] Get API credentials
- [ ] Install cloudinary package
- [ ] Create upload utility
- [ ] Update `/api/upload` route
- [ ] Update image display components

---

## 🎯 Phase 3: Authentication with NextAuth.js (Priority: HIGH)
**Goal:** Secure admin authentication

### 3.1 Install Dependencies
```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

### 3.2 NextAuth Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        const user = await User.findOne({ username: credentials.username });
        
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 3.3 NextAuth API Route

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 3.4 Middleware for Protected Routes

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Allow access to login page
          if (req.nextUrl.pathname === '/admin/login') {
            return true;
          }
          return !!token;
        }
        
        // Protect admin API routes
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### 3.5 Create Initial Admin User Script

```typescript
// scripts/create-admin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const passwordHash = await bcrypt.hash('your-secure-password', 12);
  
  await User.create({
    username: 'admin',
    email: 'your-email@example.com',
    passwordHash,
    role: 'admin',
  });
  
  console.log('Admin user created!');
  process.exit(0);
}

createAdmin();
```

### 3.6 Tasks Checklist
- [ ] Install next-auth and bcryptjs
- [ ] Configure NextAuth with credentials provider
- [ ] Create API route for auth
- [ ] Set up middleware for route protection
- [ ] Create admin login page
- [ ] Create initial admin user
- [ ] Test authentication flow

---

## 🎯 Phase 4: Enhanced Admin Dashboard (Priority: MEDIUM)
**Goal:** Complete admin panel for portfolio management

### Admin Routes Structure
```
/admin
├── /login              # Login page (public)
├── /                   # Dashboard overview (protected)
├── /projects           # Projects list (protected)
├── /projects/new       # Add new project (protected)
├── /projects/[id]      # Edit project (protected)
├── /messages           # Contact messages (protected)
├── /settings           # Site settings (protected)
└── /profile            # Admin profile (protected)
```

### 4.1 Dashboard Components to Create
- [ ] `AdminLayout.tsx` - Sidebar + header
- [ ] `AdminSidebar.tsx` - Navigation menu
- [ ] `DashboardStats.tsx` - Statistics cards
- [ ] `RecentActivity.tsx` - Activity feed
- [ ] `ProjectsTable.tsx` - Projects data table
- [ ] `ProjectForm.tsx` - Add/edit project form
- [ ] `MessagesTable.tsx` - Messages list
- [ ] `SettingsForm.tsx` - Site settings form

### 4.2 Dashboard Features
- [ ] Statistics: Total projects, messages, page views
- [ ] Quick actions: Add project, view messages
- [ ] Recent projects list
- [ ] Unread messages count

### 4.3 Projects Management
- [ ] Paginated projects table
- [ ] Search and filter
- [ ] Bulk actions (delete, feature/unfeature)
- [ ] Image upload with preview
- [ ] Markdown editor for content
- [ ] Drag & drop reordering

### 4.4 Messages Management
- [ ] Messages table with status
- [ ] Mark as read/unread
- [ ] Delete messages
- [ ] Reply button (opens email)
- [ ] Export to CSV

### 4.5 Settings Management
- [ ] Personal info editing
- [ ] Social links
- [ ] Skills list (add/remove/reorder)
- [ ] Profile photo upload
- [ ] Resume PDF upload
- [ ] Availability toggle

---

## 🎯 Phase 5: Contact Form Integration (Priority: MEDIUM)
**Goal:** Working contact form with email notifications

### 5.1 Install Resend (Email Service)
```bash
npm install resend
```

### 5.2 Email Configuration

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: 'Portfolio <noreply@yourdomain.com>',
    to: process.env.ADMIN_EMAIL!,
    subject: `New Contact: ${message.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${message.name} (${message.email})</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
    `,
  });
}

export async function sendAutoReply(to: string, name: string) {
  await resend.emails.send({
    from: 'Garali Abdesslem <noreply@yourdomain.com>',
    to,
    subject: 'Thanks for reaching out!',
    html: `
      <h2>Hi ${name}!</h2>
      <p>Thank you for contacting me. I've received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br>Garali Abdesslem</p>
    `,
  });
}
```

### 5.3 Contact API Route

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import { sendContactNotification, sendAutoReply } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    await dbConnect();
    await Message.create({ name, email, subject, message });

    // Send email notification to admin
    await sendContactNotification({ name, email, subject, message });

    // Send auto-reply to sender
    await sendAutoReply(email, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
```

### 5.4 Tasks Checklist
- [ ] Sign up for Resend (free tier)
- [ ] Verify domain or use test domain
- [ ] Install resend package
- [ ] Create email utility functions
- [ ] Update contact API route
- [ ] Save messages to MongoDB
- [ ] Send email notification to admin
- [ ] Add auto-reply to sender
- [ ] Update contact form UI

---

## 🎯 Phase 6: Complete API Routes (Priority: HIGH)

### API Routes to Create/Update

```typescript
// Projects API
GET    /api/projects          → List all projects
POST   /api/projects          → Create project (protected)
GET    /api/projects/[id]     → Get single project
PUT    /api/projects/[id]     → Update project (protected)
DELETE /api/projects/[id]     → Delete project (protected)

// Messages API (admin only)
GET    /api/admin/messages          → List all messages
GET    /api/admin/messages/[id]     → Get single message
PUT    /api/admin/messages/[id]     → Update message (mark read)
DELETE /api/admin/messages/[id]     → Delete message

// Settings API
GET    /api/settings                → Get public settings
PUT    /api/admin/settings          → Update settings (protected)

// Upload API
POST   /api/upload                  → Upload image (protected)
DELETE /api/upload                  → Delete image (protected)

// Stats API (admin only)
GET    /api/admin/stats             → Get dashboard stats
```

---

## 🎯 Phase 7: Frontend Enhancements (Priority: LOW)

### Tasks:
- [ ] Add toast notifications (sonner)
- [ ] Add loading skeletons
- [ ] Add confirmation dialogs
- [ ] Improve form validation UX
- [ ] Add keyboard shortcuts
- [ ] Optimize images
- [ ] Add page transitions

### Install UI Enhancement Packages
```bash
npm install sonner          # Toast notifications
npm install @tanstack/react-table  # Data tables for admin
```

---

## 🎯 Phase 8: SEO & Performance (Priority: MEDIUM)

### Tasks:
- [ ] Dynamic sitemap generation
- [ ] robots.txt configuration
- [ ] Dynamic OG images
- [ ] Structured data (JSON-LD)
- [ ] Core Web Vitals optimization
- [ ] Meta tags per page

---

## 🎯 Phase 9: Deployment (Priority: HIGH)

### Environment Variables for Vercel
```env
# MongoDB Atlas
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"

# NextAuth.js
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend (Email)
RESEND_API_KEY="re_xxxxx"
ADMIN_EMAIL="your-email@example.com"
```

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Run admin setup script (create admin user)

---

## 📦 All Dependencies to Install

```bash
# Database (MongoDB)
npm install mongoose

# Authentication
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# Image Storage
npm install cloudinary

# Email
npm install resend

# UI Enhancements
npm install sonner
npm install @tanstack/react-table
```

**One command:**
```bash
npm install mongoose next-auth bcryptjs cloudinary resend sonner @tanstack/react-table && npm install -D @types/bcryptjs
```

---

## 📁 Final Project Structure

```
My-Portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home
│   │   ├── about/page.tsx              # About
│   │   ├── projects/
│   │   │   ├── page.tsx                # Projects list
│   │   │   └── [slug]/page.tsx         # Project detail
│   │   ├── contact/page.tsx            # Contact
│   │   ├── admin/
│   │   │   ├── login/page.tsx          # Admin login
│   │   │   ├── layout.tsx              # Admin layout
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx            # Projects list
│   │   │   │   ├── new/page.tsx        # New project
│   │   │   │   └── [id]/page.tsx       # Edit project
│   │   │   ├── messages/page.tsx       # Messages
│   │   │   └── settings/page.tsx       # Settings
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── projects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── admin/
│   │   │       ├── messages/route.ts
│   │   │       ├── stats/route.ts
│   │   │       └── settings/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectsTable.tsx
│   │   │   └── MessagesTable.tsx
│   │   ├── ui/
│   │   └── ...
│   ├── lib/
│   │   ├── mongodb.ts                  # DB connection
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── cloudinary.ts               # Image upload
│   │   ├── email.ts                    # Email utilities
│   │   ├── models/
│   │   │   ├── Project.ts
│   │   │   ├── User.ts
│   │   │   ├── Message.ts
│   │   │   └── Settings.ts
│   │   └── utils.ts
│   └── middleware.ts
├── scripts/
│   └── create-admin.ts                 # Admin setup script
├── public/
├── .env.local
├── .env.example
└── package.json
```

---

## ⏱️ Updated Timeline

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | MongoDB Atlas Setup | 2-3 hours |
| Phase 2 | Cloudinary Setup | 1-2 hours |
| Phase 3 | NextAuth.js Setup | 2-3 hours |
| Phase 4 | Admin Dashboard | 6-8 hours |
| Phase 5 | Contact Form + Email | 1-2 hours |
| Phase 6 | API Routes | 3-4 hours |
| Phase 7 | Frontend Polish | 2-3 hours |
| Phase 8 | SEO & Performance | 2-3 hours |
| Phase 9 | Deployment | 1-2 hours |
| **Total** | | **~20-30 hours** |

---

## ✅ Success Criteria

When complete:
- [ ] **MongoDB Atlas** - All data persisted in cloud database
- [ ] **Secure Auth** - NextAuth.js with protected admin routes
- [ ] **Cloudinary Images** - Images stored in cloud CDN
- [ ] **Full CRUD** - Complete project management
- [ ] **Contact Form** - Messages saved + email notifications
- [ ] **Admin Dashboard** - Easy portfolio management
- [ ] **Deployed on Vercel** - Live and working

---

## 🚀 Ready to Start!

**First Step:** Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create FREE account
3. Create M0 cluster
4. Get connection string

Then we'll install packages and build Phase 1!

---

*Generated: January 14, 2026*  
*Portfolio of Garali Abdesslem*  
*Database: MongoDB Atlas*
