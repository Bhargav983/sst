
"use client"; // Required for @react-pdf/renderer components if they use hooks or context internally

import type { Order } from '@/types';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Using default Helvetica font, so no Font.register needed unless custom fonts are desired.
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 25,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#D45500', // Primary color
  },
  invoiceTitleSection: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  headerInfoText: {
    fontSize: 9,
    color: '#555555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#444444',
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 3,
  },
  text: {
    marginBottom: 3,
    lineHeight: 1.4,
  },
  addressBlock: {
    marginBottom: 5,
  },
  itemTableContainer: {
    borderWidth: 0.5,
    borderColor: '#BFBFBF',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#BFBFBF',
    alignItems: 'stretch', // Ensure columns stretch to fill row height
  },
  tableRowLast: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tableColHeaderContainer: {
    backgroundColor: '#F0F0F0',
    padding: 6,
    borderRightWidth: 0.5,
    borderRightColor: '#BFBFBF',
    justifyContent: 'center', // Center text vertically
  },
  tableColHeaderContainerLast: { // No right border for the last header cell
    backgroundColor: '#F0F0F0',
    padding: 6,
    justifyContent: 'center',
  },
  tableColContainer: {
    padding: 6,
    borderRightWidth: 0.5,
    borderRightColor: '#BFBFBF',
    justifyContent: 'center', // Center text vertically
  },
  tableColContainerLast: { // No right border for the last data cell
     padding: 6,
     justifyContent: 'center',
  },
  colItem:    { width: '40%' },
  colQty:     { width: '15%' },
  colPrice:   { width: '20%' },
  colTotal:   { width: '25%' },
  headerTextCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  dataTextCell: {
    fontSize: 9,
  },
  rightAlignedText: {
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryDetails: {
    width: '45%', // Adjust width as needed
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#444444',
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#AAAAAA',
    paddingHorizontal: 5,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#888888',
    fontSize: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#CCCCCC',
    paddingTop: 5,
  },
});


interface InvoicePDFProps {
  order: Order;
}

const formatDateSafe = (dateInput: Date | string | number | undefined): string => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  // Using a simple format to avoid locale issues in PDF rendering if any
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({ order }) => (
  <Document title={`Invoice-${order?.id || 'unknown'}`} author="SutraCart">
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>SutraCart</Text>
        <View style={styles.invoiceTitleSection}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.headerInfoText}>Order ID: {order?.id || 'N/A'}</Text>
          <Text style={styles.headerInfoText}>Date: {formatDateSafe(order?.createdAt)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <View style={[styles.section, {width: '48%'}]}>
            <Text style={styles.sectionTitle}>Billed To</Text>
            <View style={styles.addressBlock}>
            <Text style={styles.text}>{order?.customerInfo?.fullName || 'N/A'}</Text>
            <Text style={styles.text}>{order?.customerInfo?.email || 'N/A'}</Text>
            <Text style={styles.text}>{order?.customerInfo?.phone || 'N/A'}</Text>
            </View>
        </View>
        <View style={[styles.section, {width: '48%'}]}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.addressBlock}>
            <Text style={styles.text}>{order?.customerInfo?.addressLine1 || 'N/A'}</Text>
            {order?.customerInfo?.addressLine2 && <Text style={styles.text}>{order.customerInfo.addressLine2}</Text>}
            <Text style={styles.text}>
                {order?.customerInfo?.city || 'N/A'}, {order?.customerInfo?.state || 'N/A'} - {order?.customerInfo?.postalCode || 'N/A'}
            </Text>
            <Text style={styles.text}>{order?.customerInfo?.country || 'N/A'}</Text>
            </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.itemTableContainer}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.colItem, styles.tableColHeaderContainer]}>
              <Text style={styles.headerTextCell}>Item Description</Text>
            </View>
            <View style={[styles.colQty, styles.tableColHeaderContainer]}>
              <Text style={[styles.headerTextCell, styles.rightAlignedText]}>Qty</Text>
            </View>
            <View style={[styles.colPrice, styles.tableColHeaderContainer]}>
              <Text style={[styles.headerTextCell, styles.rightAlignedText]}>Unit Price (₹)</Text>
            </View>
            <View style={[styles.colTotal, styles.tableColHeaderContainerLast]}>
              <Text style={[styles.headerTextCell, styles.rightAlignedText]}>Total (₹)</Text>
            </View>
          </View>
          {/* Table Body */}
          {Array.isArray(order?.items) && order.items.map((item, index) => (
            <View style={index === (order.items || []).length - 1 ? styles.tableRowLast : styles.tableRow} key={item?.id || index}>
              <View style={[styles.colItem, styles.tableColContainer]}>
                <Text style={styles.dataTextCell}>{(item?.name || 'N/A')} ({(item?.weight || 'N/A')})</Text>
              </View>
              <View style={[styles.colQty, styles.tableColContainer]}>
                <Text style={[styles.dataTextCell, styles.rightAlignedText]}>{item?.quantity || 0}</Text>
              </View>
              <View style={[styles.colPrice, styles.tableColContainer]}>
                <Text style={[styles.dataTextCell, styles.rightAlignedText]}>{(item?.price || 0).toFixed(2)}</Text>
              </View>
              <View style={[styles.colTotal, styles.tableColContainerLast]}>
                <Text style={[styles.dataTextCell, styles.rightAlignedText]}>{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>₹{(order?.subtotal || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>₹{(order?.shippingCost || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                <Text style={styles.grandTotalValue}>₹{(order?.totalAmount || 0).toFixed(2)}</Text>
            </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Thank you for your purchase from SutraCart! Visit us again at www.sutracart.example.com
      </Text>
    </Page>
  </Document>
);

export default InvoicePDF;

