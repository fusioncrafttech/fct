import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import BrochurePDF from '../../../components/pdf/BrochurePDF';
import PDFPreview from '../../../components/pdf/PDFPreview';
import PreviewModal from '../../../components/modals/PreviewModal';
import { DocumentManager } from '../../../utils/documentUtils';
import type { BrochureData } from '../../../types/documents';

const brochureTemplates = {
  'company-profile': {
    title: 'Fusioncrafttech - Company Profile',
    subtitle: 'Your Digital Transformation Partner',
    services: [
      'Web Development & Design',
      'Mobile App Development',
      'E-commerce Solutions',
      'Digital Marketing',
      'Brand Development',
      'UI/UX Design',
      'Cloud Solutions',
      'IT Consulting'
    ],
    pricingPackages: [
      {
        name: 'Starter Package',
        price: '₹49,999',
        features: [
          'Responsive Website Design',
          '5 Pages Website',
          'Basic SEO Setup',
          '1 Year Hosting',
          'Email Support',
          'Mobile Responsive'
        ]
      },
      {
        name: 'Professional Package',
        price: '₹99,999',
        features: [
          'Custom Website Design',
          '15 Pages Website',
          'Advanced SEO',
          '2 Years Hosting',
          'Priority Support',
          'CMS Integration',
          'Performance Optimization'
        ]
      },
      {
        name: 'Enterprise Package',
        price: '₹1,99,999',
        features: [
          'Full-Stack Development',
          'Unlimited Pages',
          'Premium SEO & Marketing',
          '3 Years Hosting',
          '24/7 Phone Support',
          'Custom Dashboard',
          'API Integration',
          'Maintenance & Updates'
        ]
      }
    ],
    companyDescription: 'Fusioncrafttech is a leading digital solutions provider specializing in web development, mobile applications, and digital marketing. We help businesses transform their digital presence with innovative solutions tailored to their unique needs.',
    contact: {
      website: 'www.fusioncrafttech.com',
      email: 'info@fusioncrafttech.com',
      phone: '+91 93601 21830'
    }
  },
  'website-package': {
    title: 'Website Development Packages',
    subtitle: 'Professional Websites for Your Business',
    services: [
      'Custom Website Design',
      'E-commerce Development',
      'Content Management Systems',
      'Website Redesign',
      'Landing Page Development',
      'Progressive Web Apps',
      'Website Maintenance',
      'Performance Optimization'
    ],
    pricingPackages: [
      {
        name: 'Basic Website',
        price: '₹29,999',
        features: [
          '5-Page Static Website',
          'Mobile Responsive Design',
          'Contact Form Integration',
          'Basic SEO Setup',
          '1 Year Free Hosting',
          'SSL Certificate'
        ]
      },
      {
        name: 'Dynamic Website',
        price: '₹79,999',
        features: [
          '15-Page Dynamic Website',
          'Admin Panel',
          'Blog Integration',
          'Advanced SEO',
          '2 Years Hosting',
          'Email Integration',
          'Social Media Integration'
        ]
      },
      {
        name: 'E-commerce Website',
        price: '₹1,49,999',
        features: [
          'Full E-commerce Platform',
          'Payment Gateway Integration',
          'Inventory Management',
          'Order Management System',
          '3 Years Hosting',
          'Mobile App (Basic)',
          'Marketing Tools'
        ]
      }
    ],
    companyDescription: 'We create stunning, high-performance websites that help businesses grow online. Our expert team combines cutting-edge technology with creative design to deliver exceptional digital experiences.',
    contact: {
      website: 'www.fusioncrafttech.com',
      email: 'web@fusioncrafttech.com',
      phone: '+91 93601 21830'
    }
  },
  'digital-marketing': {
    title: 'Digital Marketing Services',
    subtitle: 'Grow Your Business Online',
    services: [
      'Search Engine Optimization (SEO)',
      'Social Media Marketing',
      'Pay-Per-Click Advertising',
      'Content Marketing',
      'Email Marketing',
      'Brand Strategy',
      'Analytics & Reporting',
      'Conversion Optimization'
    ],
    pricingPackages: [
      {
        name: 'Starter Marketing',
        price: '₹19,999/month',
        features: [
          'Basic SEO Optimization',
          'Social Media Management (2 platforms)',
          'Monthly Reporting',
          'Content Creation (4 posts/month)',
          'Email Campaign Setup',
          'Basic Analytics'
        ]
      },
      {
        name: 'Growth Marketing',
        price: '₹49,999/month',
        features: [
          'Advanced SEO',
          'Social Media Management (5 platforms)',
          'PPC Campaign Management',
          'Content Marketing Strategy',
          'Email Marketing Automation',
          'Detailed Analytics & Reports'
        ]
      },
      {
        name: 'Enterprise Marketing',
        price: '₹99,999/month',
        features: [
          'Comprehensive SEO Strategy',
          'Full Social Media Management',
          'Advanced PPC Campaigns',
          'Content Marketing & PR',
          'Marketing Automation',
          'Custom Analytics Dashboard',
          'Dedicated Account Manager'
        ]
      }
    ],
    companyDescription: 'Our digital marketing experts help businesses reach their target audience and achieve measurable results. We use data-driven strategies to maximize your online presence and ROI.',
    contact: {
      website: 'www.fusioncrafttech.com',
      email: 'marketing@fusioncrafttech.com',
      phone: '+91 93601 21830'
    }
  },
  'startup-package': {
    title: 'Startup Special Package',
    subtitle: 'Everything Your Startup Needs',
    services: [
      'Complete Web Solution',
      'Mobile App Development',
      'Brand Identity Design',
      'Digital Marketing Setup',
      'Cloud Infrastructure',
      'Technical Support',
      'Business Consulting',
      'Growth Strategy'
    ],
    pricingPackages: [
      {
        name: 'MVP Package',
        price: '₹1,99,999',
        features: [
          'Web Application (MVP)',
          'Mobile App (Basic)',
          'Logo & Brand Design',
          'Basic Digital Setup',
          '6 Months Support',
          'Cloud Hosting',
          'Analytics Setup'
        ]
      },
      {
        name: 'Growth Package',
        price: '₹4,99,999',
        features: [
          'Full Web Application',
          'Advanced Mobile App',
          'Complete Brand Identity',
          'Digital Marketing Campaign',
          '1 Year Support',
          'Advanced Cloud Setup',
          'Analytics & Reporting',
          'API Integrations'
        ]
      },
      {
        name: 'Scale Package',
        price: '₹9,99,999',
        features: [
          'Enterprise Web Solution',
          'Feature-Rich Mobile Apps',
          'Premium Brand Package',
          'Comprehensive Marketing',
          '2 Years Support',
          'Enterprise Cloud Setup',
          'Advanced Analytics',
          'Custom Integrations',
          'Dedicated Team'
        ]
      }
    ],
    companyDescription: 'Special package designed for startups looking to make their mark. We provide end-to-end digital solutions from concept to launch, helping startups build a strong foundation for success.',
    contact: {
      website: 'www.fusioncrafttech.com',
      email: 'startup@fusioncrafttech.com',
      phone: '+91 93601 21830'
    }
  }
};

export default function BrochureForm() {
  const [showPreview, setShowPreview] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Fusioncrafttech',
    phone: '+91 93601 21830',
    email: 'fusioncrafttech@gmail.com',
    website: 'www.fusioncrafttech.com',
    address: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof brochureTemplates>('company-profile');
  const [brochureData, setBrochureData] = useState<BrochureData>({
    id: '',
    template: 'company-profile',
    title: '',
    subtitle: '',
    services: [],
    pricingPackages: [],
    companyDescription: '',
    contact: {
      website: '',
      email: '',
      phone: '',
    },
    createdAt: '',
  });

  useEffect(() => {
    const template = brochureTemplates[selectedTemplate];
    setBrochureData({
      id: DocumentManager.generateId(),
      template: selectedTemplate,
      title: template.title,
      subtitle: template.subtitle,
      services: [...template.services],
      pricingPackages: template.pricingPackages.map(pkg => ({ ...pkg })),
      companyDescription: template.companyDescription,
      contact: { ...template.contact },
      createdAt: new Date().toISOString(),
    });
  }, [selectedTemplate]);

  const updateBrochureData = (field: keyof BrochureData, value: any) => {
    setBrochureData(prev => ({ ...prev, [field]: value }));
  };

  const updateContact = (field: keyof typeof brochureData.contact, value: string) => {
    setBrochureData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const addService = () => {
    setBrochureData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }));
  };

  const updateService = (index: number, value: string) => {
    setBrochureData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => i === index ? value : service)
    }));
  };

  const removeService = (index: number) => {
    setBrochureData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addPricingPackage = () => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: [...prev.pricingPackages, {
        name: '',
        price: '',
        features: ['']
      }]
    }));
  };

  const updatePricingPackage = (pkgIndex: number, field: string, value: string) => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map((pkg, i) => 
        i === pkgIndex ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const updatePackageFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map((pkg, i) => 
        i === pkgIndex 
          ? {
              ...pkg,
              features: pkg.features.map((feature, j) => j === featureIndex ? value : feature)
            }
          : pkg
      )
    }));
  };

  const addPackageFeature = (pkgIndex: number) => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map((pkg, i) => 
        i === pkgIndex ? { ...pkg, features: [...pkg.features, ''] } : pkg
      )
    }));
  };

  const removePackageFeature = (pkgIndex: number, featureIndex: number) => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map((pkg, i) => 
        i === pkgIndex 
          ? {
              ...pkg,
              features: pkg.features.filter((_, j) => j !== featureIndex)
            }
          : pkg
      )
    }));
  };

  const removePricingPackage = (index: number) => {
    setBrochureData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.filter((_, i) => i !== index)
    }));
  };

  const generatePDF = async () => {
    const doc = <BrochurePDF data={brochureData} companyInfo={companyInfo} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Fusioncrafttech-services.pdf';
    link.click();
    URL.revokeObjectURL(url);

    DocumentManager.saveBrochure(brochureData);
  };

  const previewPDF = () => {
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Brochure</h1>
              <p className="text-gray-600 text-sm md:text-base">Generate professional marketing brochures for your services</p>
            </div>
            
            {/* Desktop buttons - hidden on mobile */}
            <div className="hidden lg:flex space-x-3">
              <button
                onClick={previewPDF}
                className="flex items-center px-5 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview PDF
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Document Header */}
          <div className="flex justify-center mt-8 mb-6">
            <img 
              src="/FCT Logo.png" 
              alt="Fusioncrafttech Logo" 
              className="w-32 h-10 object-contain"
            />
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Brochure Template</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Brochure Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof brochureTemplates)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="company-profile">Company Profile Brochure</option>
              <option value="website-package">Website Development Package</option>
              <option value="digital-marketing">Digital Marketing Services</option>
              <option value="startup-package">Startup Offer Package</option>
            </select>
          </div>
        </div>

        {/* From Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">From Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Website
              </label>
              <input
                type="url"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter website URL"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Address
              </label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter address (optional)"
              />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title
              </label>
              <input
                type="text"
                value={brochureData.title}
                onChange={(e) => updateBrochureData('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={brochureData.subtitle}
                onChange={(e) => updateBrochureData('subtitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
            <button
              onClick={addService}
              className="flex items-center justify-center px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>
          <div className="space-y-3">
            {brochureData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex-1">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(index, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter service name"
                  />
                </div>
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Packages</h2>
            <button
              onClick={addPricingPackage}
              className="flex items-center justify-center px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </button>
          </div>
          <div className="space-y-6">
            {brochureData.pricingPackages.map((pkg, pkgIndex) => (
              <div key={pkgIndex} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Package {pkgIndex + 1}</h3>
                  <button
                    onClick={() => removePricingPackage(pkgIndex)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Package Name
                      </label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePricingPackage(pkgIndex, 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Package name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => updatePricingPackage(pkgIndex, 'price', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-600">
                        Features
                      </label>
                      <button
                        onClick={() => addPackageFeature(pkgIndex)}
                        className="text-cyan-600 hover:text-cyan-800 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updatePackageFeature(pkgIndex, featureIndex, e.target.value)}
                            className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder="Feature description"
                          />
                          <button
                            onClick={() => removePackageFeature(pkgIndex, featureIndex)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Description</h2>
          <textarea
            value={brochureData.companyDescription}
            onChange={(e) => updateBrochureData('companyDescription', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-20">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Website
              </label>
              <input
                type="text"
                value={brochureData.contact.website}
                onChange={(e) => updateContact('website', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={brochureData.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={brochureData.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile buttons - sticky bottom action bar */}
      <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={previewPDF}
            className="flex items-center justify-center px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium w-full sm:w-auto"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview PDF
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Brochure Preview"
        fullScreen={true}
      >
        <PDFPreview 
          pdfComponent={<BrochurePDF data={brochureData} companyInfo={companyInfo} />}
          className="h-full"
        />
      </PreviewModal>
    </div>
  );
}
