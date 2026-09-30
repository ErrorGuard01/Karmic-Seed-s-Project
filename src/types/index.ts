export type OrderStatus =
  | 'NEW'
  | 'READY_TO_PICK'
  | 'PICKING'
  | 'PACKING'
  | 'STAGED'
  | 'DISPATCHED'
  | 'BLOCKED';

export type SalesChannel = 'Shopify' | 'Amazon' | 'Wholesale' | 'Direct';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  variant: {
    size?: string;
    color?: string;
    style?: string;
  };
  quantity: number;
  pickedQuantity: number;
  verified: boolean;
  shelfLocation: string;
  imageUrl: string;
  warningNotes?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  channel: SalesChannel;
  customerName: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  status: OrderStatus;
  priority: boolean; // Same-day SLA rush order
  slaDeadline: string; // ISO string e.g. today 14:00
  items: OrderItem[];
  courierId: string;
  trackingNumber?: string;
  labelGenerated: boolean;
  stagingBay?: string; // e.g. "Bay A-1 (DHL)"
  pickerId?: string;
  packedAt?: string;
  dispatchedAt?: string;
  exceptionReason?: string;
  exceptionNotes?: string;
  totalAmount: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  category: string;
  mainWarehouseStock: number;
  secondWarehouseStock: number;
  reorderLevel: number;
  locationMain: string;
  locationSecondary: string;
  imageUrl: string;
  pendingTransferQuantity: number;
  variantsList?: string[];
}

export interface StockTransfer {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  requestedAt: string;
  status: 'REQUESTED' | 'IN_TRANSIT' | 'RECEIVED';
  fromLocation: string;
  toLocation: string;
  notes?: string;
}

export interface Courier {
  id: string;
  name: string;
  service: string;
  cost: number;
  speed: string;
  cutoffTime: string; // e.g. "14:00"
  pickupWindow: string; // e.g. "14:00 - 14:30"
  stagingBay: string;
  color: string;
}

export interface ExceptionTicket {
  id: string;
  orderId: string;
  type: 'MISSING_STOCK' | 'DAMAGED_ITEM' | 'ADDRESS_ISSUE' | 'WRONG_VARIANT_ALERT' | 'OTHER';
  status: 'OPEN' | 'RESOLVING' | 'RESOLVED';
  reportedBy: string;
  reportedAt: string;
  description: string;
  resolution?: string;
  resolvedAt?: string;
}

export type UserRole = 'OFFICE' | 'WAREHOUSE';
