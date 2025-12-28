import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

interface EnvironmentalStatsProps {
  stats: Stat[];
}

const EnvironmentalStats: React.FC<EnvironmentalStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-green-50 hover:border-green-200 transition-all transform hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="mr-4 p-3 bg-green-100 rounded-xl text-green-700 shadow-inner">
              {stat.icon}
            </div>
            <h3 className="text-lg font-black text-black uppercase tracking-tight">{stat.label}</h3>
          </div>
          
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-black text-green-800">
              {stat.value}
              {stat.unit && <span className="text-xl ml-1 text-black font-bold">{stat.unit}</span>}
            </p>
            
            {stat.trend && (
              <div className={`flex items-center px-2 py-1 rounded-full font-black text-sm ${
                stat.trend === 'up' ? 'bg-red-100 text-red-800' : 
                stat.trend === 'down' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-black'
              }`}>
                {stat.trend === 'up' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {stat.trend === 'down' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {stat.trend === 'stable' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                  </svg>
                )}
                <span>{stat.trendValue}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnvironmentalStats;
