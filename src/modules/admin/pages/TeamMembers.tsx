import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, User, Mail, Briefcase, MapPin, Star } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  bio: string;
  image: string;
  location?: string;
  expertise?: string[];
  featured?: boolean;
  created_at: string;
}

const TeamMembersManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    bio: '',
    image: '',
    location: '',
    expertise: '',
    featured: false
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      // For demo, using localStorage. In production, use Supabase
      const stored = localStorage.getItem('team_members');
      const data = stored ? JSON.parse(stored) : [
        {
          id: '1',
          name: 'John Smith',
          position: 'CEO & Founder',
          email: 'john@fusioncrafttech.com',
          bio: 'Visionary leader with 10+ years of experience in tech innovation and digital transformation.',
          image: 'https://images.unsplash.com/photo-1560250097-0f1f0d6b0b3a?w=400&h=400&fit=crop&crop=face',
          location: 'San Francisco, CA',
          expertise: ['Strategy', 'Innovation', 'Leadership'],
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          position: 'CTO',
          email: 'sarah@fusioncrafttech.com',
          bio: 'Technical architect specializing in scalable solutions and cutting-edge technologies.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          location: 'New York, NY',
          expertise: ['Cloud Architecture', 'AI/ML', 'DevOps'],
          featured: true,
          created_at: new Date().toISOString()
        }
      ];
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const memberData = {
        ...formData,
        expertise: formData.expertise.split(',').map(item => item.trim()).filter(Boolean),
        id: editingMember ? editingMember.id : Date.now().toString(),
        created_at: editingMember ? editingMember.created_at : new Date().toISOString()
      };

      let updatedMembers;
      if (editingMember) {
        updatedMembers = teamMembers.map(member => 
          member.id === editingMember.id ? memberData : member
        );
      } else {
        updatedMembers = [...teamMembers, memberData];
      }

      setTeamMembers(updatedMembers);
      localStorage.setItem('team_members', JSON.stringify(updatedMembers));
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        email: '',
        bio: '',
        image: '',
        location: '',
        expertise: '',
        featured: false
      });
      setModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      bio: member.bio,
      image: member.image,
      location: member.location || '',
      expertise: member.expertise?.join(', ') || '',
      featured: member.featured || false
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      localStorage.setItem('team_members', JSON.stringify(updatedMembers));
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const updatedMembers = teamMembers.map(member =>
        member.id === id ? { ...member, featured: !member.featured } : member
      );
      setTeamMembers(updatedMembers);
      localStorage.setItem('team_members', JSON.stringify(updatedMembers));
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your team members and showcase them on the about page
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormData({
              name: '',
              position: '',
              email: '',
              bio: '',
              image: '',
              location: '',
              expertise: '',
              featured: false
            });
            setModalOpen(true);
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Team Member
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No team members</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding your first team member.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Team Member
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.position}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="w-3 h-3 mr-1" />
                    {member.email}
                  </div>
                  {member.location && (
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      {member.location}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {member.bio}
                </p>
              </div>

              {member.expertise && member.expertise.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{member.expertise.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(member.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    member.featured
                      ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
                      : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                  }`}
                  title={member.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className={`w-4 h-4 ${member.featured ? 'fill-current' : ''}`} />
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Profile Image"
                className="col-span-1 md:col-span-2"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="React, Node.js, Design"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Featured team member
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingMember ? 'Update' : 'Add'} Team Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersManager;
