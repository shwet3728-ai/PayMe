'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UpdateStatusButton from '@/components/UpdateStatusButton';
import {
  API,
  Order,
  OrderStatus,
  authHeaders,
  formatCurrency,
  statusClass,
} from '@/lib/api';

type CurrentToken = {
  tokenNumber: number | null;
  status: string;
};

const statuses: OrderStatus[] = ['PREPARING', 'READY', 'DELIVERED'];

export default function OwnerOrdersPage() {
  const [shopId, setShopId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [current, setCurrent] = useState<CurrentToken>({
    tokenNumber: null,
    status: 'NO_ACTIVE_ORDERS',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function resolveShopId() {
    const params = new URLSearchParams(window.location.search);
    const requestedShopId = params.get('shopId');

    if (requestedShopId) {
      return requestedShopId;
    }

    const shopRes = await fetch(`${API}/shops/my-shops`, {
      headers: authHeaders(),
    });
    const shopData = await shopRes.json();

    if (!shopRes.ok || !shopData?.[0]?.id) {
      throw new Error(shopData.message || 'No shop found for this owner');
    }

    return shopData[0].id;
  }

  async function loadOrders(nextShopId = shopId) {
    try {
      const id = nextShopId || (await resolveShopId());
      setShopId(id);

      const [ordersRes, currentRes] = await Promise.all([
        fetch(`${API}/orders/shop/${id}`, {
          headers: authHeaders(),
          cache: 'no-store',
        }),
        fetch(`${API}/orders/shop/${id}/current`, {
          headers: authHeaders(),
          cache: 'no-store',
        }),
      ]);

      const ordersData = await ordersRes.json();
      const currentData = await currentRes.json();

      if (!ordersRes.ok) {
        throw new Error(ordersData.message || 'Unable to load orders');
      }

      setOrders(ordersData || []);
      setCurrent(currentData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const timer = window.setInterval(() => loadOrders(), 10000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Incoming Orders</h1>
            <p className="text-gray-600">Move each order from preparing to ready to delivered.</p>
          </div>

          <div className="flex gap-2">
            <Link href="/owner/dashboard" className="rounded border bg-white px-4 py-2">
              Dashboard
            </Link>
            {shopId && (
              <Link
                href={`/owner/products?shopId=${shopId}`}
                className="rounded border bg-white px-4 py-2"
              >
                Products
              </Link>
            )}
          </div>
        </div>

        <section className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-900">Now serving</p>
          <h2 className="text-2xl font-bold">
            {current.tokenNumber ? `Token #${current.tokenNumber}` : 'No active orders'}
          </h2>
          <p className="text-sm text-yellow-900">Status: {current.status}</p>
        </section>

        {loading && <p className="rounded border bg-white p-4">Loading orders...</p>}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded border bg-white p-6">No orders yet.</div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Token #{order.tokenNumber}</h2>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                {order.payment && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
                    Payment {order.payment.status}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <UpdateStatusButton
                    key={status}
                    orderId={order.id}
                    status={status}
                    onUpdated={() => loadOrders(shopId)}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
