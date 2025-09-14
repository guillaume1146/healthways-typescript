'use client'

import { FaBrain } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// This component now correctly receives props from its parent page
export default function PredictiveAnalytics({ dateRange, region }: { dateRange: string; region: string }) {
  // Mock data and component logic remains the same
  const predictions = [
    { metric: 'User Growth', current: 287453, predicted: 342000, confidence: 89, timeframe: '3 months', factors: ['Seasonal trends', 'Marketing campaigns'] },
    { metric: 'Revenue', current: 1105650, predicted: 1450000, confidence: 92, timeframe: '3 months', factors: ['User growth', 'Premium adoption'] },
    { metric: 'Provider Network', current: 38421, predicted: 45000, confidence: 85, timeframe: '3 months', factors: ['Recruitment efforts', 'Incentives'] }
  ];


  const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Actual', data: [180000, 195000, 210000, 228000, 245000, 265000, 287453, null, null, null, null, null], borderColor: 'rgb(59, 130, 246)', tension: 0.4, fill: true, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
      { label: 'Predicted', data: [null, null, null, null, null, null, 287453, 298000, 312000, 325000, 334000, 342000], borderColor: 'rgb(34, 197, 94)', borderDash: [5, 5], tension: 0.4, fill: true, backgroundColor: 'rgba(34, 197, 94, 0.1)' }
    ]
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">AI-Powered Platform Predictions</h2>
        <p className="text-gray-600">Showing predictions for: <span className="font-semibold">{dateRange} / {region}</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {predictions.map((pred, idx) => (
          <div key={idx} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaBrain className="text-2xl text-purple-500" />
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                {pred.confidence}% confidence
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{pred.metric}</h3>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">User Growth Projection</h3>
        <div className="relative h-80">
          <Line data={growthData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}