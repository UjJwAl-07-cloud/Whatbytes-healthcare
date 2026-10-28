import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

// Validate required environment variables
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
const missing = requiredVars.filter((key) => !env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Please check your .env file or environment configuration.');
  process.exit(1);
}

export default env;
