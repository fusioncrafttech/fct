import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, Award, ArrowRight } from 'lucide-react';
import { teamMembersService } from '../../crm/services/supabase';
import type { TeamMember } from '@/types/global';

const AboutPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await teamMembersService.getAll();
      // Only show active team members, exclude admin roles
      const activeMembers = data.filter(member => 
        member.is_active !== false && 
        member.role !== 'super_admin' && 
        member.role !== 'admin'
      );
      setTeamMembers(activeMembers);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      // Fallback to mock data if service fails
      setTeamMembers(getMockTeamMembers());
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'CEO & Founder';
      case 'admin': return 'Director';
      case 'team_member': return 'Team Member';
      case 'viewer': return 'Associate';
      default: return 'Team Member';
    }
  };

  const getMockTeamMembers = () => {
    return [
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@fusioncrafttech.com',
          role: 'team_member' as const,
          designation: 'CTO & Technical Lead',
          description: 'Technical architect specializing in scalable solutions and cutting-edge technologies. Expert in cloud architecture, AI/ML, and DevOps practices.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          joined_at: new Date().toISOString(),
          is_active: true
        }
      ];
  };

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We are committed to delivering solutions that drive real business value and create meaningful impact.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We embrace cutting-edge technologies and creative approaches to solve complex challenges.'
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our success. We build long-term partnerships based on trust and results.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in everything we deliver, from code to customer service.'
    }
  ];

  const stats = [
    { number: '20+', label: 'Projects Completed' },
    { number: '20+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: `${teamMembers.length}+`, label: 'Team Members' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4 sm:mb-6">
              About Fusioncrafttech
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
              We are a team of passionate developers, designers, and innovators dedicated to creating exceptional digital experiences that transform businesses and delight users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Story
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Founded in 2019, Fusioncrafttech began with a simple mission: to bridge the gap between innovative ideas and powerful digital solutions. What started as a small team of passionate developers has grown into a full-service digital agency serving clients worldwide.
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Our journey has been defined by continuous learning, adaptation to emerging technologies, and an unwavering commitment to excellence. We've had the privilege of working with startups, enterprises, and everything in between, helping them navigate the complex digital landscape.
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Today, we continue to push boundaries and challenge conventions, always asking "what's next?" and "how can we do better?" Our story is still being written, and we're excited to have you be part of it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              The talented individuals behind our success
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No team members yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Our team is growing. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center hover:shadow-lg transition-shadow"
                >
                  <div className="relative mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name || 'Team Member'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl font-bold text-gray-500">
                          {member.name?.charAt(0).toUpperCase() || 'T'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <div className="text-primary-600 dark:text-primary-400 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    {member.designation || getRoleDisplay(member.role)}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                    {member.description || (
                      member.role === 'super_admin' && 'Visionary leader with 10+ years of experience in tech innovation and digital transformation.'
                    ) || (
                      member.role === 'admin' && 'Technical architect specializing in scalable solutions and cutting-edge technologies.'
                    ) || (
                      member.role === 'team_member' && 'Passionate developer focused on creating exceptional user experiences and robust solutions.'
                    ) || (
                      member.role === 'viewer' && 'Dedicated team member contributing to project success and client satisfaction.'
                    ) || 'Team member contributing to our success.'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary-100 mb-6 sm:mb-8 px-4">
              Let's discuss how we can help bring your vision to life
            </p>
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors inline-flex items-center text-base sm:text-lg"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
