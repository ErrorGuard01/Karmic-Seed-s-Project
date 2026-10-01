import React, { useState } from 'react';
import { Courier, Order } from '../../types';
import { PickListCard } from './PickListCard';
import { PackModal } from './PackModal';
import { IssueReportModal } from './IssueReportModal';
import {
  Package,
  Layers,
  AlertTriangle,
  Search,
  CheckCircle2,
  Box,
} from 'lucide-react';

interface WarehouseKioskProps {
  orders: Order[];
  couriers: Courier[];
  onVerifyItem: (orderId: string, itemId: string, scannedBarcode: string) => { success: boolean; message: string };
  onCompletePacking: (orderId: string, stagingBay: string) => void;
  onSubmitIssue: (orderId: string, type: any, description: string, reportedBy: string) => void;
}

export const WarehouseKiosk: React.FC<WarehouseKioskProps> = ({
  orders,
  couriers,
  onVerifyItem,
  onCompletePacking,
  onSubmitIssue,
}) => {
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'STAGING' | 'ISSUES'>('QUEUE');
  const [activeStation, setActiveStation] = useState('Station 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourierFilter, setSelectedCourierFilter] = useState('ALL');

  // Modals
  const [packingOrder, setPackingOrder] = useState<Order | null>(null);
  const [issueOrder, setIssueOrder] = useState<Order | null>(null);

  // Filter queues
  const pickPackOrders = orders
    .filter((o) => o.status === 'READY_TO_PICK' || o.status === 'PICKING')
    .sort((a, b) => {
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const stagedOrders = orders.filter((o) => o.status === 'STAGED');
  const blockedOrders = orders.filter((o) => o.status === 'BLOCKED');

  const filteredQueue = pickPackOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourier =
      selectedCourierFilter === 'ALL' || o.courierId === selectedCourierFilter;

    return matchesSearch && matchesCourier;
  });

  return (
    <div className="space-y-6">
      {/* Kiosk Mode Top Control Strip */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 font-black rounded-2xl">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                Warehouse Station
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active fulfillment queue
            </p>
          </div>
        </div>

        {/* Workstation Selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          <span className="text-xs font-bold text-slate-400 pl-3">Workstation:</span>
          {(['Station 1', 'Station 2', 'Station 3'] as const).map(
            (station) => (
              <button
                key={station}
                type="button"
                onClick={() => setActiveStation(station)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeStation === station
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {station}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('QUEUE')}
          className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border-2 ${
            activeTab === 'QUEUE'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pick Queue</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'QUEUE' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {pickPackOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STAGING')}
          className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border-2 ${
            activeTab === 'STAGING'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Staging Bays</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'STAGING' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {stagedOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ISSUES')}
          className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border-2 ${
            activeTab === 'ISSUES'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Exceptions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'ISSUES' ? 'bg-rose-800 text-rose-100' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {blockedOrders.length}
          </span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                Courier:
              </span>
              <select
                value={selectedCourierFilter}
                onChange={(e) => setSelectedCourierFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
              >
                <option value="ALL">All Couriers</option>
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredQueue.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">
                Queue Clear
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                No active orders waiting for picking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQueue.map((order) => {
                const courier = couriers.find((c) => c.id === order.courierId);
                return (
                  <PickListCard
                    key={order.id}
                    order={order}
                    courier={courier}
                    onStartPacking={(o) => setPackingOrder(o)}
                    onReportIssue={(o) => setIssueOrder(o)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Staging Bays Tab */}
      {activeTab === 'STAGING' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-sm">
                  Staging Bays
                </h3>
                <p className="text-xs text-emerald-800">
                  Parcels ready for courier pickup
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-950">{stagedOrders.length}</span>
              <span className="text-xs text-emerald-700 block font-medium">Total Staged</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {couriers.map((courier) => {
              const parcelsForCourier = stagedOrders.filter((o) => o.courierId === courier.id);
              return (
                <div
                  key={courier.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                >
                  <div className="border-b border-slate-100 pb-2.5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: courier.color }}
                        />
                        <h4 className="font-bold text-slate-900 text-sm">
                          {courier.stagingBay}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{courier.name}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold text-slate-700 text-xs rounded-md">
                      {parcelsForCourier.length}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>Pickup: <strong className="text-slate-800">{courier.pickupWindow}</strong></div>
                    <div>Cutoff: <strong className="text-slate-800">{courier.cutoffTime}</strong></div>
                  </div>

                  <div className="space-y-2">
                    {parcelsForCourier.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        Empty
                      </div>
                    ) : (
                      parcelsForCourier.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              #{p.orderNumber}
                            </span>
                            <p className="text-[11px] text-slate-500 truncate max-w-[120px]">
                              {p.customerName}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">
                            {p.stagingBay}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocked Issues Tab */}
      {activeTab === 'ISSUES' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-rose-950 text-sm">
                  Exceptions
                </h3>
                <p className="text-xs text-rose-800">
                  Orders flagged for review
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-rose-950">{blockedOrders.length}</span>
              <span className="text-xs text-rose-700 block font-medium">Blocked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blockedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      #{order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                      Blocked
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {order.customerName}
                  </span>
                </div>

                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-xs text-rose-900">
                  <div className="font-semibold flex items-center gap-1.5 text-rose-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{order.exceptionReason}</span>
                  </div>
                  {order.exceptionNotes && (
                    <p className="text-[11px] text-slate-600 font-mono mt-1">
                      {order.exceptionNotes}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                  <span>Pending resolution</span>
                  <span className="font-medium text-slate-700">{order.items.length} item(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packing Modal */}
      {packingOrder && (
        <PackModal
          order={packingOrder}
          couriers={couriers}
          onClose={() => setPackingOrder(null)}
          onVerifyItem={onVerifyItem}
          onCompletePacking={onCompletePacking}
          onOpenIssueModal={(order) => {
            setPackingOrder(null);
            setIssueOrder(order);
          }}
        />
      )}

      {/* Issue Reporter Modal */}
      {issueOrder && (
        <IssueReportModal
          order={issueOrder}
          onClose={() => setIssueOrder(null)}
          onSubmitIssue={onSubmitIssue}
        />
      )}
    </div>
  );
};
