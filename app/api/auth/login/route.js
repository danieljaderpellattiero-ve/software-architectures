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

    const { email, password, rememberMe } = await request.json(); // Added rememberMe if you plan to use it
    console.log("Login attempt for email:", email);

    // Find user (without password initially)
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
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
            { success: false, message: 'Server error during login process' },
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
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // --- Login successful ---

    // Create token payload
    const payload = { id: user._id, role: user.role };
    // Determine token expiry (e.g., 1 day or longer if 'rememberMe' is true)
    // NOTE: The 'rememberMe' logic is NOT implemented here, add if needed.
    const expiresIn = '1d'; // Example: default to 1 day

    // Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
      { expiresIn: expiresIn }
    );
    console.log('Login successful, token created');

    // Determine redirect path based on user role
    const redirectPath = `/${user.role}Dashboard`; // e.g., /adminDashboard, /userDashboard

    // Prepare user data to return (excluding sensitive info)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Return success response with token, user data, and redirect path
    const response = NextResponse.json({
      success: true,
      token,          // Optionally return token in body if needed by client state
      user: userData,
      redirectTo: redirectPath
    }, {
      status: 200
    });

    // Set HttpOnly cookie containing the token
    // Adjust Max-Age based on 'rememberMe' if implementing that logic
    response.headers.set(
        'Set-Cookie',
        `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24}` // Max-Age=1 day in seconds
    );

    return response;

  } catch (error) {
    console.error("Login API error:", error);
    // Avoid sending detailed internal errors to the client
    return NextResponse.json({ success: false, message: "Server error during login" }, { status: 500 });
  }
}