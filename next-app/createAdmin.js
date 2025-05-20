import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Delete existing admin user
        await User.deleteOne({ email: 'admin@admin.com' });
        console.log('Deleted existing admin user if any');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('Generated hash:', hashedPassword);

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

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin(); 