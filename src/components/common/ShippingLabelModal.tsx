import React, { useState } from 'react';
import { Courier, Order } from '../../types';
import { X, Printer, Truck, Check, ExternalLink } from 'lucide-react';

interface ShippingLabelModalProps {
  order: Order;
  couriers: Courier[];
  onClose: () => void;
  onGenerateLabel: (orderId: string, courierId: string) => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  order,
  couriers,
  onClose,
  onGenerateLabel,
}) => {
  const [selectedCourierId, setSelectedCourierId] = useState<string>(
    order.courierId || couriers[0]?.id || ''
  );

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId);

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmAndGenerate = () => {
    onGenerateLabel(order.id, selectedCourierId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Shipping Label & Courier Dispatch
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Order #{order.orderNumber} &bull; {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Courier Selection & Comparison */}
          <div className="no-print">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Courier (Speed vs Cost vs Pickup Time)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {couriers.map((courier) => {
                const isSelected = courier.id === selectedCourierId;
                return (
                  <div
                    key={courier.id}
                    onClick={() => setSelectedCourierId(courier.id)}
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: courier.color }}
                        />
                        {courier.name}
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-800">
                        ${courier.cost.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{courier.service}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white/70 px-2 py-1 rounded border border-slate-100">
                      <span>Cutoff: <strong className="text-slate-800">{courier.cutoffTime}</strong></span>
                      <span>Staging: <strong className="text-slate-800">{courier.stagingBay}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable Label View */}
          <div className="printable-area bg-white border-2 border-dashed border-slate-300 p-6 rounded-xl max-w-md mx-auto shadow-inner text-slate-900 font-sans">
            <div className="border-b-2 border-black pb-3 mb-3 flex justify-between items-start">
              <div>
                <div className="text-2xl font-black tracking-tighter">
                  {selectedCourier?.name.toUpperCase()}
                </div>
                <div className="text-xs font-bold tracking-widest text-slate-600">
                  {selectedCourier?.service.toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-black text-white text-xs font-black rounded">
                  {order.priority ? 'PRIORITY 1' : 'STANDARD'}
                </span>
                <div className="text-[10px] font-mono mt-1 text-slate-600">
                  {selectedCourier?.stagingBay}
                </div>
              </div>
            </div>

            {/* Recipient & Sender */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <span className="font-bold text-[10px] uppercase text-slate-500 block">SHIP FROM:</span>
                <p className="font-bold">XYZ Fulfillment</p>
                <p className="text-slate-600">Main Warehouse, Dock 3</p>
                <p className="text-slate-600">Portland, OR 97201</p>
              </div>
              <div>
                <span className="font-bold text-[10px] uppercase text-slate-500 block">DELIVER TO:</span>
                <p className="font-bold text-sm text-slate-900">{order.shippingAddress.name}</p>
                <p className="text-slate-700">{order.shippingAddress.street}</p>
                <p className="text-slate-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="my-4 text-center border-t border-b border-black py-4">
              <div className="tracking-widest font-mono text-xs text-slate-500 mb-1">
                TRACKING: {order.trackingNumber || `TRK-PENDING-${order.id}`}
              </div>
              {/* Barcode visual generator lines */}
              <div className="flex justify-center items-center h-14 space-x-[2px] bg-white px-2 py-1">
                {[1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 1, 2, 2, 1, 3, 2, 1, 4, 1, 3, 2, 1, 2, 4].map(
                  (width, idx) => (
                    <div
                      key={idx}
                      className="bg-black h-full"
                      style={{ width: `${width * 2}px` }}
                    />
                  )
                )}
              </div>
              <div className="font-mono text-sm font-bold tracking-widest mt-1">
                *{order.trackingNumber || order.orderNumber}*
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="text-[11px] text-slate-600">
              <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1">
                PACKAGE CONTENTS ({order.items.reduce((acc, i) => acc + i.quantity, 0)} ITEMS):
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {order.items.map((i) => (
                  <li key={i.id}>
                    <span className="font-semibold text-slate-800">{i.quantity}x {i.productName}</span>{' '}
                    <span className="text-slate-500 font-mono">({Object.values(i.variant).join(', ')})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            {order.labelGenerated ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Check className="w-4 h-4" /> Ready for printing and packing
              </span>
            ) : (
              <span>Label not yet created. Assign courier to generate.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>

            {order.labelGenerated ? (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Printer className="w-4 h-4" /> Print Label
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmAndGenerate}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Check className="w-4 h-4" /> Generate Label & Dispatch to Warehouse
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
