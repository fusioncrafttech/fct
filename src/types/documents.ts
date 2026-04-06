export interface ClientDetails {
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface QuotationData {
  id: string;
  quotationNumber: string;
  date: string;
  client: ClientDetails;
  services: ServiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  terms: string;
  notes: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  client: ClientDetails;
  items: InvoiceItem[];
  subtotal: number;
  taxPercentage: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  paymentInstructions: string;
  createdAt: string;
}

export interface BrochureData {
  id: string;
  template: 'company-profile' | 'website-package' | 'digital-marketing' | 'startup-package';
  title: string;
  subtitle: string;
  services: string[];
  pricingPackages: {
    name: string;
    price: string;
    features: string[];
  }[];
  companyDescription: string;
  contact: {
    website: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export type DocumentType = 'quotation' | 'invoice' | 'brochure';

export interface DocumentHistory {
  id: string;
  type: DocumentType;
  documentNumber: string;
  clientName: string;
  date: string;
  totalAmount: number;
  fileName: string;
  createdAt: string;
}

export interface DocumentTemplate {
  quotation: QuotationData;
  invoice: InvoiceData;
  brochure: BrochureData;
}
