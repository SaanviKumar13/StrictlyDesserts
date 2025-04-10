"use client";
import Link from 'next/link';
import { Cake, Cookie, Bread, Gift, MapPin } from 'lucide-react';

export default function CustomerLandingPage() {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/customer" className="flex items-center">
            <h1 className="text-2xl font-bold text-pink-800">Strictly Desserts</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/customer/order" className="text-pink-600 hover:text-pink-800">
              Order Now
            </Link>
            <Link href="/customer/cart" className="text-pink-600 hover:text-pink-800">
              Cart
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-100 to-pink-200 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-pink-800 mb-6">
                Discover Local Bakeries Near You
              </h1>
              <p className="text-xl text-pink-600 mb-8">
                Order fresh, homemade desserts from your favorite local bakeries
              </p>
              <Link
                href="/customer/order"
                className="bg-pink-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Start Ordering
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/customer/order?category=cakes"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <Cake className="h-12 w-12 text-pink-600 mb-4" />
                  <h3 className="text-xl font-semibold text-pink-800">Cakes</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Birthday cakes, wedding cakes, and more
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
                    Freshly baked cookies and biscuits
                  </p>
                </div>
              </Link>
              <Link
                href="/customer/order?category=bread"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <Bread className="h-12 w-12 text-pink-600 mb-4" />
                  <h3 className="text-xl font-semibold text-pink-800">Bread</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Artisan bread and pastries
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
                    Festival specials and seasonal treats
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pink-800 mb-2">
                  Local Bakeries
                </h3>
                <p className="text-gray-600">
                  Support your local bakers and enjoy fresh, homemade desserts
                </p>
              </div>
              <div className="text-center">
                <Gift className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pink-800 mb-2">
                  Special Offers
                </h3>
                <p className="text-gray-600">
                  Exclusive deals and festival specials from your favorite bakeries
                </p>
              </div>
              <div className="text-center">
                <Cake className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pink-800 mb-2">
                  Fresh & Delicious
                </h3>
                <p className="text-gray-600">
                  Handcrafted desserts made with love and premium ingredients
                </p>
              </div>
            </div>
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