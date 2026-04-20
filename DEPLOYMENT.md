# Vercel Deployment Guide

## Environment Variables Setup

You must configure these environment variables in your Vercel dashboard:

### Required Environment Variables

1. **VITE_SUPABASE_URL**
   - Get from your Supabase project settings
   - Format: `https://your-project-id.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Get from your Supabase project settings > API
   - This is the public/anonymous key

3. **VITE_EMAILJS_SERVICE_ID**
   - Get from your EmailJS account

4. **VITE_EMAILJS_TEMPLATE_ID**
   - Get from your EmailJS account

5. **VITE_EMAILJS_PUBLIC_KEY**
   - Get from your EmailJS account

## Setup Steps

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add all the variables listed above
5. Redeploy your application

## Troubleshooting

### Database Connection Issues

If you're experiencing database connection issues in production:

1. **Check Environment Variables**
   ```bash
   # Verify the variables are set correctly
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Check Supabase Configuration**
   - Ensure your Supabase project is active
   - Verify the anon key is correct
   - Check RLS (Row Level Security) policies

3. **Network Issues**
   - Ensure CORS is properly configured in Supabase
   - Check if your Supabase project allows connections from your domain

### Common Errors

- **"Supabase environment variables are missing"**: Environment variables not set in Vercel
- **"Invalid API key"**: Wrong or truncated Supabase anon key
- **"CORS error"**: Supabase project doesn't allow your domain

## Verification

After deployment, check the browser console for:
- "Supabase client initialized successfully" message
- No environment variable warnings
- Successful API calls to Supabase
