import React from 'react';
import { UserRole } from '../../types';
import { Building2, Package, RotateCcw, Flame } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSimulateUrgentOrder: () => void;
  onResetData: () => void;
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onSimulateUrgentOrder,
  onResetData,
  counts,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">System Simulator</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-400">Live operational data feed</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateUrgentOrder}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-md font-semibold text-xs transition-colors"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            Add Priority Order
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                XYZ Fulfillment Hub
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Operations & Fulfillment Management
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onRoleChange('OFFICE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentRole === 'OFFICE'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Office Operations</span>
            {counts.priorityAtRisk > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold">
                {counts.priorityAtRisk}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('WAREHOUSE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentRole === 'WAREHOUSE'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Warehouse Station</span>
            {counts.readyToPick > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-bold">
                {counts.readyToPick}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
