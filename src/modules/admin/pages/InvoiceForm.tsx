import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../../../components/pdf/InvoicePDF';
import PDFPreview from '../../../components/pdf/PDFPreview';
import PreviewModal from '../../../components/modals/PreviewModal';
import { DocumentManager, defaultPaymentInstructions } from '../../../utils/documentUtils';
import type { InvoiceData, InvoiceItem, ClientDetails } from '../../../types/documents';

export default function InvoiceForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Fusioncrafttech',
    phone: '+91 93601 21830',
    email: 'fusioncrafttech@gmail.com',
    website: 'www.fusioncrafttech.com',
    address: '',
  });
  const [taxPercentage, setTaxPercentage] = useState(18);
  const [client, setClient] = useState<ClientDetails>({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      name: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [paymentInstructions, setPaymentInstructions] = useState(defaultPaymentInstructions);

  useEffect(() => {
    setInvoiceNumber(DocumentManager.generateInvoiceNumber());
    setDate(DocumentManager.getCurrentDate());
  }, []);

  useEffect(() => {
    const updatedItems = items.map(item => ({
      ...item,
      amount: item.quantity * item.rate,
    }));
    setItems(updatedItems);
  }, [items.map(i => `${i.quantity}-${i.rate}`).join(',')]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const { cgst, sgst, grandTotal } = DocumentManager.calculateTotals(subtotal, taxPercentage);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: DocumentManager.generateId(),
      name: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateClient = (field: keyof ClientDetails, value: string) => {
    setClient({ ...client, [field]: value });
  };

  const generatePDF = async () => {
    const invoiceData: InvoiceData = {
      id: DocumentManager.generateId(),
      invoiceNumber,
      date,
      client,
      items,
      subtotal,
      taxPercentage,
      cgst,
      sgst,
      grandTotal,
      paymentInstructions,
      createdAt: new Date().toISOString(),
    };

    const doc = <InvoicePDF data={invoiceData} companyInfo={companyInfo} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    DocumentManager.saveInvoice(invoiceData);
  };

  const previewPDF = () => {
    setShowPreview(true);
  };

  const invoiceData: InvoiceData = {
    id: DocumentManager.generateId(),
    invoiceNumber,
    date,
    client,
    items,
    subtotal,
    taxPercentage,
    cgst,
    sgst,
    grandTotal,
    paymentInstructions,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Invoice</h1>
              <p className="text-gray-600 text-sm md:text-base">Generate professional invoices for your clients</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tax Percentage
              </label>
              <select
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h2>
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
                Billing Address
              </label>
              <textarea
                value={client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter billing address"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Items</h2>
            <button
              onClick={addItem}
              className="flex items-center justify-center px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>

          {/* Mobile-friendly item cards */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Item {index + 1}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
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
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
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
                        {item.amount.toLocaleString()}
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
                <span className="text-gray-600 text-sm font-medium">Tax ({taxPercentage}%):</span>
                <span className="font-semibold text-gray-900">₹{(cgst + sgst).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">CGST ({taxPercentage / 2}%):</span>
                <span className="font-semibold text-gray-900">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">SGST ({taxPercentage / 2}%):</span>
                <span className="font-semibold text-gray-900">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                <span className="text-xl font-bold text-emerald-600">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-20">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Instructions</h2>
          <textarea
            value={paymentInstructions}
            onChange={(e) => setPaymentInstructions(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
          />
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
        title="Invoice Preview"
        fullScreen={true}
      >
        <PDFPreview 
          pdfComponent={<InvoicePDF data={invoiceData} companyInfo={companyInfo} />}
          className="h-full"
        />
      </PreviewModal>
    </div>
  );
}
