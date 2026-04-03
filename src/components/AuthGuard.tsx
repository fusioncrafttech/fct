import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUserProfile } from '../services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'team_member' | 'viewer';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  
  // Check if user is authenticated and has proper role
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const userProfile = getStoredUserProfile();
  
  if (!isAuthenticated || !userProfile) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role-based permissions if requiredRole is specified
  if (requiredRole) {
    const roleHierarchy = {
      'viewer': 0,
      'team_member': 1,
      'admin': 2,
      'super_admin': 3
    };
    
    const userRoleLevel = roleHierarchy[userProfile.role as keyof typeof roleHierarchy];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    if (userRoleLevel < requiredRoleLevel) {
      // Redirect to appropriate dashboard based on user role
      const redirectPaths = {
        'viewer': '/dashboard',
        'team_member': '/dashboard',
        'admin': '/admin/dashboard',
        'super_admin': '/admin/dashboard'
      };
      
      return <Navigate to={redirectPaths[userProfile.role as keyof typeof redirectPaths]} replace />;
    }
  }
  
  return <>{children}</>;
};

export default AuthGuard;
