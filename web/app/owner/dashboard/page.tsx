'use client';

import { useEffect, useState } from 'react';

type Shop = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
};

export default function Dashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const API = 'http://localhost:3001/api'\;

  useEffect(() => {
    async function loadData() {
      try {
        const shopRes = await fetch(`${API}/shops/my-shops`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const shopData = await shopRes.json();

        const orderRes = await fetch(`${API}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orderData = await orderRes.json();

        setShops(shopData || []);
        setOrders(orderData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  const pendingOrders = orders.filter(
    (o) => o.status === 'PENDING',
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === 'DELIVERED',
  ).length;

  if (loading) {
    return (
      <div className="p-10 text-xl">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Owner Dashboard 🚀
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Shops</p>
          <h2 className="text-2xl font-bold">{shops.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold">
            {pendingOrders}
          </h2>
        </div>
      </div>

      {/* SHOPS */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-3">
          Your Shops
        </h2>

        {shops.length === 0 ? (
          <p>No shops found</p>
        ) : (
          shops.map((shop) => (
            <div
              key={shop.id}
              className="border p-2 rounded mb-2"
            >
              🏪 {shop.name}
            </div>
          ))
        )}
      </div>

      {/* ORDERS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between border-b py-2"
            >
              <span>{order.id}</span>
              <span>{order.status}</span>
              <span>₹{order.totalAmount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
