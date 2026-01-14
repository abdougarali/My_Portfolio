import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
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

const ProjectSchema = new Schema<IProject>(
  {
    slug: { 
      type: String, 
      required: [true, 'Slug is required'], 
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
    },
    summary: { 
      type: String, 
      required: [true, 'Summary is required'],
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'],
    },
    date: { 
      type: Date, 
      required: [true, 'Date is required'],
      default: Date.now,
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'],
      default: 'Web Development',
    },
    featured: { 
      type: Boolean, 
      default: false,
    },
    liveUrl: { 
      type: String,
      trim: true,
    },
    githubUrl: { 
      type: String,
      trim: true,
    },
    image: { 
      type: String,
    },
    stack: [{ 
      type: String,
      trim: true,
    }],
    tags: [{ 
      type: String,
      trim: true,
    }],
  },
  { 
    timestamps: true,
  }
);

// Create indexes for better query performance
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });

// Prevent model recompilation in development
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
