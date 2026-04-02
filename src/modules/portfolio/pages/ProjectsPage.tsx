import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Code, ArrowRight } from 'lucide-react';
import { projectsService } from '../../admin/services/supabase';
import type { Project } from '../../admin/types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredProjects = projects.filter(project => project.featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold gradient-text mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Explore our portfolio of innovative solutions and see how we've helped businesses transform their digital presence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Some of our most notable work that we're particularly proud of
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {project.image && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-600 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack?.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack?.length > 4 && (
                          <span className="text-gray-500 text-xs">
                            +{project.tech_stack.length - 4} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                            >
                              <Code className="w-5 h-5" />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm inline-flex items-center group"
                        >
                          View Details
                          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Browse our complete portfolio of work across different industries and technologies
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No projects yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                We haven't added any projects to our portfolio yet. Check back soon!
              </p>
              <Link
                to="/contact"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                Get in Touch
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    {project.image && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-600 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech_stack?.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack?.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                            >
                              <Code className="w-4 h-4" />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm inline-flex items-center"
                        >
                          View
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let's work together to bring your ideas to life. Get in touch with us to discuss your project requirements.
            </p>
            <Link
              to="/contact"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-colors inline-flex items-center"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
