const required = ['MONGODB_URI', 'SESSION_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: parseInt(process.env.PORT || '8000', 10),
  SESSION_SECRET: process.env.SESSION_SECRET,
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10)
};
