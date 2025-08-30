import Link from 'next/link';
import { FaChartLine } from 'react-icons/fa';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <Link href="/super-admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <FaChartLine className="text-6xl text-blue-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Detailed Analytics Coming Soon</h2>
        <p className="text-gray-500 mt-2">This section will contain comprehensive platform-wide analytics.</p>
      </main>
    </div>
  );
}