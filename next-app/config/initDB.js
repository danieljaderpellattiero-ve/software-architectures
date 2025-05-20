import connectDB from './db';
import User from '@/models/User';

let dbInitialized = false;

export const initializeDB = async () => {
  if (dbInitialized) {
    return;
  }

  try {
    await connectDB();
    // Initialize models
    User;
    dbInitialized = true;
    console.log('Database and models initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export default initializeDB; 