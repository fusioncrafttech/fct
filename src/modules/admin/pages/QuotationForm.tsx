import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import QuotationPDF from '../../../components/pdf/QuotationPDF';
import PDFPreview from '../../../components/pdf/PDFPreview';
import PreviewModal from '../../../components/modals/PreviewModal';
import { DocumentManager, defaultTerms, defaultNotes } from '../../../utils/documentUtils';
import type { QuotationData, ServiceItem, ClientDetails } from '../../../types/documents';

export default function QuotationForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState('');
  const [date, setDate] = useState('');
  const [client, setClient] = useState<ClientDetails>({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
  });
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: '1',
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [terms, setTerms] = useState(defaultTerms);
  const [notes, setNotes] = useState(defaultNotes);

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Fusioncrafttech',
    phone: '+91 93601 21830',
    email: 'fusioncrafttech@gmail.com',
    website: 'www.fusioncrafttech.com',
    address: '',
  });

  useEffect(() => {
    setQuotationNumber(DocumentManager.generateQuotationNumber());
    setDate(DocumentManager.getCurrentDate());
  }, []);

  useEffect(() => {
    const updatedServices = services.map(service => ({
      ...service,
      amount: service.quantity * service.rate,
    }));
    setServices(updatedServices);
  }, [services.map(s => `${s.quantity}-${s.rate}`).join(',')]);

  const subtotal = services.reduce((sum, service) => sum + service.amount, 0);
  const { cgst, sgst, grandTotal } = DocumentManager.calculateTotals(subtotal);

  const addService = () => {
    const newService: ServiceItem = {
      id: DocumentManager.generateId(),
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const updateClient = (field: keyof ClientDetails, value: string) => {
    setClient({ ...client, [field]: value });
  };

  const generatePDF = async () => {
    const quotationData: QuotationData = {
      id: DocumentManager.generateId(),
      quotationNumber,
      date,
      client,
      services,
      subtotal,
      cgst,
      sgst,
      grandTotal,
      terms,
      notes,
      createdAt: new Date().toISOString(),
    };

    const doc = <QuotationPDF data={quotationData} companyInfo={companyInfo} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quotationNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    DocumentManager.saveQuotation(quotationData);
  };

  const previewPDF = () => {
    setShowPreview(true);
  };

  const quotationData: QuotationData = {
    id: DocumentManager.generateId(),
    quotationNumber,
    date,
    client,
    services,
    subtotal,
    cgst,
    sgst,
    grandTotal,
    terms,
    notes,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Quotation</h1>
              <p className="text-gray-600 text-sm md:text-base">Generate professional quotations for your clients</p>
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

        {/* Document Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Document Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Quotation Number
              </label>
              <input
                type="text"
                value={quotationNumber}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Quotation Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
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

        {/* Client Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => updateClient('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={client.company}
                onChange={(e) => updateClient('company', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={client.phone}
                onChange={(e) => updateClient('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => updateClient('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter email address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Address
              </label>
              <textarea
                value={client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter client address"
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

          {/* Mobile-friendly service cards */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={service.id} className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Service {index + 1}</h3>
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    disabled={services.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Service name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Description"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={service.quantity}
                        onChange={(e) => updateService(service.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-center"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={service.rate}
                        onChange={(e) => updateService(service.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-center"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Amount (₹)
                      </label>
                      <div className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-center font-medium text-gray-700">
                        {service.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Totals</h2>
          <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">CGST (9%):</span>
                <span className="font-semibold text-gray-900">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">SGST (9%):</span>
                <span className="font-semibold text-gray-900">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                <span className="text-xl font-bold text-emerald-600">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-20">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Terms and Conditions
              </label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
              />
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
        title="Quotation Preview"
        fullScreen={true}
      >
        <PDFPreview 
          pdfComponent={<QuotationPDF data={quotationData} companyInfo={companyInfo} />}
          className="h-full"
        />
      </PreviewModal>
      </div>
    </div>
  );
}
