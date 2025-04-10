"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Upload, User, Gift } from 'lucide-react';
import Link from 'next/link';

// Fallback sample data
const FALLBACK_SAMPLE_DATA = {
  historical: [
    { ds: '2025-01-01', y: 120 },
    { ds: '2025-01-02', y: 132 },
    { ds: '2025-01-03', y: 101 },
    { ds: '2025-01-04', y: 134 },
    { ds: '2025-01-05', y: 90 },
    { ds: '2025-01-06', y: 110 },
    { ds: '2025-01-07', y: 120 },
    { ds: '2025-01-08', y: 132 },
    { ds: '2025-01-09', y: 121 },
    { ds: '2025-01-10', y: 134 },
  ],
  forecast: [
    { date: '2025-01-11', forecast: 123, lower: 100, upper: 145 },
    { date: '2025-01-12', forecast: 125, lower: 105, upper: 148 },
    { date: '2025-01-13', forecast: 128, lower: 110, upper: 150 },
    { date: '2025-01-14', forecast: 130, lower: 112, upper: 152 },
    { date: '2025-01-15', forecast: 133, lower: 115, upper: 155 },
    { date: '2025-01-16', forecast: 135, lower: 118, upper: 158 },
    { date: '2025-01-17', forecast: 138, lower: 120, upper: 160 },
  ],
  top_items: [
    { item: "Chocolate Cake", quantity: 543 },
    { item: "Strawberry Cheesecake", quantity: 432 },
    { item: "Vanilla Cupcake", quantity: 387 },
    { item: "Tiramisu", quantity: 321 },
    { item: "Apple Pie", quantity: 289 }
  ]
};

export default function DessertDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [file, setFile] = useState(null);

  const processForecastData = (data) => {
    if (!data.historical || !data.forecast) return [];
    
    const combinedData = [
      ...data.historical.map(item => ({
        date: item.ds,
        actual: item.y,
        forecast: null,
        lower: null,
        upper: null
      })),
      ...data.forecast.map(item => ({
        date: item.date,
        actual: null,
        forecast: item.forecast,
        lower: item.lower,
        upper: item.upper
      }))
    ];
    return combinedData;
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/forecast', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      if (!data || !data.forecast) {
        throw new Error('Invalid response format');
      }

      setForecastData(data.forecast);
      setHistoricalData(data.historical || []);
      setTopItems(data.top_items || []);
      setActiveTab('overview');

    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setForecastData([]);
      setHistoricalData([]);
      setTopItems([]);
    }
  };

  useEffect(() => {
    const loadSampleData = async () => {
      setIsLoading(true);
      try {
        try {
          const response = await fetch('/sample-data.json');
          if (response.ok) {
            const data = await response.json();
            
            if (data && data.forecast && data.historical && data.top_items) {
              setForecastData(data.forecast);
              setHistoricalData(data.historical);
              setTopItems(data.top_items);
              setIsLoading(false);
              return;
            }
          }
          throw new Error('Failed to load sample data');
        } catch (fetchError) {
          console.error('Error loading sample data:', fetchError);
          throw fetchError;
        }
      } catch (error) {
        console.log('Using fallback sample data');
        setForecastData(FALLBACK_SAMPLE_DATA.forecast);
        setHistoricalData(FALLBACK_SAMPLE_DATA.historical);
        setTopItems(FALLBACK_SAMPLE_DATA.top_items);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSampleData();
  }, []);

  const OverviewTab = () => {
    const chartData = processForecastData({ historical: historicalData, forecast: forecastData });
    
    return (
      <div className="col-span-12 bg-white rounded-xl shadow-md p-6 border border-pink-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-800">Sales Forecast</h2>
          <div className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full font-medium">
            Next {forecastData.length} Days
          </div>
        </div>
        {chartData.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Actual Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">No forecast data available</p>
          </div>
        )}
      </div>
    );
  };

  const ProductsTab = () => (
    <div className="col-span-12 bg-white rounded-xl shadow-md p-6 border border-pink-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-800">Top Products</h2>
        <div className="text-sm text-pink-600 font-medium">
          Based on historical data
        </div>
      </div>
      {topItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topItems.map((item, index) => (
            <div key={index} className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h3 className="font-bold text-lg text-pink-800">{item.item}</h3>
              <p className="text-sm text-pink-600 mt-2">Total Sold:</p>
              <p className="text-xl font-bold text-pink-700">{item.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No product data available</p>
        </div>
      )}
    </div>
  );

  const ForecastTab = () => (
    <div className="col-span-12 bg-white rounded-xl shadow-md p-6 border border-pink-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-800">Detailed Forecast</h2>
        <div className="text-sm text-gray-500 bg-pink-100 px-3 py-1 rounded-full">
          Next {forecastData.length} Days
        </div>
      </div>
      {forecastData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-gray-600 pb-3">Date</th>
                <th className="text-right text-sm font-semibold text-gray-600 pb-3">Forecast</th>
                <th className="text-right text-sm font-semibold text-gray-600 pb-3">Min</th>
                <th className="text-right text-sm font-semibold text-gray-600 pb-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forecastData.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm font-medium text-gray-800">{item.date}</td>
                  <td className="py-3 text-right text-sm text-gray-600">{Number(item.forecast).toFixed(2)}</td>
                  <td className="py-3 text-right text-sm text-gray-600">{Number(item.lower).toFixed(2)}</td>
                  <td className="py-3 text-right text-sm text-gray-600">{Number(item.upper).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No forecast data available</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'products':
        return <ProductsTab />;
      case 'forecast':
        return <ForecastTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen font-sans">
      <header className="bg-pink-200 shadow-sm">
        <div className="mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-pink-600" />
            <h1 className="ml-3 text-2xl font-bold text-pink-800">Strictly Desserts</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-pink-600" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Upload Data
              </label>
            </div>
            <button className="p-2 rounded-full hover:bg-pink-300 transition-colors">
              <User className="h-6 w-6 text-pink-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-pink-100'}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'products' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-pink-100'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'forecast' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-pink-100'}`}
            onClick={() => setActiveTab('forecast')}
          >
            Forecast
          </button>
          <Link 
            href="/recommendations" 
            className="flex items-center px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-pink-100 transition-all"
          >
            <Gift className="w-4 h-4 mr-2" />
            Recommendations
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {renderTabContent()}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-pink-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-pink-600 mb-2 md:mb-0">
              © 2025 Strictly Desserts. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 