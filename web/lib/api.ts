export const API =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isAvailable?: boolean;
};

export type Shop = {
  id: string;
  name: string;
  description?: string | null;
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Order = {
  id: string;
  tokenNumber: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt?: string;
  items?: OrderItem[];
  payment?: {
    id: string;
    status: string;
  } | null;
};

export function authHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function statusClass(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'PREPARING':
      return 'bg-yellow-100 text-yellow-900 border-yellow-200';
    case 'READY':
      return 'bg-blue-100 text-blue-900 border-blue-200';
    case 'DELIVERED':
      return 'bg-green-100 text-green-900 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
