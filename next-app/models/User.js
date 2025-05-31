import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  codiceFiscale: {
    type: String,
    required: [true, 'Please provide a Codice Fiscale'],
    unique: true
  },
  homeAddress: {
    type: String,
    required: [true, 'Please provide a home address']
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  educationLevel: {
    type: String,
    enum: ['', 'software', 'engineering', 'medicine'],
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  medicalData: {
    height: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
    },
    bloodType: {
      type: String,
      default: null
    }
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  twoFactorSecret: {
    type: String,
    default: null
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  analyzedPdfData: {
    type: String,
    default: null
  },
  uploadedPdfBase64: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    return next();
  }

  // Check if the password is already hashed
  if (this.password.startsWith('$2a$')) {
    console.log('Password is already hashed, skipping hashing');
    return next();
  }

  try {
    console.log('=== Password Hashing Debug ===');
    console.log('Original password:', this.password);
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt:', salt);
    const hash = await bcrypt.hash(this.password, salt);
    console.log('Generated hash:', hash);
    this.password = hash;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    console.log('=== Password Comparison Debug ===');
    console.log('Entered password:', enteredPassword);
    console.log('Stored hash:', this.password);
    
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Check if the model already exists to prevent overwriting
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
