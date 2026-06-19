import mongoose from 'mongoose';

interface IFileEntry {
  storedName: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

interface IUser {
  uname: string;
  pass: string;
  age: number;
  email: string;
  files: IFileEntry[];
}

const fileEntrySchema = new mongoose.Schema<IFileEntry>({
  storedName: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema<IUser>({
  uname: { type: String, required: true, unique: true, trim: true },
  pass: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  files: [fileEntrySchema]
}, { timestamps: true });

export default mongoose.model<IUser>('userData', userSchema);
