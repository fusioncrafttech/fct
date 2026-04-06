import type { QuotationData, InvoiceData, BrochureData, DocumentHistory, DocumentType } from '../types/documents';

const STORAGE_KEYS = {
  QUOTATIONS: 'fct_quotations',
  INVOICES: 'fct_invoices',
  BROCHURES: 'fct_brochures',
  DOCUMENT_HISTORY: 'fct_document_history',
  QUOTATION_COUNTER: 'fct_quotation_counter',
  INVOICE_COUNTER: 'fct_invoice_counter',
} as const;

export class DocumentManager {
  static generateQuotationNumber(): string {
    const currentYear = new Date().getFullYear();
    const counter = this.getQuotationCounter();
    const paddedCounter = counter.toString().padStart(3, '0');
    return `FCT${currentYear}${paddedCounter}`;
  }

  static generateInvoiceNumber(): string {
    const currentYear = new Date().getFullYear();
    const counter = this.getInvoiceCounter();
    const paddedCounter = counter.toString().padStart(3, '0');
    return `FCT-INV-${currentYear}${paddedCounter}`;
  }

  static getQuotationCounter(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.QUOTATION_COUNTER);
    return stored ? parseInt(stored, 10) : 1;
  }

  static incrementQuotationCounter(): void {
    const current = this.getQuotationCounter();
    localStorage.setItem(STORAGE_KEYS.QUOTATION_COUNTER, (current + 1).toString());
  }

  static getInvoiceCounter(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICE_COUNTER);
    return stored ? parseInt(stored, 10) : 1;
  }

  static incrementInvoiceCounter(): void {
    const current = this.getInvoiceCounter();
    localStorage.setItem(STORAGE_KEYS.INVOICE_COUNTER, (current + 1).toString());
  }

  static saveQuotation(quotation: QuotationData): void {
    const quotations = this.getQuotations();
    quotations.push(quotation);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    
    // Add to document history
    const historyItem: DocumentHistory = {
      id: quotation.id,
      type: 'quotation',
      documentNumber: quotation.quotationNumber,
      clientName: quotation.client.name,
      date: quotation.date,
      totalAmount: quotation.grandTotal,
      fileName: `${quotation.quotationNumber}.pdf`,
      createdAt: quotation.createdAt,
    };
    this.addToHistory(historyItem);
    
    // Increment counter
    this.incrementQuotationCounter();
  }

  static saveInvoice(invoice: InvoiceData): void {
    const invoices = this.getInvoices();
    invoices.push(invoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    
    // Add to document history
    const historyItem: DocumentHistory = {
      id: invoice.id,
      type: 'invoice',
      documentNumber: invoice.invoiceNumber,
      clientName: invoice.client.name,
      date: invoice.date,
      totalAmount: invoice.grandTotal,
      fileName: `${invoice.invoiceNumber}.pdf`,
      createdAt: invoice.createdAt,
    };
    this.addToHistory(historyItem);
    
    // Increment counter
    this.incrementInvoiceCounter();
  }

  static saveBrochure(brochure: BrochureData): void {
    const brochures = this.getBrochures();
    brochures.push(brochure);
    localStorage.setItem(STORAGE_KEYS.BROCHURES, JSON.stringify(brochures));
    
    // Add to document history
    const historyItem: DocumentHistory = {
      id: brochure.id,
      type: 'brochure',
      documentNumber: 'BROCHURE',
      clientName: 'General',
      date: brochure.createdAt,
      totalAmount: 0,
      fileName: `Fusioncrafttech-services.pdf`,
      createdAt: brochure.createdAt,
    };
    this.addToHistory(historyItem);
  }

  static getQuotations(): QuotationData[] {
    const stored = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return stored ? JSON.parse(stored) : [];
  }

  static getInvoices(): InvoiceData[] {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return stored ? JSON.parse(stored) : [];
  }

  static getBrochures(): BrochureData[] {
    const stored = localStorage.getItem(STORAGE_KEYS.BROCHURES);
    return stored ? JSON.parse(stored) : [];
  }

  static getDocumentHistory(): DocumentHistory[] {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENT_HISTORY);
    return stored ? JSON.parse(stored) : [];
  }

  static addToHistory(item: DocumentHistory): void {
    const history = this.getDocumentHistory();
    history.unshift(item); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_HISTORY, JSON.stringify(history));
  }

  static filterHistory(type?: DocumentType): DocumentHistory[] {
    const history = this.getDocumentHistory();
    return type ? history.filter(item => item.type === type) : history;
  }

  static calculateTotals(subtotal: number, taxPercentage: number = 18) {
    const taxAmount = (subtotal * taxPercentage) / 100;
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;
    const grandTotal = subtotal + taxAmount;

    return {
      subtotal,
      taxPercentage,
      cgst,
      sgst,
      grandTotal,
    };
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export const defaultTerms = `Work will resume after advance payment.
Remaining amount must be paid before deployment.`;

export const defaultNotes = `Domain and hosting will be provided by the client.
Additional features beyond scope will be charged separately.`;

export const defaultPaymentInstructions = `UPI / Bank Transfer accepted
Payment due within 7 days`;
