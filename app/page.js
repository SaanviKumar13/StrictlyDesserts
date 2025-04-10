"use client";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-pink-800 text-center mb-8">
          Strictly Desserts
        </h1>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
          >
            Login as Client
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-pink-600">or</span>
            </div>
          </div>
          
          <Link
            href="/customer"
            className="block w-full bg-white text-pink-600 text-center py-3 rounded-lg border-2 border-pink-600 hover:bg-pink-50 transition-colors font-semibold"
          >
            Continue as Customer
          </Link>
        </div>
        
        <p className="mt-8 text-center text-black text-sm">
          Welcome to Strictly Desserts! Please select your role to continue.
        </p>
      </div>
    </div>
  );
} 