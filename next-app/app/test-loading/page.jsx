'use client';

import { Suspense } from 'react';
import Loading from '../loading';

// Simulated async data fetching component
async function DataComponent() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Data Loaded!</h2>
      <p className="text-gray-600">This content was loaded after a 2-second delay.</p>
    </div>
  );
}

export default function TestLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Suspense Loading Test</h1>
      
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </div>
  );
} 