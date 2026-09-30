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
  ArrowRight,
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
  const [manualBarcodes, setManualBarcodes] = useState<Record<string, string>>({});
  const [scanFeedback, setScanFeedback] = useState<Record<string, { success: boolean; message: string } | null>>({});
  const [selectedBoxSize, setSelectedBoxSize] = useState<'Small Box (A1)' | 'Medium Box (B2)' | 'Large Box (C3)'>('Medium Box (B2)');
  const [isCompleted, setIsCompleted] = useState(false);

  const courier = couriers.find((c) => c.id === order.courierId);
  const stagingBay = courier?.stagingBay || 'Staging Bay A';

  const allItemsVerified = order.items.every((i) => i.verified);

  const handleSimulateScan = (item: OrderItem, barcodeToScan: string) => {
    const result = onVerifyItem(order.id, item.id, barcodeToScan);
    setScanFeedback((prev) => ({
      ...prev,
      [item.id]: result,
    }));

    if (result.success) {
      // Check if this was the last item
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
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border-4 border-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header - High Contrast for Warehouse Tech-Averse Crew */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-xl">
              <Box className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  PACKING & SCAN STATION
                </h2>
                {order.priority && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-xs font-black animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current" /> RUSH PRIORITY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Order #{order.orderNumber} &bull; Courier: <span className="text-amber-400 font-bold">{courier?.name}</span> &bull; Customer: {order.customerName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Instructions Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <span className="font-bold text-sm block mb-0.5">
                Anti-Error Verification Protocol:
              </span>
              Check the physical item against the screen photo and variant details. Click <strong>"Scan Correct Barcode"</strong> (or enter barcode) to verify. Scans for incorrect variants will be rejected immediately.
            </div>
          </div>

          {/* Items Checklist Cards */}
          <div className="space-y-4">
            {order.items.map((item, idx) => {
              const feedback = scanFeedback[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-3 transition-all ${
                    item.verified
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : feedback?.success === false
                      ? 'bg-rose-50 border-rose-500 animate-pulse'
                      : 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-black text-slate-900 text-lg">
                          {item.quantity}x {item.productName}
                        </span>
                        {/* Shelf Location Pin */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-mono font-bold">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {item.shelfLocation}
                        </span>
                      </div>

                      {/* Prominent Variant Chips */}
                      <div className="flex flex-wrap gap-2 my-1.5">
                        {Object.entries(item.variant).map(([k, val]) => (
                          <span
                            key={k}
                            className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300 shadow-xs"
                          >
                            {k.toUpperCase()}: {val}
                          </span>
                        ))}
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs">
                          SKU: {item.sku}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs">
                          BARCODE: {item.barcode}
                        </span>
                      </div>

                      {/* Warning Notes if any */}
                      {item.warningNotes && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{item.warningNotes}</span>
                        </div>
                      )}

                      {/* Scan Feedback Message */}
                      {feedback && (
                        <div
                          className={`mt-2 p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                            feedback.success
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {feedback.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          )}
                          <span>{feedback.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Verification Actions / Buttons */}
                    <div className="w-full sm:w-auto flex sm:flex-col gap-2 shrink-0">
                      {item.verified ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow">
                          <CheckCircle2 className="w-4 h-4" /> VERIFIED OK
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => handleSimulateScan(item, item.barcode)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all"
                            title="Simulate scanning correct barcode"
                          >
                            <Scan className="w-3.5 h-3.5" /> Scan Match
                          </button>

                          {/* Quick test wrong scan for reviewer demo */}
                          <button
                            type="button"
                            onClick={() => handleSimulateScan(item, '890123459999')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[11px] rounded-lg border border-slate-200 transition-colors"
                            title="Simulate accidental wrong variant scan"
                          >
                            Test Wrong Scan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staging & Box Packing when all items verified */}
          {allItemsVerified && (
            <div className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-950">
                      ALL ITEMS VERIFIED CORRECT
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Zero wrong-variant risk detected. Ready to box & stage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box Size Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Packaging Box
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Small Box (A1)', 'Medium Box (B2)', 'Large Box (C3)'] as const).map(
                    (box) => (
                      <button
                        key={box}
                        type="button"
                        onClick={() => setSelectedBoxSize(box)}
                        className={`py-3 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                          selectedBoxSize === box
                            ? 'border-emerald-600 bg-white text-emerald-900 shadow-md ring-2 ring-emerald-400'
                            : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {box}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Staging Bay Assignment Callout */}
              <div className="bg-white border-2 border-emerald-300 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    2. Designated Staging Area
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {stagingBay}
                  </div>
                  <p className="text-xs text-slate-500">
                    Courier: {courier?.name} &bull; Cutoff: {courier?.cutoffTime}
                  </p>
                </div>
                <div className="px-4 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-mono font-bold">
                  BAY #{stagingBay.replace(/[^0-9A-Za-z]/g, '')}
                </div>
              </div>

              {/* Final Finish Button */}
              <button
                type="button"
                disabled={isCompleted}
                onClick={handleFinalFinish}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" /> Staged Successfully!
                  </>
                ) : (
                  <>
                    <Box className="w-6 h-6" /> Place in {stagingBay} & Complete Pack
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Bar: Quick Exception Reporter */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenIssueModal(order)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs border border-rose-300 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Stock Missing or Issue?
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel / Close
          </button>
        </div>
      </div>
    </div>
  );
};
