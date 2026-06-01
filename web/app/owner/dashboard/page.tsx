'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  API,
  Order,
  Shop,
  authHeaders,
  formatCurrency,
  statusClass,
} from '@/lib/api';

export default function Dashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingShop, setSavingShop] = useState(false);
  const [error, setError] = useState('');

  const shop = shops[0];

  async function loadData() {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login as a shop owner.');
      setLoading(false);
      return;
    }

    try {
      const shopRes = await fetch(`${API}/shops/my-shops`, {
        headers: authHeaders(),
      });
      const shopData = await shopRes.json();

      if (!shopRes.ok) {
        throw new Error(shopData.message || 'Unable to load shops');
      }

      setShops(shopData || []);

      if (shopData?.[0]?.id) {
        setShopName(shopData[0].name || '');
        setShopDescription(shopData[0].description || '');

        const orderRes = await fetch(`${API}/orders/shop/${shopData[0].id}`, {
          headers: authHeaders(),
          cache: 'no-store',
        });
        const orderData = await orderRes.json();

        if (!orderRes.ok) {
          throw new Error(orderData.message || 'Unable to load orders');
        }

        setOrders(orderData || []);
      }

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function saveShop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!shopName.trim()) {
      setError('Shop name is required.');
      return;
    }

    setSavingShop(true);
    setError('');

    try {
      const res = await fetch(shop ? `${API}/shops/my-shop` : `${API}/shops/create`, {
        method: shop ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: shopName,
          description: shopDescription,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to save shop');
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save shop');
    } finally {
      setSavingShop(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;
  const readyOrders = orders.filter((order) => order.status === 'READY').length;
  const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED').length;

  if (loading) {
    return <main className="min-h-screen p-8">Loading dashboard...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-gray-600">
              {shop ? `Managing ${shop.name}` : 'Create a shop to start selling.'}
            </p>
          </div>

          {shop && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/owner/orders?shopId=${shop.id}`}
                className="rounded bg-black px-4 py-2 text-white"
              >
                View orders
              </Link>
              <Link
                href={`/owner/products?shopId=${shop.id}`}
                className="rounded border bg-white px-4 py-2"
              >
                Products
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={saveShop} className="mb-8 rounded-lg border bg-white p-4">
          <h2 className="text-xl font-bold">
            {shop ? 'Shop Settings' : 'Create Your Shop'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {shop
              ? 'Keep your customer-facing shop details up to date.'
              : 'Create a shop, then add products and start accepting orders.'}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              placeholder="Shop name"
              className="rounded border p-2"
            />
            <input
              value={shopDescription}
              onChange={(event) => setShopDescription(event.target.value)}
              placeholder="Short description"
              className="rounded border p-2"
            />
          </div>

          <button
            disabled={savingShop}
            className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {savingShop ? 'Saving...' : shop ? 'Save shop' : 'Create shop'}
          </button>
        </form>

        {shop && (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">Orders</p>
                <h2 className="text-2xl font-bold">{orders.length}</h2>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">Revenue</p>
                <h2 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h2>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">Pending</p>
                <h2 className="text-2xl font-bold">{pendingOrders}</h2>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">Ready / Delivered</p>
                <h2 className="text-2xl font-bold">
                  {readyOrders} / {deliveredOrders}
                </h2>
              </div>
            </section>

            <section className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button onClick={loadData} className="rounded border px-3 py-1">
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 6).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">Token #{order.tokenNumber}</p>
                        <p className="text-sm text-gray-500">{order.id}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
