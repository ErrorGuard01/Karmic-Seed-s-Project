import React from 'react';
import { Courier, Order } from '../../types';
import { Flame, Clock, MapPin, Box, ChevronRight, AlertTriangle } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

interface PickListCardProps {
  order: Order;
  courier?: Courier;
  onStartPacking: (order: Order) => void;
  onReportIssue: (order: Order) => void;
}

export const PickListCard: React.FC<PickListCardProps> = ({
  order,
  courier,
  onStartPacking,
  onReportIssue,
}) => {
  const totalItemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);
  const firstLocation = order.items[0]?.shelfLocation || 'Main Floor';

  return (
    <div
      className={`rounded-3xl border-3 p-5 transition-all shadow-sm ${
        order.priority
          ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white border-orange-400 ring-2 ring-orange-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-black text-slate-900">
            #{order.orderNumber}
          </span>
          {order.priority && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white text-xs font-black shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-current" /> RUSH
            </span>
          )}
        </div>

        {order.priority && (
          <div className="flex items-center gap-1">
            <CountdownTimer deadline={order.slaDeadline} />
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mb-4 space-y-1.5">
        <div className="text-sm font-semibold text-slate-700">
          Customer: <span className="font-bold text-slate-900">{order.customerName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold">
            <Box className="w-3.5 h-3.5 text-indigo-600" /> {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold">
            <MapPin className="w-3.5 h-3.5 text-amber-600" /> Start: {firstLocation}
          </span>
          {courier && (
            <span
              className="px-2.5 py-1 rounded-lg text-white font-bold text-xs"
              style={{ backgroundColor: courier.color }}
            >
              {courier.name}
            </span>
          )}
        </div>
      </div>

      {/* Item Snippets Preview */}
      <div className="bg-slate-50 rounded-2xl p-3 mb-4 space-y-2 border border-slate-200">
        {order.items.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-xs">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">
                {item.quantity}x {item.productName}
              </p>
              <p className="text-[11px] font-bold text-amber-900 font-mono">
                {Object.values(item.variant).join(' / ')}
              </p>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-[11px] font-semibold text-slate-500 pl-1">
            + {order.items.length - 2} more item(s)
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onStartPacking(order)}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
            order.priority
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span>PICK & PACK</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onReportIssue(order)}
          className="p-3 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-2xl border border-slate-200 transition-colors"
          title="Report Missing Stock or Damaged Item"
        >
          <AlertTriangle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
