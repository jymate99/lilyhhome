import { TrendingUp, Percent, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Type definition for mortgage rate data
type MortgageRate = {
  product_name: string;
  rate_value: number;
  rate_change: string | number;  // Allow both string and number types
  date: string;
};

const MortgageRatePage = () => {
  // State management for rates, loading and error states
  const [mortgageRates, setMortgageRates] = useState<MortgageRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('');

  // Helper function to format rate change
  const formatRateChange = (change: string | number): string => {
    if (typeof change === 'number') {
      return change > 0 ? `+${change}` : `${change}`;
    }
    return change;
  };

  // Helper function to determine rate change color
  const getRateChangeColor = (change: string | number): string => {
    const stringChange = formatRateChange(change);
    if (stringChange.startsWith('+')) return 'text-red-500';
    if (stringChange.startsWith('-')) return 'text-green-500';
    return 'text-gray-500';
  };

  // Fetch mortgage rates from Supabase
  useEffect(() => {
    const fetchMortgageRates = async () => {
      try {
        // First, get the most recent date from the database
        const { data: dateData, error: dateError } = await supabase
          .from('mortgage_rates')
          .select('date')
          .order('date', { ascending: false })
          .limit(1);

        if (dateError) throw dateError;

        if (!dateData || dateData.length === 0) {
          throw new Error('No rates found in the database');
        }

        const mostRecentDate = dateData[0].date;
        setLastUpdatedDate(mostRecentDate);
        //console.log(dateData)

        // Then fetch rates for that date
        const { data, error } = await supabase
          .from('mortgage_rates')
          .select('product_name, rate_value, rate_change, date')
          .eq('date', mostRecentDate)
          .order('product_name', { ascending: true });

        if (error) throw error;

        if (data) {
          setMortgageRates(data);
        }
        //console.log(data)
        //console.log(data)
      } catch (err) {
        console.error('Error fetching mortgage rates:', err);
        setError('Failed to load mortgage rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMortgageRates();
  }, []);

  // Format date for display (YYYY-MM-DD to Month DD, YYYY)
  const formatDate = (dateString: string) => {
    // Split the date string into parts to avoid timezone conversion issues
    const [year, month, day] = dateString.split('-').map(Number);
    // Create a new date object using UTC to prevent date shifting
    const date = new Date(Date.UTC(year, month - 1, day));
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Ensure UTC timezone is used
    };
    return date.toLocaleDateString('en-US', options);
  };

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
        {lastUpdatedDate && (
          <p className="text-medium text-gray-500 mt-2">
            Rates last updated on {formatDate(lastUpdatedDate)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rates Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Latest Rates
            <span className="text-sm text-gray-900 ml-auto bg-gray-10 px-2 py-1 rounded-md">
              Updated: <span className="font-medium">{formatDate(lastUpdatedDate)}</span>
            </span>
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-600 p-4 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Rates Display */}
          {!loading && !error && (
            <div className="space-y-4">
              {mortgageRates.map((rate, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{rate.product_name}</h3>

                    <p className="text-sm text-gray-500">Updated {formatDate(lastUpdatedDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{rate.rate_value}%</p>
                    <p className={`text-sm ${getRateChangeColor(rate.rate_change)}`}>
                      {formatRateChange(rate.rate_change)}
                    </p>
                  </div>
                </div>
              ))}

              {mortgageRates.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No rates available. Please check back later.
                </p>
              )}
            </div>
          )}
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