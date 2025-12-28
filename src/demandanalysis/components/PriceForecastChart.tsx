import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { PriceForecast } from '../types/market';

interface PriceForecastChartProps {
  forecasts: PriceForecast[];
  variety: string;
}

export const PriceForecastChart: React.FC<PriceForecastChartProps> = ({
  forecasts,
  variety
}) => {
  if (forecasts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-700" size={20} />
          Price Forecast
        </h3>
        <p className="text-gray-900 font-bold">No forecast data available for this crop.</p>
      </div>
    );
  }

  const chartData = forecasts.map(f => ({
    date: new Date(f.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    price: f.predictedPrice,
    confidence: f.confidence * 100
  }));

  const currentPrice = forecasts[0]?.predictedPrice || 0;
  const futurePrice = forecasts[forecasts.length - 1]?.predictedPrice || 0;
  const priceChange = ((futurePrice - currentPrice) / currentPrice) * 100;

  return (
    <div className="chart-container animate-slide-up border-2 border-gray-200 rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mr-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <TrendingUp className="text-white" size={20} />
          </div>
          Price Forecast - {variety}
        </h3>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900 mb-1">12-Month Trend</p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-black ${
            priceChange >= 0 
              ? 'bg-green-100 text-green-900 border-2 border-green-300' 
              : 'bg-red-100 text-red-900 border-2 border-red-300'
          }`}>
            {priceChange >= 0 ? '↗' : '↘'} {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="h-80 mb-8 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.8} />
            <XAxis 
              dataKey="date" 
              stroke="#0f172a"
              fontSize={12}
              fontWeight={800}
              tickLine={true}
              axisLine={true}
            />
            <YAxis 
              stroke="#0f172a"
              fontSize={12}
              fontWeight={800}
              tickFormatter={(value) => `₹${value}`}
              tickLine={true}
              axisLine={true}
            />
            <Tooltip 
              formatter={(value: number) => [`₹${value}/quintal`, 'Predicted Price']}
              labelStyle={{ color: '#0f172a', fontWeight: 800 }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                border: '2px solid #3B82F6',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1E40AF"
              strokeWidth={4}
              fill="url(#priceGradient)"
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-blue-700 font-semibold">Current Predicted Price</p>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-1">₹{currentPrice}</p>
          <p className="text-sm text-blue-600 font-medium">/quintal</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-700 font-semibold">12-Month Forecast</p>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-green-900 mb-1">₹{futurePrice}</p>
          <p className="text-sm text-green-600 font-medium">/quintal</p>
        </div>
      </div>
    </div>
  );
};
