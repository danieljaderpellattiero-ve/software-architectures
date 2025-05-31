import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import PatientRequest from '@/models/PatientRequest'; // Assuming you have a Mongoose model for PatientRequest
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '@/models/User'; // Assuming you have a Mongoose model for User

export async function GET(request) {
  try {
    console.log('API /api/patientrequests GET: Request received.');
    await connectDB();
    console.log('API /api/patientrequests GET: Database connected successfully');

    // The middleware should have verified the cookie and set the userId header.
    // Prioritize getting the user ID from this header.
    const userId = request.headers.get('userId');
    console.log('API /api/patientrequests GET: userId from header:', userId);

    let userRole = null; // We might also need the role

    // If userId is not available from the header (shouldn't happen if middleware is correct for this route),
    // fall back to checking Authorization header (less preferred for routes covered by middleware).
    if (!userId) {
        console.warn('API /api/patientrequests GET: userId header missing, falling back to Authorization header.');
        const authHeader = request.headers.get('authorization');
        console.log('API /api/patientrequests GET: Auth header (fallback):', authHeader ? 'Present' : 'Missing');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('API /api/patientrequests GET: Invalid or missing Authorization header fallback.');
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1]?.trim();
        if (!token) {
            console.warn('API /api/patientrequests GET: No token found in Authorization header fallback.');
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // Get userId from token payload
            userRole = decoded.role; // Get userRole from token payload
            console.log('API /api/patientrequests GET: Decoded user ID from token (fallback):', userId, 'Role:', userRole);
        } catch (error) {
            console.error('API /api/patientrequests GET: Token verification failed (fallback):', error);
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
    } else {
        // If userId came from the header, we need to get the role from the database or token
        // Since middleware decoded the token and set userId, let's assume we can get role similarly if needed.
        // For now, we'll fetch the user from DB to get the role reliably if not already inferred.
        // A more optimized approach would be for middleware to set role header too.
         try {
            // Re-verify token to get role if not passed via header (or fetch user from DB)
            const authHeader = request.headers.get('authorization'); // Check if Auth header is also present
             if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1]?.trim();
                 if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userRole = decoded.role; // Get role from token
                    console.log('API /api/patientrequests GET: Got role from token:', userRole);
                 }
             }
             // If role is still null, fetch from DB (less efficient but reliable)
             if (!userRole) {
                console.log('API /api/patientrequests GET: Fetching user from DB to get role for userId:', userId);
                 const userFromDB = await User.findById(userId).select('role');
                 if (userFromDB) {
                     userRole = userFromDB.role;
                     console.log('API /api/patientrequests GET: Got role from DB:', userRole);
                 } else {
                     console.warn('API /api/patientrequests GET: User not found in DB for userId from header.', userId);
                     return NextResponse.json({ error: 'User not found' }, { status: 404 });
                 }
             }

         } catch (error) {
             console.error('API /api/patientrequests GET: Error getting role after getting userId from header:', error);
             return NextResponse.json({ error: 'Server error processing user role' }, { status: 500 });
         }
    }


    // Ensure userId is valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API /api/patientrequests GET: Invalid user ID format', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryDoctorId = searchParams.get('doctorId');
    const queryPatientId = searchParams.get('patientId');

    let query = {};
    
    // Build initial query based on the authenticated user's role and ID
    if (userRole === 'doctor') {
      query.doctorId = new mongoose.Types.ObjectId(userId);
      query.status = false; // Only fetch pending requests for doctors
      console.log('API /api/patientrequests GET: Building query for doctor with ID:', userId);
    } else if (userRole === 'patient') {
      query.patientId = new mongoose.Types.ObjectId(userId);
      console.log('API /api/patientrequests GET: Building query for patient with ID:', userId);
    } else {
         // Should not reach here if authentication/authorization is handled, but defensive check
         console.warn('API /api/patientrequests GET: Unhandled user role:', userRole);
         return NextResponse.json({ error: 'Unauthorized or invalid user role' }, { status: 403 });
    }

    // Optional: If specific IDs are provided in query params (e.g., doctor viewing a specific patient's requests),
    // add them to the query. Ensure the authenticated user is authorized to view these.
    // For simplicity now, we will just use the authenticated user's ID from the middleware.
    // If you need to fetch requests for *other* users (e.g., doctor views a specific patient's requests),
    // you would add logic here to check if the authenticated user (doctor) has permission
    // to query by patientId or doctorId different from their own.

    console.log('API /api/patientrequests GET: Final Query object:', query);
    const patientRequests = await PatientRequest.find(query);
    console.log('API /api/patientrequests GET: Fetched requests count:', patientRequests.length);

    return NextResponse.json(patientRequests);

  } catch (error) {
    console.error('Error in GET /api/patientrequests:', error);
    // Log stack trace for server-side debugging, but send generic error to client
    return NextResponse.json({ 
      error: 'An error occurred while fetching patient requests',
      // Optionally include a request ID or timestamp to correlate with server logs
    }, { status: 500 });
  }
}

// Add other request handlers (POST, PUT, DELETE) as needed for creating, updating, or deleting requests 