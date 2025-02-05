
import { TrendingUp, Percent } from 'lucide-react';

const MortgageRatePage = () => {
  // Dummy data for mortgage rates
  const mortgageRates = [
    { type: '30-Year Fixed', rate: 6.75, change: '+0.02' },
    { type: '15-Year Fixed', rate: 5.95, change: '+0.01' },
    { type: '5/1 ARM', rate: 5.25, change: '-0.03' },
    { type: 'FHA 30-Year Fixed', rate: 6.25, change: '+0.02' },
    { type: 'VA 30-Year Fixed', rate: 6.00, change: '0.00' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Percent className="h-8 w-8 mr-2 text-blue-600" />
          Current Mortgage Rates
        </h1>
        <p className="text-lg text-gray-600">
          Stay informed with today's mortgage rates and market trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rates Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Today's Rates
          </h2>
          <div className="space-y-4">
            {mortgageRates.map((rate, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{rate.type}</h3>
                  <p className="text-sm text-gray-500">Updated today</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{rate.rate}%</p>
                  <p className={`text-sm ${
                    rate.change.startsWith('+') ? 'text-red-500' :
                    rate.change.startsWith('-') ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {rate.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Market Insights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Federal Reserve Update</h3>
              <p className="text-gray-600">
                The Federal Reserve's recent policy decisions continue to influence mortgage rates.
                Experts anticipate rates to remain relatively stable in the coming months.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Housing Market Trends</h3>
              <p className="text-gray-600">
                The housing market shows signs of increased activity despite higher rates.
                Buyers are adapting to the current rate environment.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Expert Predictions</h3>
              <p className="text-gray-600">
                Industry experts predict modest rate fluctuations through the rest of the year,
                with potential for slight decreases in the long term.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Rate Lock Recommendation</h2>
        <p className="text-gray-700">
          Given current market conditions and rate trends, consider locking your rate if you're
          planning to close within the next 30-45 days. Speak with a mortgage professional to
          discuss your specific situation.
        </p>
      </div>
    </div>
  );
};

export default MortgageRatePage; 