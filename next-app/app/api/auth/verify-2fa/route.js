import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import speakeasy from 'speakeasy';
import { SignJWT } from 'jose';

export async function POST(request) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const { email, code, tempToken } = await request.json();
    console.log("2FA verification attempt for email:", email);

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the 2FA code
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1 // Allow 1 step before/after for clock skew
    });

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid authentication code' },
        { status: 401 }
      );
    }

    // Generate the final JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      email: user.email,
      role: user.role,
      id: user._id.toString()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Create the response
    const response = NextResponse.json({ 
      success: true,
      user: {
        email: user.email,
        role: user.role,
        twoFactorEnabled: true
      }
    });

    // Set the cookie in the response
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 