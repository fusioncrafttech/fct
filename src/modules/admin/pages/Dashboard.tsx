import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Folder, 
  MessageSquare, 
  Users,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { StatCard } from '../../../components/widgets/StatCard';
import { dashboardService } from '../services/supabase';
import type { DashboardStats } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_services: 0,
    total_projects: 0,
    new_messages: 0,
    team_members: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Services"
          value={stats.total_services}
          change={{ value: 12, type: 'increase' }}
          icon={<Box className="w-6 h-6 text-blue-600" />}
          loading={loading}
        />
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          change={{ value: 8, type: 'increase' }}
          icon={<Folder className="w-6 h-6 text-purple-600" />}
          loading={loading}
        />
        <StatCard
          title="New Messages"
          value={stats.new_messages}
          change={{ value: 3, type: 'increase' }}
          icon={<MessageSquare className="w-6 h-6 text-green-600" />}
          loading={loading}
        />
        <StatCard
          title="Team Members"
          value={stats.team_members}
          change={{ value: 0, type: 'increase' }}
          icon={<Users className="w-6 h-6 text-orange-600" />}
          loading={loading}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Activity Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Activity chart will be implemented here</p>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">Revenue chart will be implemented here</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New project added', item: 'E-commerce Platform', time: '2 hours ago' },
              { action: 'Service updated', item: 'Web Development', time: '4 hours ago' },
              { action: 'New message received', item: 'John Doe', time: '6 hours ago' },
              { action: 'Testimonial added', item: 'Sarah Smith', time: '1 day ago' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
