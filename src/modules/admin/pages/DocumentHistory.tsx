import { useState, useEffect } from 'react';
import { Download, Filter, Search, FileText, Receipt, BookOpen } from 'lucide-react';
import { DocumentManager } from '../../../utils/documentUtils';
import type { DocumentHistory, DocumentType } from '../../../types/documents';

export default function DocumentHistory() {
  const [documents, setDocuments] = useState<DocumentHistory[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');

  useEffect(() => {
    const history = DocumentManager.getDocumentHistory();
    setDocuments(history);
    setFilteredDocuments(history);
  }, []);

  useEffect(() => {
    let filtered = documents;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, filterType]);

  const downloadDocument = (document: DocumentHistory) => {
    // In a real application, you would retrieve the actual PDF from storage
    // For this demo, we'll show a message
    alert(`Downloading ${document.fileName}...\n\nIn a real application, this would download the actual PDF file.`);
  };

  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'quotation':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'invoice':
        return <Receipt className="w-4 h-4 text-green-600" />;
      case 'brochure':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'quotation':
        return 'bg-blue-100 text-blue-800';
      case 'invoice':
        return 'bg-green-100 text-green-800';
      case 'brochure':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Document History</h1>
          <div className="text-sm text-gray-500">
            {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Documents</option>
              <option value="quotation">Quotations</option>
              <option value="invoice">Invoices</option>
              <option value="brochure">Brochures</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Documents Table */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No documents have been generated yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                    Document Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                    Client Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(document.type)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(document.type)}`}>
                          {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900">
                      {document.documentNumber}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-700">
                      {document.clientName}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-700">
                      {formatDate(document.date)}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-right font-medium text-gray-900">
                      {document.totalAmount > 0 
                        ? `₹${document.totalAmount.toLocaleString()}`
                        : '-'
                      }
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <button
                        onClick={() => downloadDocument(document)}
                        className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        title={`Download ${document.fileName}`}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Statistics */}
        {documents.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Quotations</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {documents.filter(doc => doc.type === 'quotation').length}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Invoices</p>
                    <p className="text-2xl font-bold text-green-900">
                      {documents.filter(doc => doc.type === 'invoice').length}
                    </p>
                  </div>
                  <Receipt className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Total Brochures</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {documents.filter(doc => doc.type === 'brochure').length}
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{documents
                        .filter(doc => doc.totalAmount > 0)
                        .reduce((sum, doc) => sum + doc.totalAmount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
