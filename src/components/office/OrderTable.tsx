import React, { useState } from 'react';
import { Courier, Order, OrderStatus, SalesChannel } from '../../types';
import { StatusBadge, PriorityBadge, ChannelBadge } from '../common/Badge';
import { CountdownTimer } from '../common/CountdownTimer';
import {
  Search,
  Filter,
  Truck,
  Printer,
  ChevronDown,
  Eye,
  AlertTriangle,
  Flame,
  LayoutGrid,
  List,
  CheckCircle2,
} from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  couriers: Courier[];
  onOpenLabelModal: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  couriers,
  onOpenLabelModal,
  onUpdateStatus,
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [onlyPriority, setOnlyPriority] = useState(false);

  // Status Filter Tabs
  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Orders', count: orders.length },
    { id: 'NEW', label: 'New / Unassigned', count: orders.filter((o) => o.status === 'NEW').length },
    { id: 'READY_TO_PICK', label: 'Ready to Pick', count: orders.filter((o) => o.status === 'READY_TO_PICK').length },
    { id: 'IN_PROGRESS', label: 'Picking & Packing', count: orders.filter((o) => o.status === 'PICKING' || o.status === 'PACKING').length },
    { id: 'STAGED', label: 'Staged for Courier', count: orders.filter((o) => o.status === 'STAGED').length },
    { id: 'DISPATCHED', label: 'Dispatched', count: orders.filter((o) => o.status === 'DISPATCHED').length },
    { id: 'BLOCKED', label: 'Exceptions / Blocked', count: orders.filter((o) => o.status === 'BLOCKED').length },
  ];

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (activeStatusFilter === 'IN_PROGRESS') {
      if (order.status !== 'PICKING' && order.status !== 'PACKING') return false;
    } else if (activeStatusFilter !== 'ALL' && order.status !== activeStatusFilter) {
      return false;
    }

    // Channel filter
    if (selectedChannel !== 'ALL' && order.channel !== selectedChannel) {
      return false;
    }

    // Priority rush filter
    if (onlyPriority && !order.priority) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchProduct = order.items.some((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
      const matchAddress = `${order.shippingAddress.city} ${order.shippingAddress.state}`.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchProduct && !matchAddress) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Control Header & Metrics Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Horizontal Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {statusTabs.map((tab) => {
            const isActive = activeStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-slate-700 text-slate-100' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Channel, Priority filter & View switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by #, customer, SKU, city..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="ALL">All Sales Channels</option>
              <option value="Shopify">Shopify</option>
              <option value="Amazon">Amazon</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Direct">Direct Store</option>
            </select>

            <button
              type="button"
              onClick={() => setOnlyPriority(!onlyPriority)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                onlyPriority
                  ? 'bg-orange-50 text-orange-800 border-orange-300'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              Rush Only
            </button>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'TABLE' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('KANBAN')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'KANBAN' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order / Channel</th>
                  <th className="py-3 px-4">Customer & City</th>
                  <th className="py-3 px-4">Items / Shelf Location</th>
                  <th className="py-3 px-4">Status & Exception</th>
                  <th className="py-3 px-4">SLA Cutoff</th>
                  <th className="py-3 px-4">Courier & Staging</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No orders match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const courier = couriers.find((c) => c.id === order.courierId);
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          order.priority ? 'bg-orange-50/20' : ''
                        }`}
                      >
                        {/* Order & Channel */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">
                              #{order.orderNumber}
                            </span>
                            <PriorityBadge priority={order.priority} size="sm" />
                          </div>
                          <div className="mt-1">
                            <ChannelBadge channel={order.channel} />
                          </div>
                        </td>

                        {/* Customer & City */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="text-slate-800 text-[11px] flex items-center justify-between gap-2">
                                <span className="truncate">
                                  <strong>{item.quantity}x</strong> {item.productName}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500 shrink-0 bg-slate-100 px-1 rounded">
                                  {item.shelfLocation}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.status} />
                          {order.status === 'BLOCKED' && order.exceptionReason && (
                            <p className="text-[10px] text-rose-700 font-bold mt-1 line-clamp-1">
                              {order.exceptionReason}
                            </p>
                          )}
                        </td>

                        {/* SLA Countdown */}
                        <td className="py-3.5 px-4">
                          <CountdownTimer deadline={order.slaDeadline} />
                        </td>

                        {/* Courier & Staging */}
                        <td className="py-3.5 px-4">
                          {courier ? (
                            <div className="space-y-0.5">
                              <span
                                className="inline-block text-[11px] font-bold text-white px-2 py-0.5 rounded"
                                style={{ backgroundColor: courier.color }}
                              >
                                {courier.name}
                              </span>
                              <div className="text-[11px] font-mono text-slate-500">
                                {order.stagingBay ? (
                                  <span className="text-emerald-700 font-bold">
                                    {order.stagingBay}
                                  </span>
                                ) : (
                                  <span>{courier.stagingBay}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenLabelModal(order)}
                              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                order.labelGenerated
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                              }`}
                              title={order.labelGenerated ? 'View / Re-print Label' : 'Assign Courier & Generate Label'}
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{order.labelGenerated ? 'Label' : 'Create Label'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {(
            [
              { status: 'NEW', title: '1. New Orders', bg: 'bg-blue-50/50', border: 'border-blue-200' },
              { status: 'READY_TO_PICK', title: '2. Ready to Pick', bg: 'bg-indigo-50/50', border: 'border-indigo-200' },
              { status: 'PICKING', title: '3. Picking & Packing', bg: 'bg-amber-50/50', border: 'border-amber-200' },
              { status: 'STAGED', title: '4. Staged for Courier', bg: 'bg-emerald-50/50', border: 'border-emerald-200' },
              { status: 'DISPATCHED', title: '5. Dispatched', bg: 'bg-slate-50', border: 'border-slate-200' },
            ] as const
          ).map((col) => {
            const columnOrders = orders.filter((o) =>
              col.status === 'PICKING' ? o.status === 'PICKING' || o.status === 'PACKING' : o.status === col.status
            );

            return (
              <div
                key={col.status}
                className={`rounded-2xl border ${col.border} ${col.bg} p-3 flex flex-col min-h-[500px]`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <h4 className="font-bold text-xs text-slate-800">{col.title}</h4>
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          #{ord.orderNumber}
                        </span>
                        <PriorityBadge priority={ord.priority} size="sm" />
                      </div>

                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {ord.customerName}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        {ord.items.length} item(s) &bull; ${ord.totalAmount.toFixed(2)}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <CountdownTimer deadline={ord.slaDeadline} />
                        <button
                          type="button"
                          onClick={() => onOpenLabelModal(ord)}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold"
                        >
                          View Label
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
