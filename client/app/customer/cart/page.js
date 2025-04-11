"use client";
import { useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Sample cart items
const SAMPLE_CART_ITEMS = [
  {
    id: 1,
    name: "Chocolate Fudge Cake",
    bakery: "Sweet Delights",
    price: 24.99,
    quantity: 1,
    image: "/recommendations/chocolate-fudge.jpg"
  },
  {
    id: 2,
    name: "Red Velvet Cupcake",
    bakery: "Cupcake Heaven",
    price: 3.99,
    quantity: 4,
    image: "/recommendations/red-velvet.jpg"
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/customer" className="flex items-center">
            <h1 className="text-2xl font-bold text-pink-800">Strictly Desserts</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/customer/order" className="text-pink-600 hover:text-pink-800">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/customer/order" className="flex items-center text-pink-600 hover:text-pink-800 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Menu
          </Link>
          <h2 className="text-2xl font-bold text-pink-800">Your Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-pink-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Looks like you haven't added any items yet.</p>
            <Link
              href="/customer/order"
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-pink-100 pb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4">
                        {/* Image placeholder */}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-pink-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.bakery}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-pink-300 rounded-l-lg text-black"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center border-t border-b border-pink-300 text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-pink-300 rounded-r-lg text-black"
                          >
                            +
                          </button>
                          <span className="ml-4 font-semibold text-pink-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span style={{ color: '#f48fb1' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span style={{ color: '#f48fb1' }}>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span style={{ color: '#f48fb1' }}>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-pink-100 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-pink-800">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                      <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Enter your delivery address"
                          style={{ '::placeholder': { color: '#f48fb1' } }}
                        />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions
                    </label>
                    <textarea
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                      style={{ '::placeholder': { color: '#f48fb1' } }}
                    />
                  </div>
                  <button
                    className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                    onClick={() => alert('Order placed successfully!')}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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