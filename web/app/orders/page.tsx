'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  API,
  Order,
  authHeaders,
  formatCurrency,
  statusClass,
} from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadOrders() {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login to view your orders.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/orders/my-orders`, {
        headers: authHeaders(),
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to load orders');
      }

      setOrders(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const timer = window.setInterval(loadOrders, 10000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-600">Updates refresh automatically.</p>
          </div>

          <Link href="/" className="rounded border bg-white px-4 py-2">
            Back home
          </Link>
        </div>

        {loading && <p className="rounded border bg-white p-4">Loading orders...</p>}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
            <Link href="/login" className="ml-2 underline">
              Login
            </Link>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded border bg-white p-6">
            <p className="font-medium">No orders yet.</p>
            <p className="mt-1 text-gray-600">Open a shop and place your first order.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Token #{order.tokenNumber}</h2>
                  <p className="mt-1 text-sm text-gray-500">Order ID: {order.id}</p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</p>
                {order.payment && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
                    Payment {order.payment.status}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
