
"use client";

import type { Order } from '@/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface InvoiceHTMLTemplateProps {
  order: Order;
}

export function InvoiceHTMLTemplate({ order }: InvoiceHTMLTemplateProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(parsedDate.getTime())) return 'Invalid Date';
      return format(parsedDate, 'PPP');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="font-sans p-8 bg-white text-gray-800 w-[210mm] min-h-[297mm]"> {/* A4 dimensions approx */}
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-primary">SutraCart</h1>
          <p className="text-sm text-gray-500">Authentic Masala Pastes</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold text-gray-700">INVOICE</h2>
          <p className="text-sm"><span className="font-semibold">Order ID:</span> {order.id || 'N/A'}</p>
          <p className="text-sm"><span className="font-semibold">Date:</span> {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 py-6 border-b border-gray-200">
        <div>
          <h3 className="text-md font-semibold text-gray-600 mb-1">BILL TO:</h3>
          <p className="text-sm">{order.customerInfo?.fullName || 'N/A'}</p>
          <p className="text-sm">{order.customerInfo?.addressLine1 || 'N/A'}</p>
          {order.customerInfo?.addressLine2 && <p className="text-sm">{order.customerInfo.addressLine2}</p>}
          <p className="text-sm">
            {order.customerInfo?.city || 'N/A'}, {order.customerInfo?.state || 'N/A'} - {order.customerInfo?.postalCode || 'N/A'}
          </p>
          <p className="text-sm">{order.customerInfo?.country || 'N/A'}</p>
          <p className="text-sm mt-1">Email: {order.customerInfo?.email || 'N/A'}</p>
          <p className="text-sm">Phone: {order.customerInfo?.phone || 'N/A'}</p>
        </div>
        {/* Could add a Ship To section if different, for now assuming same */}
         <div>
          <h3 className="text-md font-semibold text-gray-600 mb-1">SHIP TO:</h3>
           <p className="text-sm">{order.customerInfo?.fullName || 'N/A'}</p>
          <p className="text-sm">{order.customerInfo?.addressLine1 || 'N/A'}</p>
          {order.customerInfo?.addressLine2 && <p className="text-sm">{order.customerInfo.addressLine2}</p>}
          <p className="text-sm">
            {order.customerInfo?.city || 'N/A'}, {order.customerInfo?.state || 'N/A'} - {order.customerInfo?.postalCode || 'N/A'}
          </p>
          <p className="text-sm">{order.customerInfo?.country || 'N/A'}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left font-semibold text-gray-600">#</th>
              <th className="p-2 text-left font-semibold text-gray-600">Item</th>
              <th className="p-2 text-center font-semibold text-gray-600">Qty</th>
              <th className="p-2 text-right font-semibold text-gray-600">Unit Price</th>
              <th className="p-2 text-right font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div>{item.name || 'Unknown Item'}</div>
                  <div className="text-xs text-gray-500">{item.weight || 'N/A'}</div>
                </td>
                <td className="p-2 text-center">{item.quantity || 1}</td>
                <td className="p-2 text-right">₹{Number(item.price || 0).toFixed(2)}</td>
                <td className="p-2 text-right">₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end py-6 border-t border-gray-200">
        <div className="w-full max-w-xs text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">₹{Number(order.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-semibold">₹{Number(order.shippingCost || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-300">
            <span className="text-lg font-bold text-primary">Grand Total:</span>
            <span className="text-lg font-bold text-primary">₹{Number(order.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="py-4 border-t border-gray-200 text-sm">
        <span className="font-semibold">Payment Status:</span> {order.paymentStatus || 'N/A'}
        {order.paymentStatus === 'Paid' && <span className="ml-2 text-green-600 font-semibold">(Paid)</span>}
      </div>


      {/* Footer */}
      <div className="pt-8 mt-8 border-t-2 border-gray-200 text-center text-xs text-gray-500">
        <p>Thank you for your business with SutraCart!</p>
        <p>Questions? Contact us at support@sutracart.com</p>
        <p className="mt-1">SutraCart | Bangalore, India</p>
      </div>
    </div>
  );
}
