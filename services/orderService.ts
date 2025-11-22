
import { CartItem, Customer, Order } from "../types";

// Configuration for the future backend
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// --- MOCK DATABASE PERSISTENCE HELPER ---
const getMockDB = (): Order[] => {
    const stored = localStorage.getItem('sm_mock_orders_db');
    return stored ? JSON.parse(stored) : [];
};

const saveMockDB = (orders: Order[]) => {
    localStorage.setItem('sm_mock_orders_db', JSON.stringify(orders));
};

/**
 * Creates a new order.
 */
export const createOrder = async (
  cart: CartItem[], 
  customer: Customer
): Promise<{ success: boolean; orderId?: string; message?: string, eta?: string }> => {
  
  // Generate mock ID
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();
  
  const newOrder: Order = {
    id: orderId,
    customer,
    items: cart,
    total: cart.reduce((acc, item) => acc + item.subtotal, 0),
    status: 'confirmed',
    createdAt: now,
    updatedAt: now,
    eta: '35-45 min',
    metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
    }
  };

  console.log("🚀 [OrderService] POST /api/orders:", newOrder);

  // Simulate Network Delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const db = getMockDB();
      db.unshift(newOrder); // Add to beginning
      saveMockDB(db);
      
      resolve({
        success: true,
        orderId: orderId,
        eta: newOrder.eta,
        message: "Pedido registrado correctamente en base de datos."
      });
    }, 1500);
  });
};
