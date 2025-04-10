"use client";
import { useState } from 'react';
import { MapPin, Star, Clock, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Sample bakery data
const SAMPLE_BAKERY = {
  id: 1,
  name: "Sweet Delights",
  rating: 4.8,
  distance: "0.5 miles",
  specialties: ["Cakes", "Cupcakes", "Cookies"],
  image: "/bakeries/sweet-delights.jpg",
  description: "A family-owned bakery specializing in custom cakes and desserts. We use only the finest ingredients to create delicious treats that will make your special occasions even more memorable.",
  hours: {
    monday: "9:00 AM - 8:00 PM",
    tuesday: "9:00 AM - 8:00 PM",
    wednesday: "9:00 AM - 8:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 9:00 PM",
    saturday: "10:00 AM - 9:00 PM",
    sunday: "10:00 AM - 6:00 PM"
  },
  menu: [
    {
      id: 1,
      category: "Cakes",
      items: [
        {
          id: 101,
          name: "Chocolate Fudge Cake",
          description: "Rich chocolate cake with fudge filling and chocolate ganache",
          price: 24.99,
          image: "/menu/chocolate-fudge.jpg"
        },
        {
          id: 102,
          name: "Red Velvet Cake",
          description: "Classic red velvet with cream cheese frosting",
          price: 26.99,
          image: "/menu/red-velvet.jpg"
        }
      ]
    },
    {
      id: 2,
      category: "Cupcakes",
      items: [
        {
          id: 201,
          name: "Vanilla Cupcake",
          description: "Light and fluffy vanilla cupcake with buttercream frosting",
          price: 3.99,
          image: "/menu/vanilla-cupcake.jpg"
        },
        {
          id: 202,
          name: "Chocolate Cupcake",
          description: "Rich chocolate cupcake with chocolate ganache",
          price: 3.99,
          image: "/menu/chocolate-cupcake.jpg"
        }
      ]
    }
  ]
};

export default function BakeryPage({ params }) {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/customer/order" className="flex items-center">
            <h1 className="text-2xl font-bold text-pink-800">Strictly Desserts</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-pink-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/customer/order" className="flex items-center text-pink-600 hover:text-pink-800 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bakeries
          </Link>
        </div>

        {/* Bakery Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-64 bg-gray-200 rounded-lg">
              {/* Image placeholder */}
            </div>
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-pink-800">{SAMPLE_BAKERY.name}</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{SAMPLE_BAKERY.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{SAMPLE_BAKERY.distance} away</span>
              </div>
              <p className="text-gray-600 mb-4">{SAMPLE_BAKERY.description}</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_BAKERY.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="flex space-x-4 overflow-x-auto pb-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Items
          </button>
          {SAMPLE_BAKERY.menu.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category.category.toLowerCase()
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-pink-100'
              }`}
              onClick={() => setSelectedCategory(category.category.toLowerCase())}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_BAKERY.menu.map((category) => (
            category.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {/* Image placeholder */}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-pink-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-semibold">${item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ))}
        </div>

        {/* Hours */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-pink-800 mb-4">Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(SAMPLE_BAKERY.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
                <span className="text-gray-600">{hours}</span>
              </div>
            ))}
          </div>
        </div>
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