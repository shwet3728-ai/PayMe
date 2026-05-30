'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    async function loadShops() {
      try {
        const res = await fetch('http://localhost:3001/api/shops/my-shops', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();

        console.log("API RESPONSE:", data);

        // 🔥 FIX: handle both array + object safely
        if (Array.isArray(data)) {
          setShops(data);
        } else if (Array.isArray(data.shops)) {
          setShops(data.shops);
        } else if (data) {
          setShops([data]); // fallback single object
        } else {
          setShops([]);
        }
      } catch (err) {
        console.error(err);
        setShops([]);
      }
    }

    loadShops();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Shops</h1>

      <div className="grid gap-4">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/shop/${shop.id}`}
            className="p-4 border rounded"
          >
            <h2 className="text-xl font-semibold">{shop.name}</h2>
            <p className="text-gray-500">{shop.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
