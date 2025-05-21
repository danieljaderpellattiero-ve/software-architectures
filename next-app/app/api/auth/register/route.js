import { NextResponse } from 'next/server';
import initializeDB from '@/config/initDB';
import User from '@/models/User';
import Log from '@/models/Log';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export async function POST(request) {
  try {
    await initializeDB();
    const { name, email, password, phoneNumber, codiceFiscale, homeAddress, medicalData, role } = await request.json();

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate 2FA secret
    const twoFactorSecret = authenticator.generateSecret();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      codiceFiscale,
      homeAddress,
      medicalData,
      role,
      twoFactorSecret,
      twoFactorEnabled: false
    });

    // Create log entry
    await Log.create({
      action: 'CREATE_USER',
      performedBy: user._id,
      targetUser: user._id,
      details: `New ${role} account created: ${email}`
    });

    // Generate QR code URL for 2FA setup
    const otpauth = authenticator.keyuri(email, 'YourAppName', twoFactorSecret);

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorSecret,
        twoFactorSetupUrl: otpauth
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
} 