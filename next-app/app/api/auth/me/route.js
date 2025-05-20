import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    console.log("API /api/auth/me: Request received.");
    await connectDB();
    console.log("API /api/auth/me: Database connection established.");

    // The middleware should have already verified the cookie and potentially set a header.
    // Let's check for the userId header set by middleware as an alternative to Authorization header.
    const userIdFromHeader = request.headers.get('userId');
    console.log("API /api/auth/me: userId from header:", userIdFromHeader);

    // Get the token from the Authorization header (still needed if middleware doesn't set userId header)
    const authHeader = request.headers.get('authorization');
    console.log("API /api/auth/me: Auth header:", authHeader ? "Present" : "Missing");

    let userId = null;

    if (userIdFromHeader) {
      userId = userIdFromHeader;
      console.log("API /api/auth/me: Using userId from middleware header.");
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]?.trim();
      console.log("API /api/auth/me: Token extracted from Auth header:", token ? "Present" : "Missing");

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          console.log("API /api/auth/me: Token decoded successfully, userId from token:", userId);
        } catch (error) {
          console.error('API /api/auth/me: Token verification failed:', error.message);
          // If token verification fails from header, it's an auth error.
           return NextResponse.json(
            { success: false, error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
         console.log('API /api/auth/me: No token found in Authorization header.');
      }
    }
    
    // If no userId obtained from header or token
    if (!userId) {
       console.log('API /api/auth/me: No userId found from header or token.');
       return NextResponse.json(
         { success: false, error: 'Not authenticated' },
         { status: 401 }
       );
    }

    // Get user from database using obtained userId
    console.log("API /api/auth/me: Attempting to find user with ID:", userId);
    const user = await User.findById(userId).select('-password');
    console.log("API /api/auth/me: User found in DB:", user ? "Yes" : "No");

    if (!user) {
      console.log('API /api/auth/me: User not found in DB.');
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare user data to return (excluding sensitive info)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('API /api/auth/me: Sending user data:', userData);
    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('API /api/auth/me: Server error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
} 