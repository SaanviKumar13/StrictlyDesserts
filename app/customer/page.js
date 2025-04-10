"use client";
import { Cake, Cookie, Gift, MapPin, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CustomerLandingPage() {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/customer" className="flex items-center">
            <h1 className="text-2xl font-bold text-pink-800">Strictly Desserts</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/customer/order" className="text-pink-700 hover:text-pink-900">
              Order
            </Link>
            <Link href="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-pink-700" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-pink-800 mb-4">
            Discover Local Bakeries
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Find and order from the best bakeries in your area
          </p>
          <Link
            href="/customer/order"
            className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Start Ordering
          </Link>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-pink-800 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/customer/order?category=cakes"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Cake className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold text-pink-800">Cakes</h3>
                <p className="text-gray-600 text-center mt-2">
                  Custom cakes and desserts
                </p>
              </div>
            </Link>
            <Link
              href="/customer/order?category=cookies"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Cookie className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold text-pink-800">Cookies</h3>
                <p className="text-gray-600 text-center mt-2">
                  Freshly baked cookies
                </p>
              </div>
            </Link>
            <Link
              href="/customer/order?category=special"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Gift className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold text-pink-800">Special</h3>
                <p className="text-gray-600 text-center mt-2">
                  Seasonal and special treats
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-pink-600 mr-2" />
              <h3 className="text-lg font-semibold text-pink-800">Local Bakeries</h3>
            </div>
            <p className="text-gray-600">
              Support your local bakeries and discover hidden gems in your area
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Gift className="h-6 w-6 text-pink-600 mr-2" />
              <h3 className="text-lg font-semibold text-pink-800">Special Offers</h3>
            </div>
            <p className="text-gray-600">
              Get exclusive deals and discounts from your favorite bakeries
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-pink-600 mr-2" />
              <h3 className="text-lg font-semibold text-pink-800">Fresh Desserts</h3>
            </div>
            <p className="text-gray-600">
              Enjoy freshly baked desserts made with love and care
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-pink-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-sm text-pink-600">
            © 2025 Strictly Desserts. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 