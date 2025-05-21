import connectDB from '../config/db.js';
import User from '../models/User.js';
import speakeasy from 'speakeasy';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Debug: Print environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

async function generateSecretsForExistingUsers() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Find all users without 2FA secrets
    const users = await User.find({ twoFactorSecret: null });
    console.log(`Found ${users.length} users without 2FA secrets`);

    for (const user of users) {
      // Generate a new secret
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `YourApp:${user.email}`
      });
      
      // Update the user with the new secret
      user.twoFactorSecret = secret.base32;
      await user.save();
      
      console.log(`Generated 2FA secret for user: ${user.email}`);
    }

    console.log('Finished generating 2FA secrets for all users');
    process.exit(0);
  } catch (error) {
    console.error('Error generating 2FA secrets:', error);
    process.exit(1);
  }
}

generateSecretsForExistingUsers(); 