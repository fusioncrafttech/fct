import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, User, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Table, type TableColumn } from '../../../components/tables/Table';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { tasksService, projectsTrackerService } from '../services/supabase';
import type { Task, TaskStatus, Priority } from '@/types/global';

const TasksManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_member: '',
    deadline: '',
    priority: 'medium' as Priority,
    linked_project: '',
    status: 'pending' as TaskStatus
  } as {
    title: string;
    description: string;
    assigned_member: string;
    deadline: string;
    priority: Priority;
    linked_project: string;
    status: TaskStatus;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    working: 'bg-blue-100 text-blue-800',
    review: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800'
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
    urgent: 'bg-red-200 text-red-900'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        tasksService.getAll(),
        projectsTrackerService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare form data, handling empty UUID fields
      const taskData = {
        title: formData.title,
        description: formData.description,
        assigned_member: formData.assigned_member || undefined,
        deadline: formData.deadline,
        priority: formData.priority,
        linked_project: formData.linked_project || undefined,
        status: formData.status
      };

      if (editingTask?.id) {
        await tasksService.update(editingTask.id, taskData);
      } else {
        await tasksService.create(taskData);
      }
      fetchData();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      assigned_member: task.assigned_member || '',
      deadline: task.deadline || '',
      priority: task.priority || 'medium',
      linked_project: task.linked_project || '',
      status: task.status || 'pending'
    });
    setModalOpen(true);
  };

  const handleDelete = async (task: Task) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        if (task.id) {
          await tasksService.delete(task.id);
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      if (task.id) {
        await tasksService.updateStatus(task.id, newStatus);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assigned_member: '',
      deadline: '',
      priority: 'medium',
      linked_project: '',
      status: 'pending'
    });
    setEditingTask(null);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Unknown Project';
  };

  const columns: TableColumn<Task>[] = [
    {
      key: 'title',
      title: 'Task',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'assigned_member',
      title: 'Assigned To',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{value}</span>
        </div>
      )
    },
    {
      key: 'linked_project',
      title: 'Project',
      render: (value) => (
        <div className="text-sm text-gray-600">{getProjectTitle(value)}</div>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (value: Priority) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[value || 'medium']}`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: TaskStatus, item) => (
        <select
          value={value}
          onChange={(e) => handleStatusChange(item, e.target.value as TaskStatus)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${statusColors[value || 'pending']} cursor-pointer`}
        >
          <option value="pending">Pending</option>
          <option value="working">Working</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      )
    },
    {
      key: 'deadline',
      title: 'Deadline',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-sm ${isOverdue(value) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {new Date(value).toLocaleDateString()}
          </span>
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
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Manage and track your team's tasks</p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(statusColors).map(([status, color]) => {
          const count = tasks.filter(t => t.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table
          data={tasks}
          columns={columns}
          loading={loading}
          emptyMessage="No tasks found"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Assigned Member"
            value={formData.assigned_member}
            onChange={(e) => setFormData({ ...formData, assigned_member: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="working">Working</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Linked Project</label>
            <select
              value={formData.linked_project}
              onChange={(e) => setFormData({ ...formData, linked_project: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
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
              {editingTask ? 'Update' : 'Create'} Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksManager;
