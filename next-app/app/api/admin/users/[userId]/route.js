import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import Log from '@/models/Log';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;

    // Get the user before deleting to log their details
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the admin user from the request (you'll need to implement authentication)
    // For now, we'll use a default admin ID
    const adminId = '65f1a1b1c1d1e1f1a1b1c1d1'; // Replace with actual admin ID from auth

    // Create log entry before deleting
    await Log.create({
      action: 'DELETE_USER',
      performedBy: adminId,
      targetUser: userId,
      details: `User deleted: ${userToDelete.email} (${userToDelete.role})`
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    );
  }
} 