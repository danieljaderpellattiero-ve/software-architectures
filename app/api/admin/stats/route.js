import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with actual database queries
    // This is mock data
    const stats = {
      totalDoctors: 15,
      totalPatients: 120,
      totalAppointments: 45,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching stats' },
      { status: 500 }
    );
  }
} 