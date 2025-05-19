import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Find users with the role 'doctor'
    const doctors = await User.find({ role: 'doctor' }).select('_id name'); // Select only necessary fields
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
} 