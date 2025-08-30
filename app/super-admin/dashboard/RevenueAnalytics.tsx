'use client'

import { useState, useEffect } from 'react'
import { FaDollarSign, FaWallet } from 'react-icons/fa'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
)

interface RevenueStream {
  source: string;
  amount: number;
  percentage: number;
  trend: number;
}

// Mock Data can be moved outside the component
const MOCK_REVENUE_STREAMS: RevenueStream[] = [
  { source: 'Subscriptions', amount: 458750, percentage: 42, trend: 15.3 },
  { source: 'Transaction Fees', amount: 312400, percentage: 28, trend: 22.7 },
  { source: 'Premium Services', amount: 189300, percentage: 17, trend: 8.5 },
  { source: 'Corporate Partnerships', amount: 145200, percentage: 13, trend: 31.2 }
];
const MOCK_TOTAL_REVENUE = 1105650;

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'MUR', symbol: 'Rs', rate: 45.5 },
  { code: 'KES', symbol: 'KSh', rate: 153.5 },
  { code: 'ZAR', symbol: 'R', rate: 18.9 }
];

const REVENUE_CHART_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Revenue',
    data: [780000, 820000, 890000, 920000, 980000, 1050000, 1105650, 1150000, 1200000, 1280000, 1350000, 1420000],
    fill: true,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgb(59, 130, 246)',
    tension: 0.4
  }]
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export default function RevenueAnalytics({ timeRange, region }: { timeRange: string; region: string }) {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  useEffect(() => {
    // Simulate fetching data based on props
    console.log(`Fetching data for timeRange: ${timeRange}, region: ${region}`);
    setRevenueStreams(MOCK_REVENUE_STREAMS);
    setTotalRevenue(MOCK_TOTAL_REVENUE);
  }, [timeRange, region]);

  const streamDistribution = {
    labels: revenueStreams.map(s => s.source),
    datasets: [{
      data: revenueStreams.map(s => s.percentage),
      backgroundColor: ['#3B82F6', '#22C55E', '#A855F7', '#F97316']
    }]
  };
  
  const iconColors = {
    bg: ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'],
    text: ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600']
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Revenue Analytics</h2>
        <select 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {CURRENCIES.map(curr => (
            <option key={curr.code} value={curr.code}>{curr.symbol} {curr.code}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaWallet className="text-3xl opacity-80" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+23.4%</span>
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Revenue ({timeRange})</p>
          <p className="text-4xl font-bold mb-2">
            {currentCurrency.symbol}
            {(totalRevenue * currentCurrency.rate).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-blue-100 text-sm">Region: {region}</p>
        </div>

        {/* Revenue Streams */}
        <div className="bg-white rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue Streams Breakdown</h3>
          <div className="space-y-3">
            {revenueStreams.map((stream, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColors.bg[idx]}`}>
                    <FaDollarSign className={iconColors.text[idx]} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stream.source}</p>
                    <p className="text-sm text-gray-500">{stream.percentage}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {currentCurrency.symbol}
                    {(stream.amount * currentCurrency.rate).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className={`text-sm ${stream.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stream.trend > 0 ? '▲' : '▼'} {stream.trend}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend & Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          {/* ---- FIX: Added relative positioning and defined height ---- */}
          <div className="relative h-64"> 
            <Line data={REVENUE_CHART_DATA} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
          {/* ---- FIX: Added relative positioning and defined height ---- */}
          <div className="relative h-64">
            <Doughnut data={streamDistribution} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}