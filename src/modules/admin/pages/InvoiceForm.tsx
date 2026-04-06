import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Eye } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../../../components/pdf/InvoicePDF';
import PreviewModal from '../../../components/modals/PreviewModal';
import { DocumentManager, defaultPaymentInstructions } from '../../../utils/documentUtils';
import type { InvoiceData, InvoiceItem, ClientDetails } from '../../../types/documents';

export default function InvoiceForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
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

    const doc = <InvoicePDF data={invoiceData} />;
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          
          {/* From Section */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-4">
              <img 
                src="/FCT Logo.png" 
                alt="Fusioncrafttech Logo" 
                className="w-12 h-4 rounded"
              />
              <div>
                <p className="font-bold text-gray-900">Fusioncrafttech</p>
                <p className="text-sm text-gray-600">+91 93601 21830</p>
                <p className="text-sm text-gray-600">fusioncrafttech@gmail.com</p>
                <p className="text-sm text-gray-600">www.fusioncrafttech.com</p>
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
              Download PDF
            </button>
          </div>
        </div>

        {/* Document Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceNumber}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Percentage
            </label>
            <select
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>0%</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>
        </div>

        {/* Client Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
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
                Billing Address
              </label>
              <textarea
                value={client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter billing address"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
            <button
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">Item Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Quantity</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Rate (₹)</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Amount (₹)</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Item name"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center font-medium">
                      {item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        disabled={items.length === 1}
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
                  <span className="text-gray-600">Tax ({taxPercentage}%):</span>
                  <span className="font-medium">₹{(cgst + sgst).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST ({taxPercentage / 2}%):</span>
                  <span className="font-medium">₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST ({taxPercentage / 2}%):</span>
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

        {/* Payment Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Instructions
          </label>
          <textarea
            value={paymentInstructions}
            onChange={(e) => setPaymentInstructions(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        fullScreen={true}
      >
        <div className="bg-white p-4">
          <InvoicePDF data={invoiceData} />
        </div>
      </PreviewModal>
    </div>
  );
}
