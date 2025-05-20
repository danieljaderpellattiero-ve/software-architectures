import connectDB from './config/database.js';
import Patient from './models/Patient.js'; // The Patient model

// Connect to the database
await connectDB();
console.log("Connected to database");

// Add a Test Patient
async function addTestPatient() {
    try {
        // Creating a new patient instance
        const newPatient = new Patient({
            name: "Jane Doe",
            age: 30,
            gender: "female",
            address: "123 Main St, Venice, Italy",
            contactNumber: "+39 123 456 789",
            medicalHistory: ["hypertension", "allergy to penicillin"]
        });

        // Save the new patient to the database
        const savedPatient = await newPatient.save();
        console.log("Patient added successfully:", savedPatient);
    } catch (error) {
        console.error("Error adding patient:", error);
    }
}

await addTestPatient();
