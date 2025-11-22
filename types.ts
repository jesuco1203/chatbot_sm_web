
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'pizza' | 'lasagna' | 'extra' | 'drink';
  prices: {
    [key: string]: number;
  };
}

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

export interface Customer {
  phone: string;
  name: string;
  address: string;
  isNew: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isToolOutput?: boolean;
  actions?: string[]; // List of suggested quick reply actions
}

export interface OrderSession {
  cart: CartItem[];
  customer: Customer | null;
  status: 'browsing' | 'ordering' | 'identifying' | 'confirmed';
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivery' | 'delivered' | 'cancelled';

export interface Order {
  id?: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  eta?: string; // Estimated Time of Arrival (e.g., "25-30 min")
  metadata?: {
    userAgent?: string;
    referrer?: string;
  };
}
