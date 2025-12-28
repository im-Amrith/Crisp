import React from 'react';
import { MapPin, TrendingUp, Star } from 'lucide-react';
import { MarketInfo } from '../types/market';

interface StateMarketRecommendationsProps {
  markets: MarketInfo[];
  variety: string;
  state?: string;
}

export const StateMarketRecommendations: React.FC<StateMarketRecommendationsProps> = ({
  markets,
  variety,
  state
}) => {
  if (!state) {
    return null; // Don't render anything if no state is selected
  }

  if (markets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Star className="mr-2 text-blue-700" size={20} />
          Top Markets in {state} for {variety}
        </h3>
        <p className="text-gray-900 font-bold">No specific market data available for this state and crop combination.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Star className="mr-2 text-blue-700" size={20} />
          Top Markets in {state} for {variety}
        </h3>
        <p className="text-sm text-gray-900 font-bold">
          Showing top {markets.length} recommendations
        </p>
      </div>

      <div className="space-y-4">
        {markets.map((market, index) => (
          <div 
            key={`${market.state}-${market.district}-${market.market}`}
            className="p-4 rounded-lg border-2 border-gray-400 bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div>
                  <h4 className="font-black text-gray-900">{market.market}</h4>
                  <p className="text-sm text-gray-900 font-black flex items-center">
                    <MapPin className="mr-1 text-gray-900" size={14} />
                    {market.district}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-black text-green-700">
                  High: ₹{market.highPrice} <span className="text-sm font-black text-gray-900">({market.highPriceMonth})</span>
                </p>
                <p className="text-md font-black text-red-700">
                  Low: ₹{market.lowPrice} <span className="text-sm font-black text-gray-900">({market.lowPriceMonth})</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
