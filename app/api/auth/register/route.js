import { NextResponse } from 'next/server';
import initializeDB from '@/config/initDB';
import User from '@/models/User';

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

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      codiceFiscale,
      homeAddress,
      medicalData,
      role
    });

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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