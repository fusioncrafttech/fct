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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Quotation</h1>
          
          {/* Desktop buttons - hidden on mobile */}
          <div className="hidden lg:flex space-x-3">
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
              Download PDF
            </button>
          </div>
        </div>

        {/* Document Header */}
        <div className="flex justify-center mb-8">
          <img 
            src="/FCT Logo.png" 
            alt="Fusioncrafttech Logo" 
            className="w-24 h-8 object-contain"
          />
        </div>

        {/* Document Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotation Number
            </label>
            <input
              type="text"
              value={quotationNumber}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotation Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* From Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">From Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter website URL"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address (optional)"
              />
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => updateClient('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={client.company}
                onChange={(e) => updateClient('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={client.phone}
                onChange={(e) => updateClient('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => updateClient('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client address"
              />
            </div>
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

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">Service Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Quantity</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Rate (₹)</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Amount (₹)</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Service name"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={service.quantity}
                        onChange={(e) => updateService(service.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={service.rate}
                        onChange={(e) => updateService(service.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center font-medium">
                      {service.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        disabled={services.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Totals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST (9%):</span>
                  <span className="font-medium">₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST (9%):</span>
                  <span className="font-medium">₹{sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile buttons - shown only on mobile */}
      <div className="lg:hidden bg-white rounded-lg shadow-lg p-6 mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={previewPDF}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview PDF
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
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
  );
}
