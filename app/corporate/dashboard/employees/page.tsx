'use client'

import { useState, useEffect } from 'react'
import { FaUsers, FaSearch, FaPlus, FaSpinner } from 'react-icons/fa'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  policyType: string
  status: string
  joinDate: string
}

export default function CorporateEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUserId(parsed.id)
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchEmployees = async () => {
      try {
        const res = await fetch(`/api/corporate/${userId}/employees`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) setEmployees(json.data || [])
        }
      } catch {
        // API may not exist yet
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [userId])

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUsers className="text-blue-500" /> Employee Management
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus /> Add Employee
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-blue-500" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaUsers className="text-4xl mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No employees found</p>
            <p className="text-sm mt-1">Add your first employee to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Employee</th>
                <th className="p-3 text-left font-medium text-gray-700">Department</th>
                <th className="p-3 text-left font-medium text-gray-700">Policy Type</th>
                <th className="p-3 text-left font-medium text-gray-700">Status</th>
                <th className="p-3 text-left font-medium text-gray-700">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-gray-500 text-xs">{emp.email}</p>
                  </td>
                  <td className="p-3 text-gray-600">{emp.department}</td>
                  <td className="p-3 text-gray-600">{emp.policyType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 text-xs">{emp.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
