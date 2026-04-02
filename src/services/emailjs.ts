import emailjs from '@emailjs/browser';

// Initialize EmailJS with your service details
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
} else {
  console.warn('EmailJS environment variables are not set. Email features will be disabled.');
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { success: false, error: new Error('EmailJS not initialized') };
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        message: formData.message,
      }
    );
    
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};
