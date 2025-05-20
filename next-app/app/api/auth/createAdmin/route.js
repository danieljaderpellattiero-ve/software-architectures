import { NextResponse } from 'next/server';
import initializeDB from '@/config/initDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        await initializeDB();
        console.log("Database initialized");

        // Delete existing admin user if exists
        await User.deleteOne({ email: 'admin@admin.com' });
        console.log("Deleted existing admin user if any");

        // Hash the password directly
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log("Generated hash:", hashedPassword);

        // Create admin user with hashed password
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
        console.log("Admin user created successfully");

        return NextResponse.json({
            message: "Admin user created successfully",
            user: {
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating admin user:", error);
        return NextResponse.json({ message: error.message || "Error creating admin user" }, { status: 500 });
    }
} 