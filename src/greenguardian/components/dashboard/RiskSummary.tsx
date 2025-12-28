import React from 'react';

interface RiskSummaryProps {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  recommendations: string[];
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ riskLevel, summary, recommendations }) => {
  const riskClasses = {
    low: 'bg-green-100 border-l-4 border-green-500',
    medium: 'bg-yellow-100 border-l-4 border-yellow-500',
    high: 'bg-red-100 border-l-4 border-red-500'
  };

  const riskLabels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${riskClasses[riskLevel]} text-gray-900`}>
      <div className="flex items-center mb-3">
        <div className="mr-2">
          {riskLevel === 'low' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {riskLevel === 'medium' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {riskLevel === 'high' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{riskLabels[riskLevel]}</h3>
      </div>
      
      <p className="mb-4 text-gray-900">{summary}</p>
      
      <div>
        <h4 className="font-medium mb-2 text-gray-900">Recommendations:</h4>
        <ul className="list-disc pl-5 space-y-1 text-gray-900">
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskSummary;
