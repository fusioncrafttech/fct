import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import BrochurePDF from '../../../components/pdf/BrochurePDF';
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Brochure</h1>
          
          {/* From Section */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start space-x-4">
              <img 
                src="/FCT Logo.png" 
                alt="Fusioncrafttech Logo" 
                className="w-12 h-4 rounded mt-1"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none text-sm w-full"
                />
                <input
                  type="text"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none w-full"
                  placeholder="Phone number"
                />
                <input
                  type="text"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none w-full"
                  placeholder="Email address"
                />
                <input
                  type="text"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none w-full"
                  placeholder="Website"
                />
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none w-full"
                  placeholder="Address (optional)"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={previewPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview PDF
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Brochure Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof brochureTemplates)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="company-profile">Company Profile Brochure</option>
            <option value="website-package">Website Development Package</option>
            <option value="digital-marketing">Digital Marketing Services</option>
            <option value="startup-package">Startup Offer Package</option>
          </select>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={brochureData.title}
              onChange={(e) => updateBrochureData('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={brochureData.subtitle}
              onChange={(e) => updateBrochureData('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
            <button
              onClick={addService}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>
          <div className="space-y-2">
            {brochureData.services.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => updateService(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service name"
                />
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pricing Packages</h2>
            <button
              onClick={addPricingPackage}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </button>
          </div>
          <div className="space-y-6">
            {brochureData.pricingPackages.map((pkg, pkgIndex) => (
              <div key={pkgIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Package {pkgIndex + 1}</h3>
                  <button
                    onClick={() => removePricingPackage(pkgIndex)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name
                    </label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => updatePricingPackage(pkgIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Package name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      value={pkg.price}
                      onChange={(e) => updatePricingPackage(pkgIndex, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Price"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <button
                      onClick={() => addPackageFeature(pkgIndex)}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updatePackageFeature(pkgIndex, featureIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Feature description"
                        />
                        <button
                          onClick={() => removePackageFeature(pkgIndex, featureIndex)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description
          </label>
          <textarea
            value={brochureData.companyDescription}
            onChange={(e) => updateBrochureData('companyDescription', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="text"
                value={brochureData.contact.website}
                onChange={(e) => updateContact('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={brochureData.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={brochureData.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Brochure Preview"
        fullScreen={true}
      >
        <div className="bg-white p-4">
          <BrochurePDF data={brochureData} companyInfo={companyInfo} />
        </div>
      </PreviewModal>
    </div>
  );
}
