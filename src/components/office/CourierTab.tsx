import React, { useState } from 'react';
import { Courier, Order } from '../../types';
import { Truck, Clock, CheckCircle2, Printer, MapPin, Box, ShieldCheck, Flame } from 'lucide-react';

interface CourierTabProps {
  couriers: Courier[];
  orders: Order[];
  onDispatchCourier: (courierId: string) => void;
}

export const CourierTab: React.FC<CourierTabProps> = ({
  couriers,
  orders,
  onDispatchCourier,
}) => {
  const [selectedCourierId, setSelectedCourierId] = useState<string>(couriers[0]?.id || '');
  const [showManifestModal, setShowManifestModal] = useState(false);

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId);
  const stagedOrders = orders.filter(
    (o) => o.courierId === selectedCourierId && o.status === 'STAGED'
  );
  const dispatchedTodayOrders = orders.filter(
    (o) => o.courierId === selectedCourierId && o.status === 'DISPATCHED'
  );

  const handleConfirmPickup = () => {
    onDispatchCourier(selectedCourierId);
    setShowManifestModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards per Courier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {couriers.map((courier) => {
          const stagedForThis = orders.filter(
            (o) => o.courierId === courier.id && o.status === 'STAGED'
          ).length;
          const dispatchedForThis = orders.filter(
            (o) => o.courierId === courier.id && o.status === 'DISPATCHED'
          ).length;
          const isSelected = courier.id === selectedCourierId;

          return (
            <div
              key={courier.id}
              onClick={() => setSelectedCourierId(courier.id)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: courier.color }}
                />
                <span className="font-mono text-xs font-bold text-slate-500">
                  ${courier.cost.toFixed(2)} / parcel
                </span>
              </div>

              <h4 className="font-black text-slate-900 text-base">{courier.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{courier.service}</p>

              <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cutoff:</span>
                  <span className="font-bold text-slate-800">{courier.cutoffTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup:</span>
                  <span className="font-bold text-slate-800">{courier.pickupWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Staging:</span>
                  <span className="font-bold text-slate-800">{courier.stagingBay}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-lg font-black text-emerald-700">{stagedForThis}</span>
                  <span className="text-[11px] text-slate-500 block">Waiting in Bay</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-600">{dispatchedForThis}</span>
                  <span className="text-[11px] text-slate-500 block">Dispatched Today</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Courier Staging Bay & Handover Sheet */}
      {selectedCourier && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                style={{ backgroundColor: selectedCourier.color }}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedCourier.name} Staging
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {selectedCourier.stagingBay}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Pickup: <strong>{selectedCourier.pickupWindow}</strong> &bull; Cutoff: <strong>{selectedCourier.cutoffTime}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowManifestModal(true)}
                disabled={stagedOrders.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" /> Manifest ({stagedOrders.length})
              </button>

              <button
                type="button"
                onClick={handleConfirmPickup}
                disabled={stagedOrders.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Pickup
              </button>
            </div>
          </div>

          {/* Staged Packages List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-600" />
                <span>Staged Parcels ({stagedOrders.length})</span>
              </h4>
            </div>

            {stagedOrders.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-700 text-xs">No packages currently in this bay.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stagedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        #{ord.orderNumber}
                      </span>
                      {ord.priority && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-black">
                          <Flame className="w-3 h-3 fill-current" /> RUSH
                        </span>
                      )}
                    </div>

                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        Track: {ord.trackingNumber || 'Pending'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        {ord.stagingBay || selectedCourier.stagingBay}
                      </span>
                      <span className="text-slate-500">
                        {ord.items.length} item(s)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Handover Sheet / Printable Manifest Modal */}
      {showManifestModal && selectedCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 space-y-6">
            <div className="printable-area space-y-4 text-slate-900 font-sans">
              <div className="border-b-2 border-black pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    DISPATCH MANIFEST
                  </h2>
                  <p className="text-xs font-mono text-slate-600">
                    Courier: {selectedCourier.name} ({selectedCourier.service})
                  </p>
                  <p className="text-xs text-slate-600">
                    Date: {new Date().toLocaleDateString()} &bull; Facility: Main Warehouse
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold block">
                    {stagedOrders.length} PARCELS
                  </span>
                  <span className="text-xs text-slate-500">Staging: {selectedCourier.stagingBay}</span>
                </div>
              </div>

              {/* Table of Orders */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 uppercase font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Tracking Barcode</th>
                    <th className="p-2">Recipient / Destination</th>
                    <th className="p-2">Items</th>
                    <th className="p-2">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {stagedOrders.map((ord, idx) => (
                    <tr key={ord.id}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2 font-bold">{ord.orderNumber}</td>
                      <td className="p-2">{ord.trackingNumber}</td>
                      <td className="p-2 font-sans">{ord.customerName} ({ord.shippingAddress.city}, {ord.shippingAddress.state})</td>
                      <td className="p-2">{ord.items.length}</td>
                      <td className="p-2 font-sans">[ &nbsp; ] Verified</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-black text-xs font-sans">
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold">Dispatch Clerk Signature:</p>
                  <p className="text-slate-500 mt-4">Time: __________________</p>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold">{selectedCourier.name} Driver Signature:</p>
                  <p className="text-slate-500 mt-4">Driver Badge #: __________________</p>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setShowManifestModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Close Preview
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Physical Manifest
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPickup}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Driver Pickup & Dispatch All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
