import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const pdfData = data.pdf;

    if (!pdfData) {
      return NextResponse.json({ error: 'No PDF data provided' }, { status: 400 });
    }

    // Forward the request to the backend server service
    const serverResponse = await fetch('http://server:8180/Gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf: pdfData }),
    });

    if (!serverResponse.ok) {
      const errorData = await serverResponse.json();
      return NextResponse.json({ error: errorData.error || 'Error forwarding PDF to server' }, { status: serverResponse.status });
    }

    const responseData = await serverResponse.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in /api/process-pdf:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 