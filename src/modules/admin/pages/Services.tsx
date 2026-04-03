import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Table, type TableColumn } from '../../../components/tables/Table';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import { servicesService } from '../services/supabase';
import type { Service } from '@/types/global';

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    price: '',
    is_active: true
  } as {
    title: string;
    description: string;
    icon: string;
    price: string;
    is_active: boolean;
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService?.id) {
        await servicesService.update(editingService.id, formData);
      } else {
        await servicesService.create(formData);
      }
      fetchServices();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || '',
      price: service.price || '',
      is_active: service.is_active || true
    });
    setModalOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        if (service.id) {
          await servicesService.delete(service.id);
          fetchServices();
        }
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      if (service.id) {
        await servicesService.toggleActive(service.id, !(service.is_active ?? false));
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to toggle service status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      price: '',
      is_active: true
    });
    setEditingService(null);
  };

  const columns: TableColumn<Service>[] = [
    {
      key: 'title',
      title: 'Service Name',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (value) => (
        <div className="text-sm text-gray-600 line-clamp-2">{value}</div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => (
        <div className="font-medium text-gray-900">₹{value}</div>
      )
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(item)}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={item.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            onClick={() => handleToggleActive(item)}
          />
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(item)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Manager</h1>
          <p className="text-gray-600 mt-2">Manage your service offerings</p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Service
        </Button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table
          data={services}
          columns={columns}
          loading={loading}
          emptyMessage="No services found"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Input
            label="Icon (emoji or icon name)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🚀 or service-icon"
          />
          <Input
            label="Price"
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? 'Update' : 'Create'} Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManager;
