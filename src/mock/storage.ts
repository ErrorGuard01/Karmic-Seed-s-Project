import { Courier, ExceptionTicket, InventoryItem, Order, OrderStatus, StockTransfer } from '../types';
import { INITIAL_COURIERS, INITIAL_EXCEPTIONS, INITIAL_INVENTORY, INITIAL_ORDERS, INITIAL_TRANSFERS } from './initialData';

const STORAGE_KEYS = {
  ORDERS: 'xyz_fulfillment_orders_v1',
  INVENTORY: 'xyz_fulfillment_inventory_v1',
  TRANSFERS: 'xyz_fulfillment_transfers_v1',
  EXCEPTIONS: 'xyz_fulfillment_exceptions_v1',
  COURIERS: 'xyz_fulfillment_couriers_v1',
};

type Listener = () => void;

class FulfillmentStore {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.resetToInitial();
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public resetToInitial() {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(INITIAL_TRANSFERS));
    localStorage.setItem(STORAGE_KEYS.EXCEPTIONS, JSON.stringify(INITIAL_EXCEPTIONS));
    localStorage.setItem(STORAGE_KEYS.COURIERS, JSON.stringify(INITIAL_COURIERS));
    this.notify();
  }

  // --- Orders ---
  public getOrders(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  }

  public getOrder(orderId: string): Order | undefined {
    return this.getOrders().find((o) => o.id === orderId);
  }

  public updateOrder(orderId: string, updates: Partial<Order>) {
    const orders = this.getOrders().map((o) => {
      if (o.id === orderId) {
        return { ...o, ...updates };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify();
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, extra?: Partial<Order>) {
    this.updateOrder(orderId, { status, ...extra });
  }

  public generateShippingLabel(orderId: string, courierId: string) {
    const courier = this.getCouriers().find((c) => c.id === courierId);
    const trackingPrefix = courier ? courier.name.slice(0, 3).toUpperCase() : 'TRK';
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `${trackingPrefix}-${randomNum}`;

    this.updateOrder(orderId, {
      courierId,
      trackingNumber,
      labelGenerated: true,
      status: 'READY_TO_PICK',
    });
  }

  public verifyOrderItem(orderId: string, itemId: string, scannedBarcode: string): { success: boolean; message: string } {
    const order = this.getOrder(orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const itemIndex = order.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return { success: false, message: 'Item not found in order.' };

    const item = order.items[itemIndex];

    // Barcode check
    if (item.barcode !== scannedBarcode.trim()) {
      return {
        success: false,
        message: `WRONG ITEM/VARIANT! Scanned "${scannedBarcode}", but expected "${item.barcode}" (${item.productName} - ${Object.values(item.variant).join(', ')}).`,
      };
    }

    const updatedItems = [...order.items];
    updatedItems[itemIndex] = {
      ...item,
      pickedQuantity: item.quantity,
      verified: true,
    };

    const allVerified = updatedItems.every((i) => i.verified);

    this.updateOrder(orderId, {
      items: updatedItems,
      status: allVerified ? 'PACKING' : 'PICKING',
    });

    return {
      success: true,
      message: `Verified: ${item.productName} (${Object.values(item.variant).join(' ')})`,
    };
  }

  public completePacking(orderId: string, stagingBay: string) {
    const now = new Date().toISOString();
    this.updateOrder(orderId, {
      status: 'STAGED',
      stagingBay,
      packedAt: now,
    });
  }

  public reportOrderIssue(orderId: string, issueType: ExceptionTicket['type'], description: string, reportedBy: string) {
    const ticketId = `EXC-${Math.floor(100 + Math.random() * 900)}`;
    const ticket: ExceptionTicket = {
      id: ticketId,
      orderId,
      type: issueType,
      status: 'OPEN',
      reportedBy,
      reportedAt: new Date().toISOString(),
      description,
    };

    const exceptions = this.getExceptions();
    localStorage.setItem(STORAGE_KEYS.EXCEPTIONS, JSON.stringify([ticket, ...exceptions]));

    this.updateOrder(orderId, {
      status: 'BLOCKED',
      exceptionReason: description,
    });
  }

  public resolveException(ticketId: string, resolution: string, newOrderStatus: OrderStatus = 'READY_TO_PICK') {
    const exceptions = this.getExceptions().map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'RESOLVED' as const,
          resolution,
          resolvedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEYS.EXCEPTIONS, JSON.stringify(exceptions));

    const ticket = exceptions.find((t) => t.id === ticketId);
    if (ticket) {
      this.updateOrder(ticket.orderId, {
        status: newOrderStatus,
        exceptionReason: undefined,
        exceptionNotes: `Resolved: ${resolution}`,
      });
    }
  }

  // --- Courier Staging & Dispatch ---
  public getCouriers(): Courier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURIERS);
    return raw ? JSON.parse(raw) : INITIAL_COURIERS;
  }

  public dispatchCourierParcels(courierId: string): number {
    const orders = this.getOrders();
    let count = 0;
    const now = new Date().toISOString();

    const updated = orders.map((o) => {
      if (o.courierId === courierId && o.status === 'STAGED') {
        count++;
        return {
          ...o,
          status: 'DISPATCHED' as OrderStatus,
          dispatchedAt: now,
        };
      }
      return o;
    });

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    this.notify();
    return count;
  }

  // --- Multi-Warehouse Inventory & Transfers ---
  public getInventory(): InventoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return raw ? JSON.parse(raw) : INITIAL_INVENTORY;
  }

  public getTransfers(): StockTransfer[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSFERS;
  }

  public requestStockTransfer(productId: string, quantity: number, notes?: string) {
    const inventory = this.getInventory();
    const item = inventory.find((i) => i.productId === productId);
    if (!item) return;

    const transferId = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTransfer: StockTransfer = {
      id: transferId,
      productId,
      productName: item.productName,
      sku: item.sku,
      quantity,
      requestedAt: new Date().toISOString(),
      status: 'REQUESTED',
      fromLocation: `Secondary Warehouse (${item.locationSecondary})`,
      toLocation: `Main Warehouse (${item.locationMain})`,
      notes: notes || 'Replenishment for main picking shelves.',
    };

    const transfers = this.getTransfers();
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify([newTransfer, ...transfers]));

    // Increment pending transfer quantity
    const updatedInventory = inventory.map((inv) => {
      if (inv.productId === productId) {
        return {
          ...inv,
          pendingTransferQuantity: inv.pendingTransferQuantity + quantity,
        };
      }
      return inv;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updatedInventory));
    this.notify();
  }

  public receiveTransfer(transferId: string) {
    const transfers = this.getTransfers();
    const transfer = transfers.find((t) => t.id === transferId);
    if (!transfer || transfer.status === 'RECEIVED') return;

    // Update transfer status
    const updatedTransfers = transfers.map((t) => {
      if (t.id === transferId) {
        return { ...t, status: 'RECEIVED' as const };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(updatedTransfers));

    // Update inventory: subtract from 2nd warehouse, add to main warehouse, decrement pending
    const inventory = this.getInventory().map((inv) => {
      if (inv.productId === transfer.productId) {
        return {
          ...inv,
          mainWarehouseStock: inv.mainWarehouseStock + transfer.quantity,
          secondWarehouseStock: Math.max(0, inv.secondWarehouseStock - transfer.quantity),
          pendingTransferQuantity: Math.max(0, inv.pendingTransferQuantity - transfer.quantity),
        };
      }
      return inv;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    this.notify();
  }

  // --- Exceptions ---
  public getExceptions(): ExceptionTicket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCEPTIONS);
    return raw ? JSON.parse(raw) : INITIAL_EXCEPTIONS;
  }

  // --- Quick Demo Scenarios ---
  public simulateUrgentRushOrder() {
    const num = Math.floor(9500 + Math.random() * 400);
    const deadline = new Date(Date.now() + 45 * 60 * 1000).toISOString(); // 45 mins left!

    const newOrder: Order = {
      id: `ORD-${num}`,
      orderNumber: `XYZ-${num}`,
      channel: 'Shopify',
      customerName: 'Morgan Miller',
      shippingAddress: {
        name: 'Morgan Miller',
        street: '400 Hennepin Ave, Suite 3',
        city: 'Minneapolis',
        state: 'MN',
        zip: '55401',
        country: 'USA',
      },
      createdAt: new Date().toISOString(),
      status: 'READY_TO_PICK',
      priority: true, // Urgent rush!
      slaDeadline: deadline,
      courierId: 'city-sameday',
      trackingNumber: `CITY-RUSH-${Math.floor(10000 + Math.random() * 90000)}`,
      labelGenerated: true,
      totalAmount: 120.0,
      items: [
        {
          id: `ITEM-RUSH-${Date.now()}`,
          productId: 'PROD-004',
          productName: 'Ergonomic Vertical Wireless Mouse',
          sku: 'MOU-VERT-RIGHT',
          barcode: '890123450004',
          variant: { style: 'Right Hand' },
          quantity: 2,
          pickedQuantity: 0,
          verified: false,
          shelfLocation: 'Aisle 1, Shelf B-05',
          imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80',
          warningNotes: 'Same-day: Handover by 13:30'
        }
      ]
    };

    const orders = this.getOrders();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([newOrder, ...orders]));
    this.notify();
  }
}

export const store = new FulfillmentStore();
