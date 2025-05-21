import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Get user ID from the header set by middleware
    const userId = request.headers.get('userId');
    
    if (!userId) {
       // This case should ideally not be reached if middleware is configured correctly for this route
       console.warn('API Profile GET: userId header not found');
       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API Profile GET: Invalid user ID format from header', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    console.log('API Profile GET: Fetching user with userId:', userId);
    const user = await User.findById(userId);
    
    if (!user) {
      console.warn(`API Profile GET: User not found for userId: ${userId}.`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Extract profile data from the user document
    const profileData = {
      firstName: user.name?.split(' ')[0] || '', // Split name into first name
      surname: user.name?.split(' ').slice(1).join(' ') || '', // Rest of the name as surname
      nationalCode: user.codiceFiscale || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      educationLevel: user.educationLevel || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      phoneCode: '+98', // Default phone code
      country: user.country || '', // Ensure country is always a string
      city: user.city || '',
      homeAddress: user.homeAddress || '',
      medicalData: user.medicalData || {},
      twoFactorEnabled: user.twoFactorEnabled || false // Include 2FA status
    };
    
    console.log('API Profile GET: Raw user document:', user);
    console.log('API Profile GET: Processed profileData:', profileData);
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in GET /api/patient/profile:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully for PUT request');
    
    // Get user ID from the header set by middleware
    const userId = request.headers.get('userId');
    console.log('API Profile PUT: Received userId from header:', userId);

    if (!userId) {
       console.warn('API Profile PUT: userId header not found - should not happen with correct middleware config');
       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API Profile PUT: Invalid user ID format from header', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const data = await request.json();
    console.log('API Profile PUT: Received data from frontend:', data);
    
    // Prepare the update data - ensure we only include fields meant for updating
    const updateData = {};
    
    // Handle name (firstName and surname)
    if (data.firstName !== undefined || data.surname !== undefined) { 
        const firstName = data.firstName !== undefined ? data.firstName.trim() : '';
        const surname = data.surname !== undefined ? data.surname.trim() : '';
        updateData.name = `${firstName} ${surname}`.trim();
        console.log('API Profile PUT: Handling name, result:', updateData.name);
    }

    // Explicitly handle dateOfBirth conversion and inclusion
    if (data.dateOfBirth !== undefined) {
        if (data.dateOfBirth) {
            const date = new Date(data.dateOfBirth);
            // Check if the date is valid
            if (!isNaN(date.getTime())) {
                 updateData.dateOfBirth = date;
                 console.log('API Profile PUT: Handling dateOfBirth, valid date:', updateData.dateOfBirth);
            } else {
                 console.warn('API Profile PUT: Handling dateOfBirth, invalid date string received:', data.dateOfBirth);
                 // If string is not empty but invalid, we won't add it to updateData, effectively keeping existing.
            }
        } else {
             // Handle empty string or null for dateOfBirth - set to null as per schema default
             updateData.dateOfBirth = null;
             console.log('API Profile PUT: Handling dateOfBirth, empty string/null, setting to null');
        }
    }

    // Include other fields if they are present in the incoming data (allows setting to empty string)
    if (data.email !== undefined) { updateData.email = data.email; console.log('API Profile PUT: Handling email:', updateData.email); }
    if (data.phoneNumber !== undefined) { updateData.phoneNumber = data.phoneNumber; console.log('API Profile PUT: Handling phoneNumber:', updateData.phoneNumber); }
    if (data.nationalCode !== undefined) { updateData.codiceFiscale = data.nationalCode; console.log('API Profile PUT: Handling nationalCode (codiceFiscale):', updateData.codiceFiscale); }
    if (data.homeAddress !== undefined) { updateData.homeAddress = data.homeAddress; console.log('API Profile PUT: Handling homeAddress:', updateData.homeAddress); }
    if (data.educationLevel !== undefined) { updateData.educationLevel = data.educationLevel; console.log('API Profile PUT: Handling educationLevel:', updateData.educationLevel); }
    if (data.country !== undefined) { 
      updateData.country = data.country; 
      console.log('API Profile PUT: Handling country - Raw value from request:', data.country);
      console.log('API Profile PUT: Handling country - Value being set in updateData:', updateData.country);
    }
    if (data.city !== undefined) { updateData.city = data.city; console.log('API Profile PUT: Handling city:', updateData.city); }
    
    // Handle medicalData updates - assuming full replace for now. Adjust if partial update needed.
    if (data.medicalData !== undefined) { updateData.medicalData = data.medicalData; console.log('API Profile PUT: Handling medicalData:', updateData.medicalData); }


    console.log('API Profile PUT: Prepared updateData:', updateData);

    // Ensure updateData is not empty, otherwise no update is needed
    if (Object.keys(updateData).length === 0) {
        console.log('API Profile PUT: updateData is empty, no fields to update.');
        return NextResponse.json({ success: true, message: 'No changes detected' });
    }

    console.log('API Profile PUT: Attempting to update user with userId:', userId, 'using findOneAndUpdate for write...');
    
    // Use findOneAndUpdate to perform the update. We won't rely on the returned document for response data.
    const updateResult = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) }, // Find criteria
      { $set: updateData }, // Use $set to update specific fields
      { runValidators: true } // Only run validators
    );
    
    console.log('API Profile PUT: findOneAndUpdate write result (not used for response data):', updateResult);

    if (!updateResult) {
      console.warn(`API Profile PUT: User not found for userId: ${userId} during findOneAndUpdate write.`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('API Profile PUT: Update operation completed. Fetching fresh document...');

    // Fetch the updated user document again to ensure we get the latest state
    const updatedUser = await User.findById(userId);
    
    if (!updatedUser) {
       console.error('API Profile PUT: Failed to fetch updated user document after update.');
       // Although update might have happened, we can't get the latest data
       return NextResponse.json({ error: 'Profile updated, but failed to fetch latest data.' }, { status: 500 });
    }

    console.log('API Profile PUT: Freshly fetched updated user document:', updatedUser);
    console.log('API Profile PUT: Country value in freshly fetched document:', updatedUser.country);

    // Reshape the returned user object to match the frontend's expected profileData format
    console.log('API Profile PUT: Debugging profileData construction from freshly fetched document and updateData:');
    console.log('API Profile PUT: updatedUser.dateOfBirth =', updatedUser?.dateOfBirth);
    console.log('API Profile PUT: updatedUser.educationLevel =', updatedUser?.educationLevel);
    console.log('API Profile PUT: updatedUser.country =', updatedUser?.country);
    console.log('API Profile PUT: updatedUser.city =', updatedUser?.city);
    console.log('API Profile PUT: updatedUser.medicalData =', updatedUser?.medicalData);
    console.log('API Profile PUT: updateData =', updateData);

    const profileData = {
      // Use values from updatedUser for reliably updating fields
      firstName: updatedUser?.name?.split(' ')[0] || '', // Split name into first name
      surname: updatedUser?.name?.split(' ').slice(1).join(' ') || '', // Rest of the name as surname
      nationalCode: updatedUser?.codiceFiscale || '',
      email: updatedUser?.email || '',
      phoneNumber: updatedUser?.phoneNumber || '',
      phoneCode: '+98', // Assuming static default or fetch from user if stored
      medicalData: updatedUser?.medicalData || {},

      // Use values from updateData for fields that were not updating reliably in fetched document
      dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth).toISOString().split('T')[0] : '', // Format date for frontend
      educationLevel: updateData.educationLevel || '',
      country: updateData.country || '',
      city: updateData.city || '',
    };

    console.log('API Profile PUT: Final profileData being returned (mixed data): ', profileData);
    console.log('API Profile PUT: Final country value being returned:', profileData.country);
    return NextResponse.json({ success: true, user: profileData });

  } catch (error) {
    console.error('Error in PUT /api/patient/profile:', error);
    // Check for Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
        // Construct a user-friendly error message from validation errors
        const validationErrors = Object.keys(error.errors).map(key => {
            // Provide a more specific message if available, otherwise use the path and kind
            const err = error.errors[key];
            return `${err.path}: ${err.message || err.kind}`;;
        });
        return NextResponse.json({ 
            error: 'Validation failed',
            details: 'One or more fields failed validation.',
            validationErrors: validationErrors
        }, { status: 400 }); // Use 400 for validation errors
    } else {
        return NextResponse.json({ 
          error: error.message || 'An unexpected error occurred',
          details: error.stack
        }, { status: 500 });
    }
  }
} 