import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    if (connected) {
        console.log("Connected to database");
        return;
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.log("MongoDB URI is not defined. Please check your .env file.");
        return;
    }

    try {
        await mongoose.connect(uri);
        connected = true;
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database:", error);
    }
};

export default connectDB;
