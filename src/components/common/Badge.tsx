import React from 'react';
import { OrderStatus, SalesChannel } from '../../types';
import { Flame, AlertCircle, CheckCircle2, Clock, Package, Truck, Box } from 'lucide-react';

export const StatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' | 'lg' }> = ({
  status,
  size = 'md',
}) => {
  const configs: Record<
    OrderStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    NEW: {
      label: 'New (Unassigned)',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    READY_TO_PICK: {
      label: 'Ready to Pick',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Package className="w-3.5 h-3.5" />,
    },
    PICKING: {
      label: 'In Picking',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Box className="w-3.5 h-3.5 animate-bounce" />,
    },
    PACKING: {
      label: 'Packing / Scan',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: <Box className="w-3.5 h-3.5" />,
    },
    STAGED: {
      label: 'Staged in Bay',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    DISPATCHED: {
      label: 'Dispatched',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    BLOCKED: {
      label: 'Exception Blocked',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || configs.NEW;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: boolean; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  if (!priority) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-orange-600 text-white font-bold tracking-tight shadow-sm shadow-orange-300 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <Flame className="w-3.5 h-3.5 fill-current" />
      SAME-DAY RUSH
    </span>
  );
};

export const ChannelBadge: React.FC<{ channel: SalesChannel }> = ({ channel }) => {
  const styles: Record<SalesChannel, string> = {
    Shopify: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Amazon: 'bg-amber-50 text-amber-800 border-amber-200',
    Wholesale: 'bg-purple-50 text-purple-700 border-purple-200',
    Direct: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
        styles[channel] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {channel}
    </span>
  );
};
