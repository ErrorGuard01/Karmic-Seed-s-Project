import React, { useState } from 'react';
import { ExceptionTicket, Order } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PackageX,
  Layers,
  ArrowRight,
  ShieldAlert,
  Send,
} from 'lucide-react';

interface ExceptionTabProps {
  exceptions: ExceptionTicket[];
  orders: Order[];
  onResolveException: (ticketId: string, resolution: string) => void;
  onNavigateToTransfers: () => void;
}

export const ExceptionTab: React.FC<ExceptionTabProps> = ({
  exceptions,
  orders,
  onResolveException,
  onNavigateToTransfers,
}) => {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const openTickets = exceptions.filter((e) => e.status === 'OPEN');
  const resolvedTickets = exceptions.filter((e) => e.status === 'RESOLVED');

  const handleResolve = (ticketId: string) => {
    if (!resolutionNote.trim()) return;
    onResolveException(ticketId, resolutionNote.trim());
    setActiveTicketId(null);
    setResolutionNote('');
  };

  const getBadgeForType = (type: ExceptionTicket['type']) => {
    switch (type) {
      case 'MISSING_STOCK':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <PackageX className="w-3 h-3" /> MISSING STOCK ON SHELF
          </span>
        );
      case 'WRONG_VARIANT_ALERT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Layers className="w-3 h-3" /> WRONG VARIANT IN BIN
          </span>
        );
      case 'DAMAGED_ITEM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> DAMAGED GOODS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-rose-950 text-lg">
              Exception & Missing Stock Resolution Desk
            </h3>
            <p className="text-xs text-rose-800 max-w-xl">
              Eliminates forgotten problems. Every warehouse-reported issue is tracked here until resolved by the office team.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-rose-200 text-center">
            <span className="text-xl font-black text-rose-700">{openTickets.length}</span>
            <span className="text-[10px] text-rose-900 block font-bold">Unresolved</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-center">
            <span className="text-xl font-black text-emerald-700">{resolvedTickets.length}</span>
            <span className="text-[10px] text-slate-600 block font-bold">Resolved Today</span>
          </div>
        </div>
      </div>

      {/* Open Issues Section */}
      <div className="space-y-4">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Active Unresolved Tickets ({openTickets.length})</span>
        </h4>

        {openTickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">All exceptions have been cleared!</p>
            <p className="text-xs text-slate-400 mt-0.5">
              No orders are currently blocked due to missing inventory or variant confusion.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openTickets.map((ticket) => {
              const order = orders.find((o) => o.id === ticket.orderId);
              const isResolving = activeTicketId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-900">
                        #{ticket.id}
                      </span>
                      {getBadgeForType(ticket.type)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(ticket.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 text-xs text-rose-950 font-medium">
                    {ticket.description}
                  </div>

                  {order && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>Order: <strong className="text-slate-900">#{order.orderNumber}</strong> ({order.customerName})</span>
                      <span className="font-mono text-[11px] text-slate-500">{order.items.length} item(s)</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500">
                    Reported by: <span className="font-semibold text-slate-700">{ticket.reportedBy}</span>
                  </div>

                  {/* Resolution Input / Actions */}
                  {isResolving ? (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Office Resolution Action & Notes
                      </label>
                      <input
                        type="text"
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="e.g., Stock transfer arrived / swapped variant / restocked."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTicketId(null)}
                          className="px-3 py-1.5 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolve(ticket.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Return to Pick Queue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {ticket.type === 'MISSING_STOCK' && (
                        <button
                          type="button"
                          onClick={onNavigateToTransfers}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <span>Check Warehouse 2 Stock</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTicketId(ticket.id);
                          setResolutionNote(
                            ticket.type === 'MISSING_STOCK'
                              ? 'Secondary warehouse stock transfer received. Stock restored on shelf.'
                              : 'Bin corrected with proper SKU variant.'
                          );
                        }}
                        className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Resolve Exception
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved History */}
      {resolvedTickets.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Resolved Issues History Today ({resolvedTickets.length})
          </h4>
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            {resolvedTickets.map((t) => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-900">#{t.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      RESOLVED
                    </span>
                  </div>
                  <p className="text-slate-700">{t.description}</p>
                  {t.resolution && (
                    <p className="text-emerald-800 font-medium mt-1">
                      Action taken: {t.resolution}
                    </p>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400 shrink-0">
                  {t.resolvedAt ? new Date(t.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
