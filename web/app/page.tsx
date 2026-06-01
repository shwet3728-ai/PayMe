import Link from 'next/link';
import { API, Shop } from '@/lib/api';

type ShopWithProducts = Shop & {
  products?: {
    id: string;
  }[];
};

async function getShops(): Promise<ShopWithProducts[]> {
  try {
    const res = await fetch(`${API}/shops`, { cache: 'no-store' });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const shops = await getShops();

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-lg border bg-white p-6">
          <h1 className="text-4xl font-bold">Order ahead, skip the queue.</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Browse nearby shops, place an order, pay online, and track your token
            status from your phone.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/orders" className="rounded bg-black px-4 py-2 text-white">
              My Orders
            </Link>
            <Link href="/owner/dashboard" className="rounded border px-4 py-2">
              Shop Owner
            </Link>
          </div>
        </div>

        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Shops</h2>
            <p className="text-gray-600">Choose a shop to view products.</p>
          </div>
        </div>

        {shops.length === 0 ? (
          <div className="rounded-lg border bg-white p-6">
            <p className="font-medium">No shops available yet.</p>
            <p className="mt-1 text-gray-600">
              Start the API and database seed, or create a shop from the backend.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shop/${shop.id}`}
                className="rounded-lg border bg-white p-4 transition hover:border-black"
              >
                <h3 className="text-xl font-bold">{shop.name}</h3>
                <p className="mt-1 min-h-12 text-gray-600">
                  {shop.description || 'Fresh products and quick pickup.'}
                </p>
                <p className="mt-4 text-sm font-medium">
                  {shop.products?.length || 0} products available
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
