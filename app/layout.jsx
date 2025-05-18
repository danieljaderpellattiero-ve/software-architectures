import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from './providers';

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
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
