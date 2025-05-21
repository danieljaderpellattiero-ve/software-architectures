import mongoose from 'mongoose';

let isConnected = false;

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