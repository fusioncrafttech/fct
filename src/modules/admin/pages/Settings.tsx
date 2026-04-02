import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Moon, Sun, Layout } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import type { AdminSettings } from '../types';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    site_name: 'Fusioncrafttech',
    site_description: 'Premium web development and digital solutions',
    contact_email: 'contact@fusioncrafttech.com',
    social_links: {
      github: 'https://github.com/fusioncrafttech',
      linkedin: 'https://linkedin.com/company/fusioncrafttech',
      twitter: 'https://twitter.com/fusioncrafttech'
    }
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode is already set in localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [compactView, setCompactView] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('compactView') === 'true';
    }
    return false;
  });

  // Apply dark mode to document whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    }
  }, [darkMode]);

  // Apply compact view preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compactView', compactView.toString());
      // You can add compact view logic here
    }
  }, [compactView]);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('admin_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save settings to Supabase or localStorage for now
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (platform: keyof typeof settings.social_links, value: string) => {
    setSettings(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your platform settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              placeholder="Your site name"
            />
            
            <Textarea
              label="Site Description"
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              placeholder="Brief description of your site"
              rows={3}
            />
            
            <Input
              label="Contact Email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="contact@example.com"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="GitHub"
              value={settings.social_links.github || ''}
              onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              placeholder="https://github.com/username"
            />
            
            <Input
              label="LinkedIn"
              value={settings.social_links.linkedin || ''}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
            
            <Input
              label="Twitter"
              value={settings.social_links.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-5 h-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enable dark mode theme</p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact View</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use compact layout for tables</p>
              </div>
              <button
                type="button"
                onClick={() => setCompactView(!compactView)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  compactView ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  compactView ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            icon={<Save className="w-4 h-4" />}
            loading={loading}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
