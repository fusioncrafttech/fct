import { supabase } from './supabase';
import { getStoredUserProfile } from './auth';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'task' | 'project';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  action_url?: string;
  metadata?: any;
}

// Get notifications for current user
export const getUserNotifications = async (limit = 10) => {
  try {
    const currentUser = getStoredUserProfile();
    if (!currentUser) return [];

    // Check if notifications table exists by trying a simple query first
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (tableError: any) {
      // If table doesn't exist, return empty array
      if (tableError.code === 'PGRST205') {
        console.warn('Notifications table not found. Please run notifications-schema.sql');
        return [];
      }
      throw tableError;
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  try {
    const currentUser = getStoredUserProfile();
    if (!currentUser) return 0;

    // Check if notifications table exists
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('is_read', false);

      if (error) throw error;
      return data?.length || 0;
    } catch (tableError: any) {
      // If table doesn't exist, return 0
      if (tableError.code === 'PGRST205') {
        console.warn('Notifications table not found. Please run notifications-schema.sql');
        return 0;
      }
      throw tableError;
    }
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return 0;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const currentUser = getStoredUserProfile();
    if (!currentUser) throw new Error('No user found');

    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', currentUser.id)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Create notification
export const createNotification = async (notification: {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'task' | 'project';
  action_url?: string;
  metadata?: any;
}) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Get notification icon based on type
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'message':
      return '💬';
    case 'task':
      return '✅';
    case 'project':
      return '📁';
    case 'success':
      return '✨';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    default:
      return 'ℹ️';
  }
};

// Get notification color based on type
export const getNotificationColor = (type: string) => {
  switch (type) {
    case 'message':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'task':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'project':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'success':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'error':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};
