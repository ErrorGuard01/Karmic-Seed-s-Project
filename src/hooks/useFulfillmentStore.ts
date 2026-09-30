import { useEffect, useState } from 'react';
import { store } from '../mock/storage';
import { Courier, ExceptionTicket, InventoryItem, Order, StockTransfer } from '../types';

export function useFulfillmentStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const orders = store.getOrders();
  const inventory = store.getInventory();
  const transfers = store.getTransfers();
  const exceptions = store.getExceptions();
  const couriers = store.getCouriers();

  // Metrics
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === 'NEW');
  const readyToPick = orders.filter((o) => o.status === 'READY_TO_PICK');
  const inPicking = orders.filter((o) => o.status === 'PICKING');
  const inPacking = orders.filter((o) => o.status === 'PACKING');
  const staged = orders.filter((o) => o.status === 'STAGED');
  const dispatched = orders.filter((o) => o.status === 'DISPATCHED');
  const blocked = orders.filter((o) => o.status === 'BLOCKED');

  // Priority orders at risk (SLA deadline within 2 hours or in NEW/READY/PICKING)
  const priorityAtRisk = orders.filter(
    (o) => o.priority && o.status !== 'DISPATCHED' && o.status !== 'STAGED'
  );

  return {
    orders,
    inventory,
    transfers,
    exceptions,
    couriers,
    counts: {
      total: totalOrders,
      new: newOrders.length,
      readyToPick: readyToPick.length,
      picking: inPicking.length,
      packing: inPacking.length,
      staged: staged.length,
      dispatched: dispatched.length,
      blocked: blocked.length,
      priorityAtRisk: priorityAtRisk.length,
    },
    store,
  };
}
