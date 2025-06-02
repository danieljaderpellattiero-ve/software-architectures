import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from './providers';
import { AuthProvider } from '@/context/AuthContext';
import React, { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Healthcare Management System",
  description: "A comprehensive healthcare management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
