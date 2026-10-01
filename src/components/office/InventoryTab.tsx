import React, { useState } from 'react';
import { InventoryItem, StockTransfer } from '../../types';
import {
  Building2,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Truck,
  MapPin,
  Box,
  Layers,
} from 'lucide-react';

interface InventoryTabProps {
  inventory: InventoryItem[];
  transfers: StockTransfer[];
  onRequestTransfer: (productId: string, quantity: number, notes?: string) => void;
  onReceiveTransfer: (transferId: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  transfers,
  onRequestTransfer,
  onReceiveTransfer,
}) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(inventory[0]?.productId || '');
  const [transferQty, setTransferQty] = useState(15);
  const [transferNotes, setTransferNotes] = useState('');

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || transferQty <= 0) return;
    onRequestTransfer(selectedProductId, transferQty, transferNotes);
    setShowTransferModal(false);
    setTransferNotes('');
  };

  const activeTransfers = transfers.filter((t) => t.status !== 'RECEIVED');
  const completedTransfers = transfers.filter((t) => t.status === 'RECEIVED');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Inventory & Replenishment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stock levels across Main Warehouse and Secondary Annex
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" /> Request Transfer
        </button>
      </div>

      {/* Active Inter-Warehouse Transfer Tracker */}
      {activeTransfers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-amber-950 text-sm">
                Active Transfers ({activeTransfers.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-800">
              In-Transit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeTransfers.map((tr) => (
              <div
                key={tr.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      #{tr.id} &bull; {tr.quantity} units
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {tr.status}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">{tr.productName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {tr.fromLocation} &rarr; {tr.toLocation}
                  </div>
                  {tr.notes && (
                    <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded">
                      {tr.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Requested {new Date(tr.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    type="button"
                    onClick={() => onReceiveTransfer(tr.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Receive Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Stock by Location
            </h3>
            <p className="text-xs text-slate-500">
              Current inventory levels across facilities
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
            {inventory.length} SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Main Picking Shelf</th>
                <th className="py-3 px-4">Main Stock</th>
                <th className="py-3 px-4">Secondary Annex Stock</th>
                <th className="py-3 px-4">In-Transit</th>
                <th className="py-3 px-4">Status & Alert</th>
                <th className="py-3 px-4 text-right">Quick Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isOutOfStockMain = item.mainWarehouseStock === 0;
                const isLowStockMain = item.mainWarehouseStock <= item.reorderLevel;

                return (
                  <tr
                    key={item.productId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isOutOfStockMain ? 'bg-rose-50/30' : isLowStockMain ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Product & SKU */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {item.productName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {item.sku} &bull; Barcode: {item.barcode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Main Shelf */}
                    <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                      {item.locationMain}
                    </td>

                    {/* Main Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                          isOutOfStockMain
                            ? 'bg-rose-100 text-rose-800'
                            : isLowStockMain
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.mainWarehouseStock} units
                      </span>
                    </td>

                    {/* Secondary Stock */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {item.secondWarehouseStock} units
                      <span className="block text-[10px] text-slate-400 font-sans">
                        ({item.locationSecondary})
                      </span>
                    </td>

                    {/* In-Transit Transfer */}
                    <td className="py-3 px-4">
                      {item.pendingTransferQuantity > 0 ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Truck className="w-3 h-3" /> +{item.pendingTransferQuantity} in transit
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Status Alert */}
                    <td className="py-3 px-4">
                      {isOutOfStockMain ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock (Main)
                        </span>
                      ) : isLowStockMain ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Healthy Buffer
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setShowTransferModal(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                      >
                        Transfer Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Request Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">
              Transfer Stock from Secondary Warehouse
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Stock will be loaded from Secondary Warehouse bulk storage and moved to Main picking shelves.
            </p>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product to Transfer
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                >
                  {inventory.map((inv) => (
                    <option key={inv.productId} value={inv.productId}>
                      {inv.productName} (Secondary Stock: {inv.secondWarehouseStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quantity to Move
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={transferQty}
                  onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)}
                  className="w-full text-sm font-bold rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Urgency / Transfer Note
                </label>
                <input
                  type="text"
                  placeholder="e.g., Priority order backorder, transfer immediately."
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Transfer Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
