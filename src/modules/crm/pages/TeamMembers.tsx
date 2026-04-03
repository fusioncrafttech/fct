import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  User,
  UserPlus,
  Search,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { teamMembersService } from '../services/supabase';
import type { TeamMember } from '@/types/global';

const TeamMembersManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'team_member' as TeamMember['role'],
    phone: '',
    avatar: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const filtered = teamMembers.filter(member => {
      const matchesSearch = (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesStatus = showInactive ? true : member.is_active;
      return matchesSearch && matchesStatus;
    });
    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm, showInactive]);

  const fetchTeamMembers = async () => {
    try {
      const data = await teamMembersService.getAll();
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
        is_active: true // New members are active by default
      };
      
      if (editingMember?.id) {
        await teamMembersService.update(editingMember.id, memberData);
      } else {
        await teamMembersService.create(memberData);
      }
      fetchTeamMembers();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'team_member',
      phone: member.phone || '',
      avatar: member.avatar || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (member: TeamMember) => {
    if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      try {
        if (member.id) {
          await teamMembersService.delete(member.id);
          fetchTeamMembers();
        }
      } catch (error) {
        console.error('Failed to delete team member:', error);
      }
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      if (member.id) {
        await teamMembersService.toggleActive(member.id, !member.is_active);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Failed to toggle team member status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'team_member',
      phone: '',
      avatar: ''
    });
    setEditingMember(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team_member':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'team_member':
        return <Users className="w-4 h-4" />;
      case 'viewer':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const activeCount = teamMembers.filter(m => m.is_active).length;
  const inactiveCount = teamMembers.filter(m => !m.is_active).length;

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
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Team Members</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage your team members and their roles
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{activeCount} Active Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{inactiveCount} Inactive Members</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setModalOpen(true)} className="bg-white text-blue-600 hover:bg-blue-50 w-full lg:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-lg p-2 sm:p-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{teamMembers.length}</div>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Members</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-lg p-2 sm:p-3">
              <ToggleRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Active Members</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-lg p-2 sm:p-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {teamMembers.filter(m => m.role === 'admin' || m.role === 'super_admin').length}
            </div>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Admins</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-lg p-2 sm:p-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {teamMembers.filter(m => {
                if (!m.joined_at) return false;
                const joinedDate = new Date(m.joined_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return joinedDate > thirtyDaysAgo;
              }).length}
            </div>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">New This Month</div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Show Inactive</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Team Members List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="text-sm text-gray-500">
              {filteredMembers.length} of {teamMembers.length} members
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-3 lg:items-center lg:space-x-4">
                  <div className="relative flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </div>
                    )}
                    {!member.is_active && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate">{member.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getRoleColor(member.role || 'team_member')}`}>
                        {getRoleIcon(member.role || 'team_member')}
                        <span className="ml-1">{(member.role || 'team_member').replace('_', ' ')}</span>
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-1 truncate">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-1 truncate">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Joined {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'No date'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-2 mt-4 lg:mt-0">
                  <button
                    onClick={() => handleToggleActive(member)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      member.is_active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={member.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {member.is_active ? <ToggleRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add/Edit Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter member name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamMember['role'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="team_member">Team Member</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL (Optional)</label>
            <Input
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="Enter avatar URL"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingMember ? 'Update' : 'Add'} Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamMembersManager;
