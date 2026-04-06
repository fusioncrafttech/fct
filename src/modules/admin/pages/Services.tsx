import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Power, PowerOff, GripVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import { servicesService } from '../services/supabase';
import type { Service } from '@/types/global';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableServiceItemProps {
  service: Service;
  onEdit: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const SortableServiceItem: React.FC<SortableServiceItemProps> = ({
  service,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id || service.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-0"
        >
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Service Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">{service.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{service.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                  {service.price ? `₹${service.price}` : 'Price not set'}
                </span>
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}
                >
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                icon={<Edit className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="p-1.5 sm:p-2"
                onClick={() => onEdit(service)}
              />
              <Button
                size="sm"
                variant="ghost"
                icon={service.is_active ? <PowerOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Power className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="p-1.5 sm:p-2"
                onClick={() => onToggleActive(service)}
              />
              <Button
                size="sm"
                variant="ghost"
                icon={<Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                onClick={() => onDelete(service)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesService.getAll();
      // Sort by sort_order, then by created_at as fallback
      const sortedServices = data.sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        // Fallback to created_at if sort_order is not set
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      });
      setServices(sortedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = services.findIndex((service) => service.id === active.id);
      const newIndex = services.findIndex((service) => service.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newServices = arrayMove(services, oldIndex, newIndex);
        
        // Update sort_order for all affected services
        const updatedServices = newServices.map((service, index) => ({
          ...service,
          sort_order: index,
        }));

        setServices(updatedServices);

        // Update sort_order in database
        try {
          await Promise.all(
            updatedServices.map((service) =>
              servicesService.update(service.id!, { sort_order: service.sort_order })
            )
          );
        } catch (error) {
          console.error('Failed to update service order:', error);
          // Revert to original order if update fails
          fetchServices();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService?.id) {
        await servicesService.update(editingService.id, formData);
      } else {
        // Add new service with sort_order at the end
        const newService = await servicesService.create({
          ...formData,
          sort_order: services.length,
        });
        setServices([...services, newService]);
      }
      fetchServices();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
      price: service.price || '',
      is_active: service.is_active ?? true
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesService.update(service.id!, {
        is_active: !service.is_active
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to toggle service status:', error);
    }
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      try {
        await servicesService.delete(service.id!);
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Services Manager</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your service offerings. Drag to reorder.</p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Service
        </Button>
      </div>

      {/* Services List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={services.map(s => s.id || s.title)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 sm:space-y-3">
            {services.map((service) => (
              <SortableServiceItem
                key={service.id || service.title}
                service={service}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-3 sm:mb-4">
            <Plus className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Get started by adding your first service.</p>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            Add Service
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter service title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter service description"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon Name
            </label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., code, smartphone, palette"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g., Starting at ₹5,000"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
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
