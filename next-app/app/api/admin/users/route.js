import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Fetch all users but exclude sensitive information
    const users = await User.find({}, {
      password: 0, // Exclude password
      __v: 0, // Exclude version key
    }).sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
} 