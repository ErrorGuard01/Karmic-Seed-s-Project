import React from 'react';
import { UserRole } from '../../types';
import {
  Building2,
  Package,
  RotateCcw,
  Zap,
  Flame,
  Truck,
  AlertTriangle,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

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
      {/* Top Demo Simulation Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Hiring Demo Scenarios:</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Test real operational edge cases with 1 click:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateUrgentOrder}
            className="flex items-center gap-1.5 px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors"
            title="Adds a rush order with upcoming cutoff to test SLA tracking"
          >
            <Flame className="w-3 h-3 fill-current" />
            + Rush Same-Day Order
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] transition-colors"
            title="Reset data to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Persona Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-150">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-lg tracking-tight">
                XYZ FULFILLMENT HUB
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                250+ Orders/Day
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Operations command center & rugged warehouse touchscreen terminal
            </p>
          </div>
        </div>

        {/* Persona Switcher (CRITICAL REQUIREMENT) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => onRoleChange('OFFICE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentRole === 'OFFICE'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Office Operations</span>
            {counts.priorityAtRisk > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold">
                {counts.priorityAtRisk} rush
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('WAREHOUSE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentRole === 'WAREHOUSE'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Warehouse Handheld Kiosk</span>
            {counts.readyToPick > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-bold">
                {counts.readyToPick} ready
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
