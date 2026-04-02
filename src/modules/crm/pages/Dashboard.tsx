import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Briefcase,
  Calendar
} from 'lucide-react';
import { StatCard } from '../../../components/widgets/StatCard';
import { projectsTrackerService, tasksService, clientsService, teamMembersService } from '../services/supabase';
import type { ProjectTracker, Task, Client, TeamMember } from '../types';

const CRMDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    totalClients: 0,
    teamMembers: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState<ProjectTracker[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, tasks, clients, team] = await Promise.all([
          projectsTrackerService.getAll(),
          tasksService.getAll(),
          clientsService.getAll(),
          teamMembersService.getAll()
        ]);

        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;

        setStats({
          totalProjects: projects.length,
          activeTasks: tasks.filter(t => t.status !== 'done').length,
          totalClients: clients.length,
          teamMembers: team.filter(m => m.is_active).length,
          completedTasks,
          pendingTasks
        });

        setRecentProjects(projects.slice(0, 6));
        setUrgentTasks(
          tasks
            .filter(t => t.priority === 'high' && t.status !== 'done')
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'working':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckSquare className="w-4 h-4 text-green-600" />;
      case 'in_progress':
      case 'working':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateProject = () => {
    navigate('/dashboard/projects?action=create');
  };

  const handleAddTask = () => {
    navigate('/dashboard/tasks?action=create');
  };

  const handleInviteTeamMember = () => {
    navigate('/dashboard/team?action=invite');
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/dashboard/tasks/${taskId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Welcome to CRM Dashboard</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage your projects, tasks, clients, and team efficiently
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">Real-time updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">Track performance</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">{stats.totalProjects}</div>
              <div className="text-blue-100 text-sm">Active Projects</div>
              <div className="flex items-center mt-2 text-green-300">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm">12% from last month</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-lg p-2 sm:p-3">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>8%</span>
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Projects</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-lg p-2 sm:p-3">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>12%</span>
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeTasks}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Active Tasks</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-lg p-2 sm:p-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>5%</span>
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalClients}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Clients</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-lg p-2 sm:p-3">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>0%</span>
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.teamMembers}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Team Members</div>
        </motion.div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Last 30 days</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.completedTasks}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Completed</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Pending</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.completedTasks > 0 ? Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100) : 0}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Success Rate</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            <button 
              onClick={handleCreateProject}
              className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-left hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Create New Project</span>
              </div>
            </button>
            <button 
              onClick={handleAddTask}
              className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-left hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Add Task</span>
              </div>
            </button>
            <button 
              onClick={handleInviteTeamMember}
              className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-left hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Invite Team Member</span>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Projects and Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Projects */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
              <div className="text-sm text-gray-500">Last 6 projects</div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleProjectClick(project.id)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer space-y-2 sm:space-y-0"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                  <div className="flex flex-col sm:flex-col sm:items-end space-y-1 sm:space-y-2">
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Urgent Tasks</h3>
              </div>
              <div className="text-sm text-red-500">High Priority</div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {urgentTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTaskClick(task.id)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer space-y-2 sm:space-y-0"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getTaskIcon(task.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{task.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CRMDashboard;
