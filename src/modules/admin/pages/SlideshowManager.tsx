import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import ImageUpload from '../../../components/ImageUpload';
import { cn } from '../../../utils/cn';
import { slideshowService } from '../../admin/services/supabase';
import type { Slideshow } from '@/types/global';

const SlideshowManager: React.FC = () => {
  const [slides, setSlides] = useState<Slideshow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slideshow | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    is_active: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await slideshowService.getAll();
      setSlides(data || []);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        // Update existing slide
        await slideshowService.update(editingSlide.id!, formData);
      } else {
        // Add new slide
        await slideshowService.create({
          ...formData,
          sort_order: slides.length
        });
      }
      await fetchSlides();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save slide:', error);
    }
  };

  const handleEdit = (slide: Slideshow) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description || '',
      image: slide.image,
      is_active: slide.is_active || false
    });
    setModalOpen(true);
  };

  const handleDelete = async (slide: Slideshow) => {
    if (window.confirm(`Are you sure you want to delete "${slide.title}"?`)) {
      try {
        await slideshowService.delete(slide.id!);
        await fetchSlides();
      } catch (error) {
        console.error('Failed to delete slide:', error);
      }
    }
  };

  const handleToggleActive = async (slide: Slideshow) => {
    try {
      await slideshowService.toggleActive(slide.id!, !slide.is_active);
      await fetchSlides();
    } catch (error) {
      console.error('Failed to toggle slide status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      is_active: true
    });
    setEditingSlide(null);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Slideshow Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Manage homepage slideshow images and content
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Slide
        </Button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    slide.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  )}
                >
                  {slide.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                {slide.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {slide.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                    onClick={() => handleEdit(slide)}
                    className="p-1.5 sm:p-2"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                    onClick={() => handleDelete(slide)}
                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  />
                </div>
                <Button
                    size="sm"
                    variant={slide.is_active ? "primary" : "ghost"}
                    onClick={() => handleToggleActive(slide)}
                    className="text-xs px-2 py-1"
                  >
                  {slide.is_active ? 'Active' : 'Activate'}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {slides.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ImageIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No slides yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            Get started by adding your first slideshow slide.
          </p>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            Add Slide
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
        title={editingSlide ? 'Edit Slide' : 'Add New Slide'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Slide Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter slide title"
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter slide description"
            rows={3}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slide Image
            </label>
            <ImageUpload
              value={formData.image}
              onChange={handleImageUpload}
              label="Slide Image"
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active (show in slideshow)
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
              {editingSlide ? 'Update Slide' : 'Add Slide'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SlideshowManager;
