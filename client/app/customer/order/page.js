"use client";
import { useState, useEffect } from 'react';
import { MapPin, Star, Gift, Clock, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

// Sample data for bakeries
const SAMPLE_BAKERIES = [
  {
    id: 1,
    name: "Sweet Delights",
    rating: 4.8,
    distance: "0.5 miles",
    specialties: ["Cakes", "Cupcakes", "Cookies"],
    image: "/bakeries/sweet-delights.jpg",
    offers: ["10% off on all cakes", "Buy 2 get 1 free on cookies"],
    festivalOffers: ["Special Diwali sweets box - 20% off"]
  },
  {
    id: 2,
    name: "Bake & Take",
    rating: 4.6,
    distance: "1.2 miles",
    specialties: ["Bread", "Pastries", "Muffins"],
    image: "/bakeries/bake-take.jpg",
    offers: ["15% off on first order", "Free delivery on orders above $30"],
    festivalOffers: ["Christmas special cake - 25% off"]
  },
  {
    id: 3,
    name: "Cupcake Heaven",
    rating: 4.9,
    distance: "0.8 miles",
    specialties: ["Cupcakes", "Cake Pops", "Macarons"],
    image: "/bakeries/cupcake-heaven.jpg",
    offers: ["20% off on bulk orders", "Free customization"],
    festivalOffers: ["Easter special cupcake box - 15% off"]
  }
];

// Sample recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Chocolate Fudge Cake",
    bakery: "Sweet Delights",
    price: "$24.99",
    image: "/recommendations/chocolate-fudge.jpg",
    rating: 4.9
  },
  {
    id: 2,
    name: "Red Velvet Cupcake",
    bakery: "Cupcake Heaven",
    price: "$3.99",
    image: "/recommendations/red-velvet.jpg",
    rating: 4.8
  },
  {
    id: 3,
    name: "Sourdough Bread",
    bakery: "Bake & Take",
    price: "$8.99",
    image: "/recommendations/sourdough.jpg",
    rating: 4.7
  }
];

export default function CustomerOrderPage() {
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
          console.error("Error getting location:", error);
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search bakeries or items..."
                className="w-64 px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location and Categories */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-pink-600 mr-2" />
            <span className="text-gray-700">
              {location ? `Near you (${location.lat.toFixed(2)}, ${location.lng.toFixed(2)})` : 'Getting your location...'}
            </span>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {['all', 'cakes', 'cookies', 'bread', 'pastries'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-pink-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDATIONS.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {/* Image placeholder */}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-pink-800">{item.name}</h3> {/* Changed to text-pink-800 */}
                    <span className="text-pink-600 font-semibold">{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.bakery}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-black">{item.rating}</span> {/* Changed to black */}
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bakeries Section */}
        <section>
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Nearby Bakeries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BAKERIES.map((bakery) => (
              <div key={bakery.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {/* Image placeholder */}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-pink-800">{bakery.name}</h3> {/* Changed to text-pink-800 */}
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-black">{bakery.rating}</span> {/* Changed to black */}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{bakery.distance} away</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-bold text-black text-sm">Specialties:</h4> {/* Changed to black bold */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {bakery.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-black text-sm flex items-center"> {/* Changed to black bold */}
                      <Gift className="h-4 w-4 mr-1" />
                      Current Offers
                    </h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      {bakery.offers.map((offer, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                          {offer}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-black text-sm flex items-center"> {/* Changed to black bold */}
                      <Gift className="h-4 w-4 mr-1" />
                      Festival Offers
                    </h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      {bakery.festivalOffers.map((offer, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                          {offer}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    onClick={() => window.location.href = `/customer/bakery/${bakery.id}`}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-pink-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-sm text-pink-600 text-center">
            © 2025 Strictly Desserts. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}