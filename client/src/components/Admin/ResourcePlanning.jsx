import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ResourcePlanning = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const queryClient = useQueryClient();

  const onClose = () => {
    setIsOpen(false);
    setSelectedResource(null);
  };
  const onOpen = () => setIsOpen(true);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/resources');
      return response.data;
    }
  });

  const createResource = useMutation({
    mutationFn: async (resourceData) => {
      const response = await axios.post('/api/admin/rescuers/resources', resourceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      onClose();
      toast.success('Resource Added');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add resource');
    }
  });

  const updateResource = useMutation({
    mutationFn: async ({ resourceId, data }) => {
      const response = await axios.put(`/api/admin/rescuers/resources/${resourceId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      onClose();
      toast.success('Resource Updated');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update resource');
    }
  });

  const deleteResource = useMutation({
    mutationFn: async (resourceId) => {
      await axios.delete(`/api/admin/rescuers/resources/${resourceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      toast.success('Resource Deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete resource');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resourceData = {
      name: formData.get('name'),
      category: formData.get('category'),
      quantity: parseInt(formData.get('quantity'), 10) || 0,
      minQuantity: parseInt(formData.get('minQuantity'), 10) || 1,
      unit: formData.get('unit'),
      location: formData.get('location'),
      status: formData.get('status'),
      lastRestockDate: formData.get('lastRestockDate')
    };

    if (selectedResource) {
      updateResource.mutate({ resourceId: selectedResource._id, data: resourceData });
    } else {
      createResource.mutate(resourceData);
    }
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    onOpen();
  };

  const getStockBarColor = (quantity, minQuantity) => {
    const ratio = (quantity / (minQuantity || 1)) * 100;
    if (ratio <= 50) return 'bg-rose-500';
    if (ratio <= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'available') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          Available
        </span>
      );
    }
    if (s === 'low_stock') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
          Low Stock
        </span>
      );
    }
    if (s === 'out_of_stock') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
          Out of Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
        {status || 'Maintenance'}
      </span>
    );
  };

  return (
    <div className="space-y-4 text-app-text">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-app-text">Resource & Equipment Inventory</h3>
          <p className="text-xs text-app-muted">Stockpile management for critical flood gear</p>
        </div>
        <button
          onClick={() => {
            setSelectedResource(null);
            onOpen();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border">
            <thead className="bg-app-surface">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Resource</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Stock Level</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-app-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border bg-app-card text-sm">
              {resources.length > 0 ? (
                resources.map((resource) => {
                  const pct = Math.min(100, Math.round((resource.quantity / (resource.minQuantity || 1)) * 100));
                  return (
                    <tr key={resource._id} className="hover:bg-app-hover transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-app-text">{resource.name}</div>
                        <div className="text-xs text-app-muted">
                          {resource.quantity} {resource.unit}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 capitalize text-app-muted">{resource.category}</td>
                      <td className="px-5 py-3.5 w-48">
                        <div className="space-y-1">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${getStockBarColor(resource.quantity, resource.minQuantity)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-app-muted">
                            Min: {resource.minQuantity} {resource.unit} ({pct}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-app-muted">{resource.location}</td>
                      <td className="px-5 py-3.5">{getStatusBadge(resource.status)}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors"
                            title="Edit resource"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteResource.mutate(resource._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-sm text-app-muted">
                    {isLoading ? 'Loading resource inventory...' : 'No inventory items registered.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-app-card rounded-xl border border-app-card-border p-6 w-full max-w-lg shadow-xl text-app-text">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <h3 className="text-base font-bold text-app-text">
                {selectedResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={selectedResource?.name}
                  placeholder="Enter resource name"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={selectedResource?.category || 'supplies'}
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="medical">Medical</option>
                  <option value="equipment">Equipment</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="communication">Communication</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    required
                    defaultValue={selectedResource?.quantity ?? 0}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Minimum Quantity</label>
                  <input
                    type="number"
                    name="minQuantity"
                    min="1"
                    required
                    defaultValue={selectedResource?.minQuantity ?? 1}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Unit</label>
                  <input
                    name="unit"
                    required
                    defaultValue={selectedResource?.unit || 'pieces'}
                    placeholder="e.g. kits, liters, units"
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Storage Location</label>
                  <input
                    name="location"
                    required
                    defaultValue={selectedResource?.location}
                    placeholder="e.g. Depot A, Bay 3"
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedResource?.status || 'available'}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="available">Available</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-app-muted uppercase mb-1">Last Restock Date</label>
                  <input
                    name="lastRestockDate"
                    type="date"
                    defaultValue={selectedResource?.lastRestockDate?.split('T')[0]}
                    className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-app-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-app-muted hover:text-app-text bg-app-surface border border-app-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createResource.isPending || updateResource.isPending}
                  className="px-4 py-2 font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  {createResource.isPending || updateResource.isPending
                    ? 'Saving...'
                    : selectedResource
                    ? 'Update Resource'
                    : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePlanning;