import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Camera, Edit2, Save, X } from 'lucide-react';

const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@fusioncrafttech.com',
    phone: '+91 98765 43210',
    company: 'Fusioncrafttech',
    bio: 'Experienced administrator managing the Fusioncrafttech platform and ensuring smooth operations.'
  });

  // Load saved profile data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('admin_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('admin_profile', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to saved values or defaults
    const savedProfile = localStorage.getItem('admin_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
        // Reset to defaults if parsing fails
        setFormData({
          name: 'Admin User',
          email: 'admin@fusioncrafttech.com',
          phone: '+91 98765 43210',
          company: 'Fusioncrafttech',
          bio: 'Experienced administrator managing the Fusioncrafttech platform and ensuring smooth operations.'
        });
      }
    } else {
      // Reset to defaults if no saved data
      setFormData({
        name: 'Admin User',
        email: 'admin@fusioncrafttech.com',
        phone: '+91 98765 43210',
        company: 'Fusioncrafttech',
        bio: 'Experienced administrator managing the Fusioncrafttech platform and ensuring smooth operations.'
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-4 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {formData.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {formData.company}
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formData.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formData.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formData.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Additional Settings</h2>
          
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your account activity</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                Enable
              </button>
            </div>

            {/* Delete Account */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
