import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // This would integrate with Supabase password reset
      // const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We've sent password reset instructions to your email address. 
            Please check your inbox and follow the link to reset your password.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email?
            </p>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              {isLoading ? 'Resending...' : 'Resend Email'}
            </button>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/login"
              className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="ml-2">Sending...</span>
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              Send Reset Instructions
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/register"
            className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
