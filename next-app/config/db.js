import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

let isConnected = false;

const createAdminUser = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@admin.com' });
        
        if (!adminExists) {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            // Create admin user
            const adminUser = new User({
                name: "Admin User",
                email: "admin@admin.com",
                password: hashedPassword,
                phoneNumber: "1234567890",
                codiceFiscale: "ADMIN12345678901",
                homeAddress: "Admin Address",
                role: "admin"
            });

            // Save the user
            await adminUser.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Admin user creation error:', error);
        throw error;
    }
};

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB:', mongoURI.includes('mongodb:27017') ? 'Local Docker MongoDB' : 'Cloud MongoDB');

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      // Only use SSL for cloud connections
      ...(mongoURI.includes('mongodb+srv') ? {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        retryWrites: true,
        w: 'majority'
      } : {})
    });

    isConnected = conn.connection.readyState === 1;
    
    if (isConnected) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      // Create admin user after successful connection
      await createAdminUser();
    } else {
      throw new Error('MongoDB connection is not ready');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Connection URI:', process.env.MONGODB_URI);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
  isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB; 