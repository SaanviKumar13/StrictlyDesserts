"use client";
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Gift } from 'lucide-react';

// Sample data for upcoming events and recommendations
const SAMPLE_EVENTS = [
  {
    date: '2024-04-14',
    name: 'Easter Sunday',
    type: 'holiday',
    recommended_items: ['Chocolate Easter Eggs', 'Hot Cross Buns', 'Carrot Cake'],
    expected_sales_increase: 45
  },
  {
    date: '2024-05-12',
    name: 'Mother\'s Day',
    type: 'holiday',
    recommended_items: ['Red Velvet Cake', 'Chocolate Truffles', 'Fruit Tart'],
    expected_sales_increase: 60
  },
  {
    date: '2024-06-16',
    name: 'Father\'s Day',
    type: 'holiday',
    recommended_items: ['Chocolate Fudge Cake', 'Cheesecake', 'Apple Pie'],
    expected_sales_increase: 40
  }
];

export default function RecommendationsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real application, this would fetch from an API
    setEvents(SAMPLE_EVENTS);
  }, []);

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-pink-600 mr-2" />
          <h3 className="text-lg font-bold text-pink-800">{event.name}</h3>
        </div>
        <span className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
          {new Date(event.date).toLocaleDateString()}
        </span>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Recommended Items:</h4>
        <div className="flex flex-wrap gap-2">
          {event.recommended_items.map((item, index) => (
            <span key={index} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
        <span className="text-green-600 font-semibold">
          Expected Sales Increase: +{event.expected_sales_increase}%
        </span>
      </div>
    </div>
  );

  const RecommendationsSummary = () => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100 mb-6">
      <h2 className="text-xl font-bold text-pink-800 mb-4">Current Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="font-semibold text-pink-800">Top Seasonal Items</h3>
          <ul className="mt-2 space-y-1">
            <li className="text-pink-700">• Chocolate Easter Eggs</li>
            <li className="text-pink-700">• Hot Cross Buns</li>
            <li className="text-pink-700">• Carrot Cake</li>
          </ul>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="font-semibold text-pink-800">Promotion Strategy</h3>
          <ul className="mt-2 space-y-1">
            <li className="text-pink-700">• Bundle deals for holidays</li>
            <li className="text-pink-700">• Special holiday packaging</li>
            <li className="text-pink-700">• Limited edition items</li>
          </ul>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="font-semibold text-pink-800">Inventory Planning</h3>
          <ul className="mt-2 space-y-1">
            <li className="text-pink-700">• Increase stock by 50%</li>
            <li className="text-pink-700">• Prepare special ingredients</li>
            <li className="text-pink-700">• Schedule extra staff</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-pink-800">Food Recommendations & Predictions</h1>
          <div className="flex items-center text-pink-600">
            <Gift className="w-5 h-5 mr-2" />
            <span className="text-sm">Upcoming Events</span>
          </div>
        </div>

        <RecommendationsSummary />

        <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
          <h2 className="text-xl font-bold text-pink-800 mb-4">Upcoming Events & Predictions</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 