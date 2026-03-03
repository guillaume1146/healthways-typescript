'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaAmbulance } from 'react-icons/fa';

interface EmergencyService {
  id: string;
  serviceName: string;
  serviceType: string;
  description: string;
  responseTime: string;
  coverageArea: string;
  contactNumber: string;
  price: number | null;
  available24h: boolean;
  specializations: string[];
}

type ServiceFormData = Omit<EmergencyService, 'id'>;

const SERVICE_TYPES = ['Ambulance', 'First Aid', 'Rescue', 'Medical Transport', 'Training', 'Other'];

const emptyForm: ServiceFormData = {
  serviceName: '',
  serviceType: 'Ambulance',
  description: '',
  responseTime: '',
  coverageArea: '',
  contactNumber: '',
  price: null,
  available24h: false,
  specializations: [],
};

const serviceTypeBadgeColor: Record<string, string> = {
  Ambulance: 'bg-red-100 text-red-700',
  'First Aid': 'bg-green-100 text-green-700',
  Rescue: 'bg-orange-100 text-orange-700',
  'Medical Transport': 'bg-blue-100 text-blue-700',
  Training: 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function EmergencyServicesPage() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<EmergencyService | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(emptyForm);
  const [specializationsInput, setSpecializationsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/responder/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : data.services ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setSpecializationsInput('');
    setModalOpen(true);
  };

  const openEditModal = (service: EmergencyService) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      description: service.description,
      responseTime: service.responseTime,
      coverageArea: service.coverageArea,
      contactNumber: service.contactNumber,
      price: service.price,
      available24h: service.available24h,
      specializations: service.specializations,
    });
    setSpecializationsInput(
      Array.isArray(service.specializations) ? service.specializations.join(', ') : ''
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData(emptyForm);
    setSpecializationsInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      specializations: specializationsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingService) {
        const res = await fetch(`/api/responder/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update service');
      } else {
        const res = await fetch('/api/responder/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create service');
      }
      closeModal();
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/responder/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? service.serviceType === filterType : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <FaAmbulance className="text-3xl text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emergency Services</h1>
            <p className="text-sm text-gray-500">Manage your emergency service listings</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
        >
          <FaPlus className="text-sm" />
          Add Service
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
        >
          <option value="">All Types</option>
          {SERVICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <FaTimes className="text-red-500 hover:text-red-700" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FaAmbulance className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No services found</h3>
          <p className="text-sm text-gray-400">
            {searchTerm || filterType
              ? 'Try adjusting your search or filter.'
              : 'Get started by adding your first emergency service.'}
          </p>
        </div>
      )}

      {/* Service Cards */}
      {!loading && filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {service.serviceName}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        serviceTypeBadgeColor[service.serviceType] || serviceTypeBadgeColor.Other
                      }`}
                    >
                      {service.serviceType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Response Time</span>
                    <span className="font-medium text-gray-800">{service.responseTime || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Coverage Area</span>
                    <span className="font-medium text-gray-800">{service.coverageArea || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-800">
                      {service.contactNumber || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="font-medium text-gray-800">
                      {service.price != null ? `MUR ${service.price.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">24/7 Available</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        service.available24h
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          service.available24h ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      {service.available24h ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {Array.isArray(service.specializations) && service.specializations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5">Specializations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Emergency Ambulance Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                  placeholder="Describe the service..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response Time
                  </label>
                  <input
                    type="text"
                    value={formData.responseTime}
                    onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="e.g., 10-15 mins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coverage Area
                  </label>
                  <input
                    type="text"
                    value={formData.coverageArea}
                    onChange={(e) => setFormData({ ...formData, coverageArea: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="e.g., Port Louis"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="e.g., +230 5XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (MUR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.price ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available24h"
                  checked={formData.available24h}
                  onChange={(e) => setFormData({ ...formData, available24h: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="available24h" className="text-sm font-medium text-gray-700">
                  Available 24 hours
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations
                </label>
                <input
                  type="text"
                  value={specializationsInput}
                  onChange={(e) => setSpecializationsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Cardiac, Trauma, Pediatric (comma-separated)"
                />
                <p className="mt-1 text-xs text-gray-400">Separate multiple items with commas</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Saving...'
                    : editingService
                      ? 'Update Service'
                      : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
