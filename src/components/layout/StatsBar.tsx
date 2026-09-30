import React from 'react';
import { Package, Flame, Box, AlertTriangle, Truck, CheckCircle2 } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {/* Metric 1: Processing Queue */}
      <div
        onClick={() => onNavigateToTab?.('ORDERS')}
        className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">In Fulfillment Queue</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {counts.new + counts.readyToPick + counts.picking + counts.packing}
          </span>
          <span className="text-xs text-slate-500 font-medium">orders</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex gap-2">
          <span>{counts.readyToPick} ready</span> &bull; <span>{counts.picking + counts.packing} picking</span>
        </div>
      </div>

      {/* Metric 2: Rush Priority SLA at Risk */}
      <div
        onClick={() => onNavigateToTab?.('ORDERS')}
        className={`p-4 rounded-3xl border transition-all cursor-pointer ${
          counts.priorityAtRisk > 0
            ? 'bg-gradient-to-br from-orange-50 to-amber-50/40 border-orange-300 shadow-2xs ring-1 ring-orange-200'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-900">
            Same-Day Cutoffs
          </span>
          <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
            <Flame className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-orange-950">
            {counts.priorityAtRisk}
          </span>
          <span className="text-xs text-orange-800 font-bold">
            urgent orders
          </span>
        </div>
        <div className="mt-2 text-[11px] text-orange-800 font-semibold flex items-center gap-1">
          <span>Target cutoff: 14:00 today</span>
        </div>
      </div>

      {/* Metric 3: Staged Parcels Waiting */}
      <div
        onClick={() => onNavigateToTab?.('COURIERS')}
        className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Staged for Pickup</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {counts.staged}
          </span>
          <span className="text-xs text-slate-500 font-medium">packages</span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-700 font-medium flex gap-2">
          <span>{counts.dispatched} dispatched today</span>
        </div>
      </div>

      {/* Metric 4: Active Exceptions */}
      <div
        onClick={() => onNavigateToTab?.('EXCEPTIONS')}
        className={`p-4 rounded-3xl border transition-all cursor-pointer ${
          counts.blocked > 0
            ? 'bg-rose-50/60 border-rose-300 shadow-2xs ring-1 ring-rose-200'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
            Exceptions Blocked
          </span>
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-950">
            {counts.blocked}
          </span>
          <span className="text-xs text-rose-800 font-bold">issues</span>
        </div>
        <div className="mt-2 text-[11px] text-rose-700 font-medium">
          {counts.blocked > 0 ? 'Requires stock transfer or fix' : 'Zero blocked orders'}
        </div>
      </div>
    </div>
  );
};
