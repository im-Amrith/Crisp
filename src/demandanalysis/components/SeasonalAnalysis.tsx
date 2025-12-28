import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { SeasonalPattern } from '../types/market';

interface SeasonalAnalysisProps {
  patterns: SeasonalPattern[];
  variety: string;
}

export const SeasonalAnalysis: React.FC<SeasonalAnalysisProps> = ({
  patterns,
  variety
}) => {
  if (patterns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="mr-2 text-orange-700" size={20} />
          Seasonal Analysis
        </h3>
        <p className="text-gray-900 font-bold">No seasonal data available for this crop.</p>
      </div>
    );
  }

  const chartData = patterns.map(p => ({
    month: p.month.substring(0, 3),
    price: p.averagePrice,
    index: p.priceIndex,
    recommendation: p.recommendation
  }));

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent': return '#047857';
      case 'good': return '#1D4ED8';
      case 'average': return '#B45309';
      case 'poor': return '#B91C1C';
      default: return '#374151';
    }
  };

  const bestMonths = patterns
    .filter(p => p.recommendation === 'excellent' || p.recommendation === 'good')
    .map(p => p.month);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Calendar className="mr-2 text-orange-700" size={20} />
          Seasonal Price Analysis - {variety}
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-900 font-bold">Best Selling Months</p>
          <p className="text-lg font-black text-green-700">
            {bestMonths.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>

      <div className="h-80 mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" />
            <XAxis 
              dataKey="month" 
              stroke="#0f172a"
              fontSize={12}
              fontWeight={800}
            />
            <YAxis 
              stroke="#0f172a"
              fontSize={12}
              fontWeight={800}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'price') return [`₹${value}/quintal`, 'Average Price'];
                return [value, name];
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 800 }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid #3B82F6',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="price" 
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {patterns.map((p) => (
          <div 
            key={p.month}
            className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
              p.recommendation === 'excellent' 
                ? 'bg-green-100 border-green-500 shadow-md scale-105' 
                : 'bg-white border-gray-300'
            }`}
          >
            <p className="text-sm font-black text-gray-900 mb-1">{p.month}</p>
            <p className="text-lg font-black text-gray-900">₹{Math.round(p.averagePrice)}</p>
            <div className={`mt-2 text-[10px] uppercase font-black px-2 py-1 rounded-full inline-block ${
              p.recommendation === 'excellent' ? 'bg-green-700 text-white' :
              p.recommendation === 'good' ? 'bg-blue-700 text-white' :
              p.recommendation === 'average' ? 'bg-yellow-600 text-white' :
              'bg-red-700 text-white'
            }`}>
              {p.recommendation}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
        <h4 className="font-black text-orange-900 mb-2 flex items-center">
          <TrendingUp className="mr-2 text-orange-700" size={16} />
          Seasonal Insights
        </h4>
        <ul className="text-orange-900 text-sm font-bold space-y-1">
          <li>• Best selling months: {bestMonths.join(', ')}</li>
          <li>• Avoid selling during low-price months for better profits</li>
          <li>• Plan your harvest timing based on seasonal trends</li>
          <li>• Store produce during low-price periods if possible</li>
        </ul>
      </div>
    </div>
  );
};
