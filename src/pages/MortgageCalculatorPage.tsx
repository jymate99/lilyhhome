import React, { useState, useEffect } from 'react';
import { Calculator, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface YearlyAmortization {
  year: number;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
  totalInterest: number;
}

const MortgageCalculatorPage = () => {
  // State for calculator inputs
  const [homePrice, setHomePrice] = useState('');
  const [formattedHomePrice, setFormattedHomePrice] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20'); // Default 20%
  const [downPaymentAmount, setDownPaymentAmount] = useState('0');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<YearlyAmortization[]>([]);

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle home price input
  const handleHomePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setHomePrice(rawValue);
    setFormattedHomePrice(formatNumber(rawValue));
  };

  // Handle home price blur
  const handleHomePriceBlur = () => {
    if (homePrice) {
      setFormattedHomePrice(formatNumber(homePrice));
    }
  };

  // Handle home price focus
  const handleHomePriceFocus = () => {
    // Show unformatted value when focused
    setFormattedHomePrice(homePrice);
  };

  // Calculate down payment amount when percentage or home price changes
  useEffect(() => {
    if (homePrice && downPaymentPercent) {
      const amount = (Number(homePrice) * Number(downPaymentPercent)) / 100;
      setDownPaymentAmount(amount.toFixed(2));
    } else {
      setDownPaymentAmount('0');
    }
  }, [homePrice, downPaymentPercent]);

  // Calculate yearly amortization schedule
  const calculateAmortizationSchedule = (
    principal: number,
    annualRate: number,
    years: number,
    monthlyPayment: number
  ): YearlyAmortization[] => {
    const monthlyRate = annualRate / 100 / 12;
    const schedule: YearlyAmortization[] = [];
    let remainingBalance = principal;
    let totalInterest = 0;

    for (let year = 1; year <= years; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      const beginningBalance = remainingBalance;

      // Calculate monthly payments for the year
      for (let month = 1; month <= 12; month++) {
        const interest = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interest;

        yearlyInterest += interest;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      totalInterest += yearlyInterest;

      schedule.push({
        year,
        beginningBalance,
        payment: monthlyPayment * 12,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        endingBalance: remainingBalance,
        totalInterest
      });
    }

    return schedule;
  };

  // Handle Excel export
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(amortizationSchedule.map(row => ({
      'Year': row.year,
      'Beginning Balance': `$${row.beginningBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Yearly Payment': `$${row.payment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Principal': `$${row.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Interest': `$${row.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Ending Balance': `$${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Total Interest Paid': `$${row.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Amortization Schedule');
    
    // Generate filename with loan details
    const filename = `Mortgage_${Number(homePrice).toLocaleString()}_${loanTerm}yr_${interestRate}pct.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Handle calculation of monthly mortgage payment
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const principal = Number(homePrice) - Number(downPaymentAmount);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = Number(loanTerm) * 12;
    
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setMonthlyPayment(monthly);

    // Calculate and set amortization schedule
    const schedule = calculateAmortizationSchedule(
      principal,
      Number(interestRate),
      Number(loanTerm),
      monthly
    );
    setAmortizationSchedule(schedule);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Calculator className="h-10 w-10 mr-3 text-blue-600" />
          Mortgage Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Plan your home purchase with our easy-to-use mortgage calculator
        </p>
      </div>

      {/* Calculator Form - Centered */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700">
                Home Price ($)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                <input
                  type="text"
                  id="homePrice"
                  value={formattedHomePrice}
                  onChange={handleHomePriceChange}
                  onBlur={handleHomePriceBlur}
                  onFocus={handleHomePriceFocus}
                  className="block w-full pl-8 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="downPaymentPercent" className="block text-sm font-medium text-gray-700">
                  Down Payment (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="downPaymentPercent"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(e.target.value)}
                    className="block w-full pr-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Down Payment Amount:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${Number(downPaymentAmount).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {downPaymentPercent}% of home price (${Number(homePrice).toLocaleString()})
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <div className="relative mt-1">
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  step="0.01"
                  className="block w-full pr-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  max="100"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">%</span>
              </div>
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
              <h3 className="text-xl font-semibold text-gray-900">Monthly Payment:</h3>
              <p className="text-4xl font-bold text-blue-600">
                ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="mt-4 space-y-2 text-base text-gray-600">
                <p className="font-medium">Principal and Interest Only</p>
                <p className="text-sm text-gray-500">
                  *This is an estimate. Actual payment may vary based on taxes, insurance, and other factors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Amortization Schedule - 80% Width */}
      {monthlyPayment && (
        <div className="w-[60%] mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Yearly Amortization Schedule</h3>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium"
            >
              <Download className="h-5 w-5" />
              <span>Export to Excel</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Year</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Beginning Balance</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Yearly Payment</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Principal</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Interest</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Ending Balance</th>
                  <th scope="col" className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase">Total Interest</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {amortizationSchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-semibold text-gray-900">{row.year}</td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.beginningBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.payment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      ${row.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MortgageCalculatorPage; 