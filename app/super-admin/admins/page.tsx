'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {  FaSearch, FaCheck, FaTimes, FaBan } from 'react-icons/fa'
import type { Admin } from '@/types/super-admin'

const mockAdmins: Admin[] = [
  { id: 'A001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Content Manager', status: 'active', joinDate: '2025-01-15', lastLogin: '2 hours ago', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alice', permissions: { canManageCMS: true, canManageFinances: false, canManageUsers: false } },
  { id: 'A002', name: 'Bob Williams', email: 'bob@example.com', role: 'Financial Analyst', status: 'pending', joinDate: '2025-08-25', lastLogin: 'Never', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob', permissions: { canManageCMS: false, canManageFinances: true, canManageUsers: false } },
  { id: 'A003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User Moderator', status: 'suspended', joinDate: '2024-11-10', lastLogin: '5 days ago', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie', permissions: { canManageCMS: false, canManageFinances: false, canManageUsers: true } },
  { id: 'A004', name: 'Diana Miller', email: 'diana@example.com', role: 'Content Manager', status: 'pending', joinDate: '2025-08-28', lastLogin: 'Never', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Diana', permissions: { canManageCMS: true, canManageFinances: false, canManageUsers: false } },
];

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');

  const handleUpdateStatus = (id: string, newStatus: Admin['status']) => {
    setAdmins(admins.map(admin => admin.id === id ? { ...admin, status: newStatus } : admin));
  };

  const filteredAdmins = admins.filter(admin => filter === 'all' || admin.status === filter);

  const getStatusBadge = (status: Admin['status']) => ({
    active: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    suspended: 'bg-red-100 text-red-800',
  }[status]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Approve, manage, and monitor all admin accounts.</p>
          </div>
          <Link href="/super-admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back to Dashboard</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            {(['all', 'pending', 'active', 'suspended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${filter === f ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? admins.length : admins.filter(a => a.status === f).length})
              </button>
            ))}
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search admins..." className="pl-10 pr-4 py-2 border rounded-lg" />
          </div>
        </div>

        {/* Admins List */}
        <div className="space-y-4">
          {filteredAdmins.map(admin => (
            <div key={admin.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={admin.avatar} alt={admin.name} width={48} height={48} className="rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-600">{admin.email} | {admin.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(admin.status)}`}>{admin.status}</span>
                <p className="text-sm text-gray-500">Joined: {admin.joinDate}</p>
                {admin.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(admin.id, 'active')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><FaCheck /></button>
                    <button onClick={() => handleUpdateStatus(admin.id, 'suspended')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><FaTimes /></button>
                  </div>
                ) : (
                  <button onClick={() => handleUpdateStatus(admin.id, admin.status === 'active' ? 'suspended' : 'active')} className={`p-2 rounded-lg ${admin.status === 'active' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                    {admin.status === 'active' ? <FaBan /> : <FaCheck />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminManagementPage;