import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import { testimonialsService } from '../services/supabase';
import type { Testimonial } from '@/types/global';

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    photo: '',
    review_text: '',
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsService.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial?.id) {
        await testimonialsService.update(editingTestimonial.id, formData);
      } else {
        await testimonialsService.create(formData);
      }
      fetchTestimonials();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name || '',
      company_name: testimonial.company_name || '',
      photo: testimonial.photo || '',
      review_text: testimonial.review_text || '',
      rating: testimonial.rating || 0
    });
    setModalOpen(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        if (testimonial.id) {
          await testimonialsService.delete(testimonial.id);
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      company_name: '',
      photo: '',
      review_text: '',
      rating: 5
    });
    setEditingTestimonial(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testimonials Manager</h1>
              <p className="text-gray-600 mt-2">Manage client testimonials</p>
            </div>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
            >
              Add Testimonial
            </Button>
          </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {testimonial.photo ? (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {testimonial.client_name?.charAt(0).toUpperCase() || 'T'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.client_name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.company_name || 'Client'}</p>
                  <div className="mt-2">{renderStars(testimonial.rating || 0)}</div>
                </div>
              </div>
            <blockquote className="mt-4 text-gray-700 italic">
              "{testimonial.review_text}"
            </blockquote>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                size="sm"
                variant="ghost"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => handleEdit(testimonial)}
              />
              <Button
                size="sm"
                variant="danger"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleDelete(testimonial)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            required
          />
          <Input
            label="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            placeholder="e.g. TechStart, DataFlow"
          />
          <Input
            label="Photo URL"
            value={formData.photo}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
            placeholder="https://example.com/photo.jpg"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-2">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: index + 1 })}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      index < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Review Text"
            value={formData.review_text}
            onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
            required
            rows={4}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTestimonial ? 'Update' : 'Create'} Testimonial
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialsManager;
