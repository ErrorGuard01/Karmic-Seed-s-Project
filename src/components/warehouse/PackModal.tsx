import React, { useState } from 'react';
import { Courier, Order, OrderItem } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Scan,
  Box,
  MapPin,
  Flame,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackModalProps {
  order: Order;
  couriers: Courier[];
  onClose: () => void;
  onVerifyItem: (orderId: string, itemId: string, scannedBarcode: string) => { success: boolean; message: string };
  onCompletePacking: (orderId: string, stagingBay: string) => void;
  onOpenIssueModal: (order: Order) => void;
}

export const PackModal: React.FC<PackModalProps> = ({
  order,
  couriers,
  onClose,
  onVerifyItem,
  onCompletePacking,
  onOpenIssueModal,
}) => {
  const [scanFeedback, setScanFeedback] = useState<Record<string, { success: boolean; message: string } | null>>({});
  const [selectedBoxSize, setSelectedBoxSize] = useState<'Small (A1)' | 'Medium (B2)' | 'Large (C3)'>('Medium (B2)');
  const [isCompleted, setIsCompleted] = useState(false);

  const courier = couriers.find((c) => c.id === order.courierId);
  const stagingBay = courier?.stagingBay || 'Bay A';

  const allItemsVerified = order.items.every((i) => i.verified);

  const handleSimulateScan = (item: OrderItem, barcodeToScan: string) => {
    const result = onVerifyItem(order.id, item.id, barcodeToScan);
    setScanFeedback((prev) => ({
      ...prev,
      [item.id]: result,
    }));

    if (result.success) {
      const willBeAllVerified = order.items.every((i) => (i.id === item.id ? true : i.verified));
      if (willBeAllVerified) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleFinalFinish = () => {
    onCompletePacking(order.id, stagingBay);
    setIsCompleted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border-4 border-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 font-bold rounded-xl">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Pack Station
                </h2>
                {order.priority && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-600 text-white text-xs font-bold">
                    <Flame className="w-3 h-3 fill-current" /> Priority
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Order #{order.orderNumber} &bull; {courier?.name} &bull; {order.customerName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Scan or confirm items to verify
            </span>
            <span className="font-mono text-slate-500 font-semibold">
              {order.items.filter((i) => i.verified).length} of {order.items.length} verified
            </span>
          </div>

          {/* Items Checklist Cards */}
          <div className="space-y-3">
            {order.items.map((item, idx) => {
              const feedback = scanFeedback[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    item.verified
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : feedback?.success === false
                      ? 'bg-rose-50 border-rose-500 animate-pulse'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Item Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-mono px-1 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-base">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-white text-xs font-mono">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {item.shelfLocation}
                        </span>
                      </div>

                      {/* Variant Chips */}
                      <div className="flex flex-wrap gap-1.5 my-1">
                        {Object.entries(item.variant).map(([k, val]) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs"
                          >
                            {val}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-xs">
                          {item.sku}
                        </span>
                      </div>

                      {item.warningNotes && (
                        <div className="text-xs font-semibold text-amber-800 mt-1">
                          {item.warningNotes}
                        </div>
                      )}

                      {/* Feedback */}
                      {feedback && (
                        <div
                          className={`mt-2 p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                            feedback.success
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {feedback.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span>{feedback.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-full sm:w-auto flex sm:flex-col gap-1.5 shrink-0">
                      {item.verified ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 w-full">
                          <button
                            type="button"
                            onClick={() => handleSimulateScan(item, item.barcode)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all"
                          >
                            <Scan className="w-3.5 h-3.5" /> Scan Barcode
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSimulateScan(item, '890123459999')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[11px] rounded-lg transition-colors"
                          >
                            Simulate Error
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staging & Packaging */}
          {allItemsVerified && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">
                    Items Verified
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Ready to package and stage
                  </p>
                </div>
              </div>

              {/* Box Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Package Size
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Small (A1)', 'Medium (B2)', 'Large (C3)'] as const).map(
                    (box) => (
                      <button
                        key={box}
                        type="button"
                        onClick={() => setSelectedBoxSize(box)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          selectedBoxSize === box
                            ? 'border-emerald-600 bg-white text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {box}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Staging Bay */}
              <div className="bg-white border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Target Bay
                  </span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {stagingBay}
                  </div>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  <span>{courier?.name}</span>
                </div>
              </div>

              {/* Stage Button */}
              <button
                type="button"
                disabled={isCompleted}
                onClick={handleFinalFinish}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Staged
                  </>
                ) : (
                  <>
                    <Box className="w-5 h-5" /> Stage in {stagingBay}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenIssueModal(order)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-xs transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Report Issue
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
