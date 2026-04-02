import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, User, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import { projectsTrackerService } from '../services/supabase';
import type { ProjectTracker, ProjectStatus, Priority } from '../types';

const ProjectsTracker: React.FC = () => {
  const [projects, setProjects] = useState<ProjectTracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectTracker | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    assigned_members: [] as string[],
    deadline: '',
    priority: 'medium' as Priority,
    status: 'planning' as ProjectStatus
  });

  const statusColumns: { status: ProjectStatus; title: string; color: string }[] = [
    { status: 'planning', title: 'Planning', color: 'bg-gray-100' },
    { status: 'in_progress', title: 'In Progress', color: 'bg-blue-100' },
    { status: 'testing', title: 'Testing', color: 'bg-yellow-100' },
    { status: 'completed', title: 'Completed', color: 'bg-green-100' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsTrackerService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsTrackerService.update(editingProject.id, formData);
      } else {
        await projectsTrackerService.create(formData);
      }
      fetchProjects();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEdit = (project: ProjectTracker) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      client: project.client,
      assigned_members: project.assigned_members,
      deadline: project.deadline,
      priority: project.priority,
      status: project.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (project: ProjectTracker) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsTrackerService.delete(project.id);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleStatusChange = async (project: ProjectTracker, newStatus: ProjectStatus) => {
    try {
      await projectsTrackerService.updateStatus(project.id, newStatus);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      assigned_members: [],
      deadline: '',
      priority: 'medium',
      status: 'planning'
    });
    setEditingProject(null);
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(project => project.status === status);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Tracker</h1>
          <p className="text-gray-600 mt-2">Manage your projects with Kanban board</p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Project
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.status} className="space-y-4">
            <div className={`${column.color} rounded-lg p-4`}>
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {getProjectsByStatus(column.status).length} projects
              </p>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {getProjectsByStatus(column.status).map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  draggable
                  onDragEnd={(e: any) => {
                    // Handle drag and drop logic here
                    if (e.currentTarget) {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const centerX = rect.left + rect.width / 2;
                      const dropZone = Math.floor(centerX / (window.innerWidth / 4));
                      const newStatus = statusColumns[dropZone]?.status;
                      if (newStatus && newStatus !== project.status) {
                        handleStatusChange(project, newStatus);
                      }
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Edit className="w-3 h-3" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 className="w-3 h-3" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project);
                          }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{project.client}</p>
                    
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}
                      >
                        {project.priority}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span className={isOverdue(project.deadline) ? 'text-red-600 font-medium' : ''}>
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {project.assigned_members.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {project.assigned_members.length} member{project.assigned_members.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    
                    {isOverdue(project.deadline) && project.status !== 'completed' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Overdue</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
          <Textarea
            label="Assigned Members (comma-separated)"
            value={formData.assigned_members.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              assigned_members: e.target.value.split(',').map(m => m.trim()).filter(m => m)
            })}
            placeholder="John Doe, Jane Smith"
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
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsTracker;
