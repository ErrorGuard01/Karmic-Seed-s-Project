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
  const [reporter, setReporter] = useState('Station 1');

  const issueOptions: { type: ExceptionTicket['type']; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'MISSING_STOCK',
      label: 'Stock Missing on Shelf',
      icon: <PackageX className="w-4 h-4 text-rose-600" />,
      desc: 'Shelf quantity does not match system.',
    },
    {
      type: 'WRONG_VARIANT_ALERT',
      label: 'Variant Mismatch',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
      desc: 'Mixed or mislabeled variants in bin.',
    },
    {
      type: 'DAMAGED_ITEM',
      label: 'Damaged Item',
      icon: <AlertTriangle className="w-4 h-4 text-purple-600" />,
      desc: 'Item defective or packaging torn.',
    },
    {
      type: 'OTHER',
      label: 'Other Problem',
      icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
      desc: 'Paperwork or address issue.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = issueOptions.find((o) => o.type === selectedType)?.label;
    const finalDescription = notes.trim()
      ? `${typeLabel}: ${notes.trim()}`
      : `${typeLabel} reported for Order #${order.orderNumber}.`;

    onSubmitIssue(order.id, selectedType, finalDescription, reporter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-rose-50 px-5 py-3.5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Report Issue
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-rose-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Issue Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {issueOptions.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedType(opt.type)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="mt-0.5">{opt.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                        {opt.label}
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Details (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Reported From
              </label>
              <select
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2 bg-slate-50"
              >
                <option value="Station 1">Station 1</option>
                <option value="Station 2">Station 2</option>
                <option value="Station 3">Station 3</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Issue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
