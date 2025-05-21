import connectDB from '../config/db.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

async function listUsers() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    const users = await User.find({});
    console.log('\nUsers in database:');
    console.log('------------------');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`2FA Enabled: ${user.twoFactorEnabled}`);
      console.log(`2FA Secret: ${user.twoFactorSecret ? 'Yes' : 'No'}`);
      console.log('------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
}

listUsers(); 