import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Layout, 
  Mail, 
  Zap, 
  Box,
  Plus,
  ExternalLink,
  Search
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/forms/Input';
import { toolkitService } from '../services/supabase';
import type { ToolkitItem, ToolkitCategory, ToolkitStats } from '../types';

const ToolkitDashboard: React.FC = () => {
  const [stats, setStats] = useState<ToolkitStats>({
    total_items: 0,
    categories: {
      authentication_templates: 0,
      dashboard_layouts: 0,
      contact_form_templates: 0,
      api_utilities: 0,
      ui_components: 0
    },
    recent_additions: []
  });
  const [items, setItems] = useState<ToolkitItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ToolkitCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories: { key: ToolkitCategory; title: string; icon: React.ReactNode; color: string }[] = [
    { 
      key: 'authentication_templates', 
      title: 'Authentication Templates', 
      icon: <Code className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    { 
      key: 'dashboard_layouts', 
      title: 'Dashboard Layouts', 
      icon: <Layout className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    { 
      key: 'contact_form_templates', 
      title: 'Contact Forms', 
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    { 
      key: 'api_utilities', 
      title: 'API Utilities', 
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-yellow-500'
    },
    { 
      key: 'ui_components', 
      title: 'UI Components', 
      icon: <Box className="w-5 h-5" />,
      color: 'bg-pink-500'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const statsData = await toolkitService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch toolkit stats:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = selectedCategory === 'all' 
        ? await toolkitService.getAll()
        : await toolkitService.getByCategory(selectedCategory);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch toolkit items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Developer Toolkit</h1>
        <p className="text-gray-600 mt-2">Reusable code templates, components, and utilities</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.key}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCategory(category.key)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                {category.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.categories[category.key]}</p>
                <p className="text-sm text-gray-600">{category.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search toolkit items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category.key}
                size="sm"
                variant={selectedCategory === category.key ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.title.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No toolkit items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <div className={`w-8 h-8 ${
                    categories.find(c => c.key === item.category)?.color || 'bg-gray-500'
                  } rounded-lg flex items-center justify-center text-white`}>
                    {categories.find(c => c.key === item.category)?.icon}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 line-clamp-3">
                  {item.code_snippet}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    {item.github_link && (
                      <a
                        href={item.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Recent Additions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Additions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.recent_additions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className={`w-6 h-6 ${
                    categories.find(c => c.key === item.category)?.color || 'bg-gray-500'
                  } rounded flex items-center justify-center text-white`}>
                    {categories.find(c => c.key === item.category)?.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolkitDashboard;
