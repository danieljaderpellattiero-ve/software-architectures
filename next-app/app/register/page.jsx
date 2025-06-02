'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterPage() {
  
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // For step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codiceFiscale, setCodiceFiscale] = useState("");

  // For step 2
  const [homeAddress, setHomeAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
          phoneNumber,
          codiceFiscale,
          homeAddress,
          medicalData: {
            height,
            weight,
            bloodType,
          },
          role: "patient"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError("An error occurred during registration");
    }
  };

  const primaryColor = 'purple-600';
  const primaryHoverColor = 'purple-700';
  const textColor = 'gray-800';
  const secondaryTextColor = 'gray-600';
  const backgroundColor = 'gray-100';
  const cardBackgroundColor = 'white';
  const borderColor = 'gray-300';
  const focusBorderColor = 'purple-600';

  return (
    <div className={`font-sans bg-${backgroundColor} text-${textColor} flex justify-center items-center min-h-screen py-5 sm:py-20`}>
      <div className={`max-w-md w-full p-8 bg-${cardBackgroundColor} rounded-lg shadow-lg`}>
        <h1 className={`text-2xl sm:text-3xl text-${primaryColor} text-center mb-5`}>Register Now!</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <form className="flex flex-col" onSubmit={handleNext}>
            <label className={`mb-1 font-bold text-${textColor}`}>First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Codice Fiscale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={codiceFiscale}
              onChange={(e) => setCodiceFiscale(e.target.value)}
              placeholder="Enter your Codice Fiscale"
              required
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`mb-5 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <input type="submit" className={`bg-${primaryColor} text-white font-bold text-sm py-3 rounded-md cursor-pointer transition-colors hover:bg-${primaryHoverColor}`} value="Continue" />
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="flex flex-col" onSubmit={handleRegister}>
            <label className={`mb-1 font-bold text-${textColor}`}>Blood Type</label>
            <input
              type="text"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              placeholder="Enter your Blood Type"
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Height (cm)</label>
            <input
              type="number"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Weight (kg)</label>
            <input
              type="number"
              className={`mb-3 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
            <label className={`mb-1 font-bold text-${textColor}`}>Current Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mb-5 px-4 py-3 border border-${borderColor} rounded-md text-sm bg-gray-50 focus:border-${focusBorderColor} focus:outline-none`}
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Enter your current address"
            />
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <button type="button" className={`bg-${primaryColor} text-white font-bold text-sm py-3 rounded-md cursor-pointer transition-colors hover:bg-${primaryHoverColor}`} onClick={handlePrev}>
                Back
              </button>
              <input type="submit" className={`bg-${primaryColor} text-white font-bold text-sm py-3 rounded-md cursor-pointer transition-colors hover:bg-${primaryHoverColor} mt-2 sm:mt-0`} value="Register" />
            </div>
          </form>
        )}

        <p className={`text-center mt-5 text-sm text-${secondaryTextColor}`}>
          Already have an account? <Link href="/login" className={`text-${primaryColor} font-bold hover:text-${primaryHoverColor} transition-colors`}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;