import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill {
  name: string;
  level: number;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  siteName: string;
  ownerName: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  availability: boolean;
  profileImage?: string;
  resumeUrl?: string;
  socialLinks: ISocialLinks;
  skills: ISkill[];
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { 
      type: String, 
      default: 'My Portfolio',
    },
    ownerName: { 
      type: String, 
      default: 'Garali Abdesslem',
    },
    title: {
      type: String,
      default: 'Full Stack Developer',
    },
    bio: { 
      type: String,
      default: '',
    },
    location: { 
      type: String,
      default: 'Tunisia',
    },
    email: { 
      type: String,
      default: '',
    },
    phone: { 
      type: String,
      default: '',
    },
    availability: { 
      type: Boolean, 
      default: true,
    },
    profileImage: { 
      type: String,
    },
    resumeUrl: { 
      type: String,
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    skills: [{
      name: { type: String, required: true },
      level: { type: Number, min: 0, max: 100, default: 50 },
    }],
    technologies: [{ 
      type: String,
      trim: true,
    }],
  },
  { 
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
