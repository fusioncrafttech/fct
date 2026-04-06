import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { InvoiceData } from '../../types/documents';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fromSection: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  companyContact: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  clientInfo: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  clientLabel: {
    width: 80,
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  clientValue: {
    flex: 1,
    fontSize: 11,
    color: '#1f2937',
  },
  table: {
    width: '100%',
    border: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    padding: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    borderRight: 1,
    borderRightColor: '#e5e7eb',
    borderRightStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    padding: 10,
    fontSize: 10,
    color: '#1f2937',
    borderRight: 1,
    borderRightColor: '#e5e7eb',
    borderRightStyle: 'solid',
  },
  totals: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1f2937',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: 2,
    borderTopColor: '#374151',
    borderTopStyle: 'solid',
    paddingTop: 8,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  paymentSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 5,
    border: 1,
    borderColor: '#3b82f6',
    borderStyle: 'solid',
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 10,
    color: '#1e40af',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
  companyInfo?: {
    name: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}

export default function InvoicePDF({ data, companyInfo }: InvoicePDFProps) {
  const defaultCompanyInfo = {
    name: 'Fusioncrafttech',
    phone: '+91 93601 21830',
    email: 'fusioncrafttech@gmail.com',
    website: 'www.fusioncrafttech.com',
    address: '',
  };

  const company = companyInfo || defaultCompanyInfo;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {/* From Section */}
            <View style={styles.fromSection}>
              <Image src="/FCT Logo.png" style={styles.logo} />
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyContact}>{company.phone}</Text>
              <Text style={styles.companyContact}>{company.email}</Text>
              <Text style={styles.companyContact}>{company.website}</Text>
              {company.address && (
                <Text style={styles.companyContact}>{company.address}</Text>
              )}
            </View>
            
            {/* Document Info */}
            <View style={styles.infoColumn}>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.subtitle}>Web & Digital Solutions</Text>
            </View>
          </View>
          
          <View style={styles.documentInfo}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Invoice Number</Text>
              <Text style={styles.infoValue}>{data.invoiceNumber}</Text>
              
              <Text style={styles.infoLabel}>Invoice Date</Text>
              <Text style={styles.infoValue}>{data.date}</Text>
            </View>
            
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text style={styles.infoValue}>
                {new Date(data.date).getTime() + 7 * 24 * 60 * 60 * 1000 > Date.now() 
                  ? new Date(new Date(data.date).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : 'Overdue'}
              </Text>
            </View>
          </View>
        </View>

        {/* Billing Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.clientInfo}>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Name:</Text>
              <Text style={styles.clientValue}>{data.client.name}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Company:</Text>
              <Text style={styles.clientValue}>{data.client.company}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Phone:</Text>
              <Text style={styles.clientValue}>{data.client.phone}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Email:</Text>
              <Text style={styles.clientValue}>{data.client.email}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Address:</Text>
              <Text style={styles.clientValue}>{data.client.address}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Item Name</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Quantity</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Amount</Text>
            </View>
            
            {data.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.rate.toLocaleString()}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{data.subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({data.taxPercentage}%):</Text>
            <Text style={styles.totalValue}>₹{(data.cgst + data.sgst).toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>CGST ({data.taxPercentage / 2}%):</Text>
            <Text style={styles.totalValue}>₹{data.cgst.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SGST ({data.taxPercentage / 2}%):</Text>
            <Text style={styles.totalValue}>₹{data.sgst.toLocaleString()}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>₹{data.grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Instructions */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Instructions</Text>
          <Text style={styles.paymentText}>{data.paymentInstructions}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Fusioncrafttech | fusioncrafttech@gmail.com | +91 93601 21830 | www.fusioncrafttech.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
