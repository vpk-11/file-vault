import path from 'path';

const required = ['MONGODB_URI', 'SESSION_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const MONGODB_URI = process.env.MONGODB_URI as string;
export const PORT = parseInt(process.env.PORT || '8000', 10);
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10);
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
export const NODE_ENV = process.env.NODE_ENV || 'development';
