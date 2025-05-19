import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

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