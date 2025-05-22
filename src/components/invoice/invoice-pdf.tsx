
"use client"; 

import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
import type { Order } from '@/types'; // Keep type for clarity, even if not all fields used

// Minimal styles - REMOVED FONT FAMILY and complex layout
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontSize: 12, // Default font size for all text elements
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 5,
  },
});

interface InvoicePDFProps {
  order: Order | null; // Allow null to be safe, though UserOrderDetailPage should guard this
}

// Hyper-simplified InvoicePDF for debugging
const InvoicePDF: React.FC<InvoicePDFProps> = ({ order }) => {
  const orderId = order?.id || 'N/A';
  const customerName = order?.customerInfo?.fullName || 'N/A';
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';

  return (
  <Document title={`Invoice-${orderId}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Invoice</Text>
        <Text style={styles.text}>Order ID: {orderId}</Text>
        <Text style={styles.text}>Customer: {customerName}</Text>
        <Text style={styles.text}>Date: {orderDate}</Text>
        <Text style={styles.text}>Total Amount: ₹{order?.totalAmount?.toFixed(2) || '0.00'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Thank you for your order!</Text>
      </View>
    </Page>
  </Document>
  );
};

export default InvoicePDF;
