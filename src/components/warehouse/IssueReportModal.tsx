import React, { useState } from 'react';
import { ExceptionTicket, Order } from '../../types';
import { AlertTriangle, X, Send, PackageX, HelpCircle, Layers, Check } from 'lucide-react';

interface IssueReportModalProps {
  order: Order;
  onClose: () => void;
  onSubmitIssue: (
    orderId: string,
    type: ExceptionTicket['type'],
    description: string,
    reportedBy: string
  ) => void;
}

export const IssueReportModal: React.FC<IssueReportModalProps> = ({
  order,
  onClose,
  onSubmitIssue,
}) => {
  const [selectedType, setSelectedType] = useState<ExceptionTicket['type']>('MISSING_STOCK');
  const [notes, setNotes] = useState('');
  const [reporter, setReporter] = useState('Dave (Warehouse Picker)');

  const issueOptions: { type: ExceptionTicket['type']; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'MISSING_STOCK',
      label: 'Stock Missing on Shelf',
      icon: <PackageX className="w-5 h-5 text-rose-600" />,
      desc: 'Item is listed in spreadsheet/system but shelf location is empty or short.',
    },
    {
      type: 'WRONG_VARIANT_ALERT',
      label: 'Wrong Variant in Bin',
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      desc: 'Bin contains mixed variants (e.g. wrong size/color) or wrong barcodes.',
    },
    {
      type: 'DAMAGED_ITEM',
      label: 'Item Damaged / Defective',
      icon: <AlertTriangle className="w-5 h-5 text-purple-600" />,
      desc: 'Packaging torn, scratched, or item broken; cannot ship to customer.',
    },
    {
      type: 'OTHER',
      label: 'Other Warehouse Issue',
      icon: <HelpCircle className="w-5 h-5 text-blue-600" />,
      desc: 'Missing paperwork, packaging size mismatch, or address problem.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = issueOptions.find((o) => o.type === selectedType)?.label;
    const finalDescription = notes.trim()
      ? `${typeLabel}: ${notes.trim()}`
      : `${typeLabel} reported during pick/pack for Order #${order.orderNumber}.`;

    onSubmitIssue(order.id, selectedType, finalDescription, reporter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-rose-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Report Warehouse Problem
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Order #{order.orderNumber} &bull; Flags issue to Office immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-rose-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select What Happened (Large Touch Buttons)
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {issueOptions.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedType(opt.type)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="mt-0.5">{opt.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        {opt.label}
                        {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Details for Office Team (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Looked at Shelf A-02, found 0 units. Also checked top rack."
              rows={3}
              className="w-full text-sm rounded-xl border-2 border-slate-200 p-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reported By
              </label>
              <select
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-200 p-2 bg-slate-50"
              >
                <option value="Dave (Warehouse Picker)">Dave (Picker)</option>
                <option value="Elena (Warehouse Packer)">Elena (Packer)</option>
                <option value="Sam (Warehouse Associate)">Sam (Associate)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" /> Block & Alert Office
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
