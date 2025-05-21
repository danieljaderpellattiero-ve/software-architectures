// File: app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If 2FA is not enabled, proceed with normal login
    if (!user.twoFactorEnabled) {
      // Generate JWT token
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
          twoFactorEnabled: false
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
    }

    // If 2FA is enabled, generate a temporary token
    const tempToken = await new SignJWT({ 
      email: user.email,
      role: user.role,
      id: user._id.toString(),
      temp: true
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m') // 5 minutes
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    
    return NextResponse.json({
      success: true,
      requires2FA: true,
      tempToken,
      user: {
        email: user.email,
        role: user.role,
        twoFactorEnabled: true
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}