import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function DELETE(request) {
  try {
    // Get the token from the cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Delete the user from the users collection
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(decoded.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete any associated patient records
    await db.collection('patients').deleteOne({
      userId: new ObjectId(decoded.id)
    });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/patient/delete-account:', error);
    // Specifically handle JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 