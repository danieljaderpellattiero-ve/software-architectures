import connectDB from './config/database.js';
import User from './models/User.js';

// Connect to the database
await connectDB();
console.log("Connected to database");

async function addTestUser() {
    try {
        const newUser = new User({
            name: "John Doe",
            email: "johndoe@example.com",
            role: "patient",
            password: "securepassword123", // Hash passwords in production!
        });

        const savedUser = await newUser.save();
        console.log("User added successfully:", savedUser);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

await addTestUser();
