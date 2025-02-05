import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const MortgageCalculatorPage = () => {
  // State for calculator inputs
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  // Handle calculation of monthly mortgage payment
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const principal = Number(homePrice) - Number(downPayment);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = Number(loanTerm) * 12;
    
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setMonthlyPayment(monthly);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Calculator className="h-8 w-8 mr-2 text-blue-600" />
          Mortgage Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Plan your home purchase with our easy-to-use mortgage calculator
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div>
            <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700">
              Home Price ($)
            </label>
            <input
              type="number"
              id="homePrice"
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">
              Down Payment ($)
            </label>
            <input
              type="number"
              id="downPayment"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
              Loan Term (Years)
            </label>
            <select
              id="loanTerm"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="30">30 years</option>
              <option value="20">20 years</option>
              <option value="15">15 years</option>
              <option value="10">10 years</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate
          </button>
        </form>

        {monthlyPayment && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Payment:</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${monthlyPayment.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *This is an estimate. Actual payment may vary based on taxes, insurance, and other factors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculatorPage; 