import React from 'react';
import { Package, Flame, Truck, AlertTriangle } from 'lucide-react';

interface StatsBarProps {
  counts: {
    total: number;
    new: number;
    readyToPick: number;
    picking: number;
    packing: number;
    staged: number;
    dispatched: number;
    blocked: number;
    priorityAtRisk: number;
  };
  onNavigateToTab?: (tab: 'ORDERS' | 'INVENTORY' | 'COURIERS' | 'EXCEPTIONS') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ counts, onNavigateToTab }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {/* Metric 1 */}
      <div
        onClick={() => onNavigateToTab?.('ORDERS')}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider">Queue</span>
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {counts.new + counts.readyToPick + counts.picking + counts.packing}
          </span>
          <span className="text-xs text-slate-500 font-medium">orders</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {counts.readyToPick} ready &bull; {counts.picking + counts.packing} active
        </div>
      </div>

      {/* Metric 2 */}
      <div
        onClick={() => onNavigateToTab?.('ORDERS')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
          counts.priorityAtRisk > 0
            ? 'bg-orange-50/60 border-orange-300 shadow-2xs ring-1 ring-orange-200'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
            Priority Cutoffs
          </span>
          <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
            <Flame className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-orange-950">
            {counts.priorityAtRisk}
          </span>
          <span className="text-xs text-orange-800 font-bold">urgent</span>
        </div>
        <div className="mt-1 text-xs text-orange-800 font-medium">
          Cutoff: 14:00
        </div>
      </div>

      {/* Metric 3 */}
      <div
        onClick={() => onNavigateToTab?.('COURIERS')}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider">Staged</span>
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {counts.staged}
          </span>
          <span className="text-xs text-slate-500 font-medium">packages</span>
        </div>
        <div className="mt-1 text-xs text-emerald-700 font-medium">
          {counts.dispatched} dispatched
        </div>
      </div>

      {/* Metric 4 */}
      <div
        onClick={() => onNavigateToTab?.('EXCEPTIONS')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
          counts.blocked > 0
            ? 'bg-rose-50/60 border-rose-300 shadow-2xs ring-1 ring-rose-200'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-950">
            Exceptions
          </span>
          <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-950">
            {counts.blocked}
          </span>
          <span className="text-xs text-rose-800 font-bold">blocked</span>
        </div>
        <div className="mt-1 text-xs text-rose-700 font-medium">
          {counts.blocked > 0 ? 'Action required' : 'All clear'}
        </div>
      </div>
    </div>
  );
};
