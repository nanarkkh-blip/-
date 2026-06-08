/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
}
