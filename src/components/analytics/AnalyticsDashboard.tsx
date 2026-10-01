import React from 'react';
import { Courier, Order, InventoryItem, ExceptionTicket } from '../../types';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Users,
  DollarSign,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  orders: Order[];
  couriers: Courier[];
  inventory: InventoryItem[];
  exceptions: ExceptionTicket[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  orders,
  couriers,
  inventory,
  exceptions,
}) => {
  const totalOrders = orders.length;
  const dispatchedOrders = orders.filter((o) => o.status === 'DISPATCHED').length;
  const stagedOrders = orders.filter((o) => o.status === 'STAGED').length;
  const priorityOrders = orders.filter((o) => o.priority);
  const priorityDispatched = priorityOrders.filter(
    (o) => o.status === 'DISPATCHED' || o.status === 'STAGED'
  ).length;
  const slaAdherenceRate =
    priorityOrders.length > 0
      ? Math.round((priorityDispatched / priorityOrders.length) * 100)
      : 100;

  // Labor Model: 3 workers, 7.5 hr shift = 22.5 hours
  const laborCapacityHours = 22.5;
  const estimatedHoursUsed = Math.min(laborCapacityHours, totalOrders * 0.08).toFixed(1);
  const capacityUtilization = Math.min(
    100,
    Math.round(((totalOrders * 0.08) / laborCapacityHours) * 100)
  );

  const missingStockCount = exceptions.filter((e) => e.type === 'MISSING_STOCK').length;
  const variantAlertCount = exceptions.filter((e) => e.type === 'WRONG_VARIANT_ALERT').length;
  const damagedCount = exceptions.filter((e) => e.type === 'DAMAGED_ITEM').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-xs font-bold border border-indigo-400/30">
              OPERATIONS
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Fulfillment Analytics</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-center min-w-[100px]">
            <span className="text-xs text-slate-400 uppercase font-mono block">OTIF Rate</span>
            <span className="text-2xl font-black text-emerald-400">97.8%</span>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-center min-w-[100px]">
            <span className="text-xs text-slate-400 uppercase font-mono block">Utilization</span>
            <span className="text-2xl font-black text-amber-400">{capacityUtilization}%</span>
          </div>
        </div>
      </div>

      {/* Primary Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cycle Time */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Cycle Time</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">74 mins</div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> -42% vs baseline
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pick Accuracy</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">99.4%</div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 0 scan mismatches
          </p>
        </div>

        {/* Priority Hit Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Priority SLA</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{slaAdherenceRate}%</div>
          <p className="text-xs text-orange-600 font-semibold">
            {priorityOrders.length} priority orders
          </p>
        </div>

        {/* Freight Cost */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Freight Cost</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">$10.25</div>
          <p className="text-xs text-blue-600 font-semibold">
            4 active carriers
          </p>
        </div>
      </div>

      {/* Cycle Time Funnel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Cycle Time Funnel</h3>
            <p className="text-xs text-slate-500">Stage averages and benchmarks</p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
            Target: &lt; 90 min
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              stage: '1. Order Entry',
              avgTime: '14 mins',
              benchmark: '< 20 min',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              stage: '2. Queue Waiting',
              avgTime: '22 mins',
              benchmark: '< 30 min',
              status: 'Normal',
              statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
            },
            {
              stage: '3. Shelf Picking',
              avgTime: '16 mins',
              benchmark: '< 18 min',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              stage: '4. Packing & Scan',
              avgTime: '8 mins',
              benchmark: '< 10 min',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              stage: '5. Staged Dwell',
              avgTime: '14 mins',
              benchmark: '< 30 min',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">
                  Stage {idx + 1}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{item.stage}</h4>
              <div className="pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-900">{item.avgTime}</span>
                <span className="text-[10px] font-mono text-slate-400">{item.benchmark}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Labor & Courier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Capacity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">Labor Utilization</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">3 Floor Staff</span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Daily Shift Utilization</span>
                <span className="font-mono text-indigo-700">
                  {capacityUtilization}% ({estimatedHoursUsed}h / {laborCapacityHours}h)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityUtilization > 90
                      ? 'bg-rose-500'
                      : capacityUtilization > 75
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${capacityUtilization}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Floor Staff</span>
                <strong className="text-slate-900">3</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Picks/Hr Target</span>
                <strong className="text-slate-900">18 units</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Peak Window</span>
                <strong className="text-slate-900">11:00 - 14:00</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">Carrier Distribution</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{couriers.length} Carriers</span>
          </div>

          <div className="space-y-2.5">
            {couriers.map((c) => {
              const count = orders.filter((o) => o.courierId === c.id).length;
              const share = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
              return (
                <div
                  key={c.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-500">
                        Cutoff: {c.cutoffTime} &bull; {c.stagingBay}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-mono font-bold text-slate-800">${c.cost.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">rate</span>
                    </div>
                    <div className="min-w-[50px]">
                      <span className="font-black text-indigo-700">{share}%</span>
                      <span className="text-[10px] text-slate-400 block">volume</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exception Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Exception Summary</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">{exceptions.length} Total Tickets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium block">Missing Shelf Stock</span>
              <span className="text-lg font-black text-slate-900">{missingStockCount}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              Warehouse 2 Transfer
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium block">Variant Mismatch</span>
              <span className="text-lg font-black text-slate-900">{variantAlertCount}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
              Bin Verification
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium block">Damaged Goods</span>
              <span className="text-lg font-black text-slate-900">{damagedCount}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
              Vendor RMA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
