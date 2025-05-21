import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const { email } = await request.json();
    console.log("Setting up 2FA for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `YourApp:${email}`
    });
    console.log("Generated new 2FA secret");

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    console.log("Generated QR code");

    // Store the secret in the database
    user.twoFactorSecret = secret.base32;
    await user.save();
    console.log("Saved 2FA secret to database");

    return NextResponse.json({
      secret: secret.base32,
      qrCode,
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint to verify and enable 2FA
export async function PUT(request) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const { email, code } = await request.json();
    console.log("Verifying 2FA setup for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log("User found, checking 2FA secret");
    if (!user.twoFactorSecret) {
      console.log("No 2FA secret found for user");
      return NextResponse.json(
        { message: '2FA not set up for this user' },
        { status: 400 }
      );
    }

    console.log("Verifying 2FA code");
    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      console.log("Invalid 2FA code provided");
      return NextResponse.json(
        { message: 'Invalid authentication code' },
        { status: 401 }
      );
    }

    console.log("2FA code verified, enabling 2FA");
    // Enable 2FA for the user
    user.twoFactorEnabled = true;
    await user.save();
    console.log("2FA enabled successfully");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint to disable 2FA
export async function DELETE(request) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const { email, code } = await request.json();
    console.log("Disabling 2FA for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      console.log("2FA not enabled for user");
      return NextResponse.json(
        { message: '2FA is not enabled for this user' },
        { status: 400 }
      );
    }

    console.log("Verifying 2FA code before disabling");
    // Verify the code before disabling
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      console.log("Invalid 2FA code provided");
      return NextResponse.json(
        { message: 'Invalid authentication code' },
        { status: 401 }
      );
    }

    console.log("2FA code verified, disabling 2FA");
    // Disable 2FA for the user
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null; // Clear the secret
    await user.save();
    console.log("2FA disabled successfully");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 