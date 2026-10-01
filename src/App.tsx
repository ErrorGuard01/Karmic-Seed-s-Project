import React, { useState } from 'react';
import { useFulfillmentStore } from './hooks/useFulfillmentStore';
import { Courier, Order, OrderStatus, UserRole } from './types';
import { Navbar } from './components/layout/Navbar';
import { StatsBar } from './components/layout/StatsBar';
import { OrderTable } from './components/office/OrderTable';
import { InventoryTab } from './components/office/InventoryTab';
import { CourierTab } from './components/office/CourierTab';
import { ExceptionTab } from './components/office/ExceptionTab';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { WarehouseKiosk } from './components/warehouse/WarehouseKiosk';
import { ShippingLabelModal } from './components/common/ShippingLabelModal';
import {
  Building2,
  Package,
  Layers,
  Truck,
  AlertTriangle,
  Boxes,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

export function App() {
  const { orders, inventory, transfers, exceptions, couriers, counts, store } =
    useFulfillmentStore();

  const [currentRole, setCurrentRole] = useState<UserRole>('OFFICE');
  const [officeSubTab, setOfficeSubTab] = useState<'ORDERS' | 'INVENTORY' | 'COURIERS' | 'EXCEPTIONS' | 'ANALYTICS'>('ORDERS');
  const [labelModalOrder, setLabelModalOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Warehouse handlers
  const handleVerifyItem = (orderId: string, itemId: string, scannedBarcode: string) => {
    const result = store.verifyOrderItem(orderId, itemId, scannedBarcode);
    if (!result.success) {
      showToast(`Scan Warning: ${result.message}`);
    }
    return result;
  };

  const handleCompletePacking = (orderId: string, stagingBay: string) => {
    store.completePacking(orderId, stagingBay);
    showToast(`Order packed and staged in ${stagingBay}`);
  };

  const handleSubmitIssue = (orderId: string, type: any, description: string, reportedBy: string) => {
    store.reportOrderIssue(orderId, type, description, reportedBy);
    showToast(`Issue logged`);
  };

  // Office handlers
  const handleGenerateLabel = (orderId: string, courierId: string) => {
    store.generateShippingLabel(orderId, courierId);
    setLabelModalOrder(null);
    showToast(`Shipping label generated`);
  };

  const handleReceiveTransfer = (transferId: string) => {
    store.receiveTransfer(transferId);
    showToast(`Stock transfer received`);
  };

  const handleRequestTransfer = (productId: string, quantity: number, notes?: string) => {
    store.requestStockTransfer(productId, quantity, notes);
    showToast(`Transfer requested`);
  };

  const handleDispatchCourier = (courierId: string) => {
    const count = store.dispatchCourierParcels(courierId);
    showToast(`Dispatched ${count} parcels`);
  };

  const handleResolveException = (ticketId: string, resolution: string) => {
    store.resolveException(ticketId, resolution);
    showToast(`Exception resolved`);
  };

  const handleSimulateUrgentOrder = () => {
    store.simulateUrgentRushOrder();
    showToast(`Priority order added`);
  };

  const handleResetData = () => {
    store.resetToInitial();
    showToast(`Data reset`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onSimulateUrgentOrder={handleSimulateUrgentOrder}
        onResetData={handleResetData}
        counts={counts}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {currentRole === 'OFFICE' ? (
          <div>
            {/* KPI Stats Bar */}
            <StatsBar
              counts={counts}
              onNavigateToTab={(tab) => setOfficeSubTab(tab)}
            />

            {/* Office Sub-Navigation Bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setOfficeSubTab('ORDERS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  officeSubTab === 'ORDERS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Orders</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  {counts.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOfficeSubTab('INVENTORY')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  officeSubTab === 'INVENTORY'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Inventory</span>
                {transfers.filter((t) => t.status !== 'RECEIVED').length > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                    {transfers.filter((t) => t.status !== 'RECEIVED').length} in transit
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOfficeSubTab('COURIERS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  officeSubTab === 'COURIERS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Staging & Dispatch</span>
                {counts.staged > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                    {counts.staged} staged
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOfficeSubTab('EXCEPTIONS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  officeSubTab === 'EXCEPTIONS'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Exceptions</span>
                {counts.blocked > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {counts.blocked} blocked
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOfficeSubTab('ANALYTICS')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  officeSubTab === 'ANALYTICS'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Office View Content */}
            {officeSubTab === 'ORDERS' && (
              <OrderTable
                orders={orders}
                couriers={couriers}
                onOpenLabelModal={(order) => setLabelModalOrder(order)}
                onUpdateStatus={(id, st) => store.updateOrderStatus(id, st)}
              />
            )}

            {officeSubTab === 'INVENTORY' && (
              <InventoryTab
                inventory={inventory}
                transfers={transfers}
                onRequestTransfer={handleRequestTransfer}
                onReceiveTransfer={handleReceiveTransfer}
              />
            )}

            {officeSubTab === 'COURIERS' && (
              <CourierTab
                couriers={couriers}
                orders={orders}
                onDispatchCourier={handleDispatchCourier}
              />
            )}

            {officeSubTab === 'EXCEPTIONS' && (
              <ExceptionTab
                exceptions={exceptions}
                orders={orders}
                onResolveException={handleResolveException}
                onNavigateToTransfers={() => setOfficeSubTab('INVENTORY')}
              />
            )}

            {officeSubTab === 'ANALYTICS' && (
              <AnalyticsDashboard
                orders={orders}
                couriers={couriers}
                inventory={inventory}
                exceptions={exceptions}
              />
            )}
          </div>
        ) : (
          /* WAREHOUSE KIOSK MODE (Designed for non-tech-savvy workers) */
          <WarehouseKiosk
            orders={orders}
            couriers={couriers}
            onVerifyItem={handleVerifyItem}
            onCompletePacking={handleCompletePacking}
            onSubmitIssue={handleSubmitIssue}
          />
        )}
      </main>

      {/* Shipping Label Modal */}
      {labelModalOrder && (
        <ShippingLabelModal
          order={labelModalOrder}
          couriers={couriers}
          onClose={() => setLabelModalOrder(null)}
          onGenerateLabel={handleGenerateLabel}
        />
      )}
    </div>
  );
}

export default App;
