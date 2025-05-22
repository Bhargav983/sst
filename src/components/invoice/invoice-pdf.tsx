
"use client"; 

import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
import type { Order } from '@/types';

// Minimal styles for debugging - REMOVED FONT FAMILY
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  }
});

interface InvoicePDFProps {
  order: Order | null;
}

// Hyper-simplified InvoicePDF for debugging
const InvoicePDF: React.FC<InvoicePDFProps> = ({ order }) => (
  <Document title={`Invoice-Debug`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Invoice Debug</Text>
        <Text style={styles.text}>This is a minimal test PDF.</Text>
        {order && order.id && (
           <Text style={styles.text}>Order ID (if passed): {order.id}</Text>
        )}
        {!order || !order.id && (
            <Text style={styles.text}>Order ID: Not available or order not passed.</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;

    