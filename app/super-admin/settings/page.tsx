import Link from 'next/link';
import { FaCogs } from 'react-icons/fa';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <Link href="/super-admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <FaCogs className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Global System Settings</h2>
        <p className="text-gray-500 mt-2">Manage API keys, maintenance mode, and other platform-wide configurations here.</p>
      </main>
    </div>
  );
}