import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with actual database queries
    // This is mock data
    const appointments = [
      {
        id: 1,
        patientName: 'John Doe',
        date: '2024-03-20',
        time: '10:00 AM',
        status: 'confirmed',
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        date: '2024-03-20',
        time: '11:30 AM',
        status: 'pending',
      },
      {
        id: 3,
        patientName: 'Mike Johnson',
        date: '2024-03-21',
        time: '2:00 PM',
        status: 'confirmed',
      },
    ];

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching appointments' },
      { status: 500 }
    );
  }
} 