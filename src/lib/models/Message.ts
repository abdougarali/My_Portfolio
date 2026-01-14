import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    subject: { 
      type: String, 
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: { 
      type: String, 
      required: [true, 'Message is required'],
    },
    read: { 
      type: Boolean, 
      default: false,
    },
    replied: { 
      type: Boolean, 
      default: false,
    },
  },
  { 
    timestamps: true,
  }
);

// Create indexes
MessageSchema.index({ read: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
