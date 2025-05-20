// File: app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import initializeDB from '@/config/initDB'; // Adjust path if necessary
import User from '@/models/User';         // Adjust path if necessary
import jwt from 'jsonwebtoken';
// Assuming you have a password comparison utility (like bcrypt) in your User model
// import bcrypt from 'bcryptjs'; // Example if using bcrypt directly here

export async function POST(request) {
  try {
    // Ensure DB connection is established
    await initializeDB();
    console.log("Database and models initialized");

    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    // Find user (without password initially)
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Find user again, explicitly selecting the password field
    // Mongoose requires .select('+password') if password field has select: false in schema
    const userWithPassword = await User.findOne({ email }).select('+password');
    console.log('User with password found:', userWithPassword ? 'Yes' : 'No');

    if (!userWithPassword) {
        // This case should theoretically not happen if user was found above, but good practice
        console.log('Error fetching user with password field.');
        return NextResponse.json(
            { error: 'Server error during login process' },
            { status: 500 }
          );
    }

    // Check if password matches using the model's method (preferred)
    // Assumes your User model has a method like 'matchPassword' that handles bcrypt comparison
    const isMatch = await userWithPassword.matchPassword(password);
    console.log('Password match result from model:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // --- Login successful ---

    // Create token payload
    const payload = { 
      id: user._id,
      role: user.role
    };

    // Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
      { expiresIn: '7d' }
    );
    console.log('Login successful, token created');

    // Prepare user data to return (excluding sensitive info)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Create the response
    const response = NextResponse.json({
      success: true,
      token,
      user: userData
    });

    // Set the token in an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    console.log('Token set in cookie, user data:', userData);
    return response;

  } catch (error) {
    console.error("Login API error:", error);
    // Avoid sending detailed internal errors to the client
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}