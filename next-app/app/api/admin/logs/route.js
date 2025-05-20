import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Log from '@/models/Log';

export async function GET() {
  try {
    await connectDB();

    // Fetch logs with populated user information
    const logs = await Log.find()
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ timestamp: -1 }); // Sort by newest first

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { message: 'Error fetching logs' },
      { status: 500 }
    );
  }
} 