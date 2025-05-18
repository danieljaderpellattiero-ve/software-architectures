// app/api/logout/route.js
import { NextResponse } from 'next/server';
// Import your server-side session handling or database connection if needed
// import { destroySession } from '../../utils/auth'; // Example for a custom function

export async function POST(req) {
  try {
    // 1. Invalidate server-side session (adapt to your implementation)
    // If you have a server-side session mechanism, call the function to destroy it.
    // Example:
    // await destroySession(req);

    // 2. Clear the 'token' cookie on the client
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Error during server-side logout:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}