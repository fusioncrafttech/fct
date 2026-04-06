import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { BrochureData } from '../../types/documents';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fromSection: {
    flex: 1,
    alignItems: 'flex-start',
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
  infoColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 10,
  },
  serviceBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
    marginTop: 5,
    marginRight: 12,
  },
  serviceText: {
    flex: 1,
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
  },
  packagesContainer: {
    marginBottom: 20,
  },
  packageCard: {
    backgroundColor: '#f8fafc',
    border: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  packageName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  packageFeatures: {
    paddingLeft: 10,
  },
  packageFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureBullet: {
    fontSize: 10,
    color: '#10b981',
    marginRight: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 10,
    color: '#4b5563',
  },
  description: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.6,
    marginBottom: 20,
    textAlign: 'justify',
  },
  contactSection: {
    backgroundColor: '#f0f9ff',
    border: 1,
    borderColor: '#3b82f6',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 20,
    marginTop: 30,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactItem: {
    flex: 1,
    textAlign: 'center',
  },
  contactLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1e40af',
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

interface BrochurePDFProps {
  data: BrochureData;
  companyInfo?: {
    name: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}

export default function BrochurePDF({ data, companyInfo }: BrochurePDFProps) {
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
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.subtitle}>{data.subtitle}</Text>
              <Text style={styles.subtitle}>Web & Digital Solutions</Text>
            </View>
          </View>
        </View>

        {/* Services Section */}
        {data.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <View style={styles.servicesContainer}>
              {data.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <View style={styles.serviceBullet} />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pricing Packages */}
        {data.pricingPackages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing Packages</Text>
            <View style={styles.packagesContainer}>
              {data.pricingPackages.map((pkg, index) => (
                <View key={index} style={styles.packageCard}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  <View style={styles.packageFeatures}>
                    {pkg.features.map((feature, featureIndex) => (
                      <View key={featureIndex} style={styles.packageFeature}>
                        <Text style={styles.featureBullet}>✓</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Company Description */}
        {data.companyDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Fusioncrafttech</Text>
            <Text style={styles.description}>{data.companyDescription}</Text>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get In Touch</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>{data.contact.website}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{data.contact.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{data.contact.phone}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Fusioncrafttech | fusioncrafttech@gmail.com | +91 93601 21830
          </Text>
        </View>
      </Page>
    </Document>
  );
}
