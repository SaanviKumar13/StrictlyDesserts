"use client";
import { useState, useEffect } from 'react';
import { Search, MapPin, Star, ShoppingCart, Filter } from 'lucide-react';
import Link from 'next/link';

// Sample data with dummy images
const SAMPLE_BAKERIES = [
  {
    id: 1,
    name: "Sweet Delights",
    rating: 4.8,
    distance: "0.5 miles",
    specialties: ["Cakes", "Cupcakes", "Cookies"],
    image: "https://placehold.co/400x300/pink/white?text=Sweet+Delights"
  },
  {
    id: 2,
    name: "Cupcake Heaven",
    rating: 4.6,
    distance: "1.2 miles",
    specialties: ["Cupcakes", "Cakes", "Pastries"],
    image: "https://placehold.co/400x300/pink/white?text=Cupcake+Heaven"
  },
  {
    id: 3,
    name: "Cookie Corner",
    rating: 4.7,
    distance: "0.8 miles",
    specialties: ["Cookies", "Brownies", "Bars"],
    image: "https://placehold.co/400x300/pink/white?text=Cookie+Corner"
  }
];

const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    name: "Chocolate Fudge Cake",
    bakery: "Sweet Delights",
    price: 24.99,
    rating: 4.9,
    image: "https://placehold.co/400x300/pink/white?text=Chocolate+Fudge+Cake"
  },
  {
    id: 2,
    name: "Red Velvet Cupcake",
    bakery: "Cupcake Heaven",
    price: 3.99,
    rating: 4.8,
    image: "https://placehold.co/400x300/pink/white?text=Red+Velvet+Cupcake"
  },
  {
    id: 3,
    name: "Chocolate Chip Cookie",
    bakery: "Cookie Corner",
    price: 2.99,
    rating: 4.7,
    image: "https://placehold.co/400x300/pink/white?text=Chocolate+Chip+Cookie"
  }
];

export default function OrderPage() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/customer" className="flex items-center">
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
        {/* Search and Location */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for bakeries or desserts..."
                className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center text-pink-700">
              <MapPin className="h-5 w-5 mr-2" />
              <span>
                {location
                  ? `Near ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
                  : 'Getting location...'}
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 overflow-x-auto pb-2 mb-8">
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'cakes'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory('cakes')}
          >
            Cakes
          </button>
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'cookies'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory('cookies')}
          >
            Cookies
          </button>
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'special'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
            onClick={() => setSelectedCategory('special')}
          >
            Special
          </button>
        </div>

        {/* Recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_RECOMMENDATIONS.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-pink-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.bakery}</p>
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
            ))}
          </div>
        </section>

        {/* Nearby Bakeries */}
        <section>
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Nearby Bakeries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BAKERIES.map((bakery) => (
              <div key={bakery.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img
                    src={bakery.image}
                    alt={bakery.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-pink-800">{bakery.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span>{bakery.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{bakery.distance} away</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bakery.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/customer/bakery/${bakery.id}`}
                    className="block w-full bg-pink-500 text-white text-center py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
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