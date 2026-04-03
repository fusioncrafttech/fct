import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Star, ExternalLink, Code } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import ImageUpload from '../../../components/ImageUpload';
import { projectsService } from '../services/supabase';
import type { Project } from '@/types/global';

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getAll();
      setProjects(data || []);
      console.log('Fetched projects from Supabase:', data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Show error message to user
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        tech_stack: formData.tech_stack.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      if (editingProject?.id) {
        await projectsService.update(editingProject.id, projectData);
      } else {
        await projectsService.create(projectData);
      }
      fetchProjects();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      tech_stack: project.tech_stack?.join(', ') || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      featured: project.featured || false
    });
    setModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        if (project.id) {
          await projectsService.delete(project.id);
          fetchProjects();
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tech_stack: '',
      github_url: '',
      live_url: '',
      featured: false
    });
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Manager</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
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

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first project to showcase in your portfolio.</p>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
            >
              Add Your First Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {project.image && (
                <div className="h-48 bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  {project.featured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(project.tech_stack || []).slice(0, 3).map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <Code className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEdit(project)}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDelete(project)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="col-span-1 md:col-span-2"
            />
            
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="col-span-1 md:col-span-2"
              rows={4}
            />
            
            <ImageUpload
              label="Project Image"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              className="col-span-1 md:col-span-2"
            />
            
            <Input
              label="Tech Stack (comma-separated)"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              placeholder="React, TypeScript, TailwindCSS"
              required
              className="col-span-1 md:col-span-2"
            />
            
            <Input
              label="GitHub URL"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="col-span-1"
            />
            
            <Input
              label="Live Demo URL"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              placeholder="https://example.com"
              className="col-span-1"
            />
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Project
              </label>
            </div>
            
            <div className="flex space-x-3">
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
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsManager;
