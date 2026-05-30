import Link from 'next/link';

type Shop = {
  id: string;
  name: string;
  description?: string;
};

async function getShops(): Promise<Shop[]> {
  const res = await fetch(
    'http://localhost:3001/api/shops',
    {
      cache: 'no-store',
    },
  );

  return res.json();
}

export default async function Home() {
  const shops = await getShops();

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          PayMe Shops
        </h1>

        <Link
          href="/orders"
          className="border rounded px-4 py-2"
        >
          My Orders
        </Link>
      </div>

      <div className="grid gap-4">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/shop/${shop.id}`}
          >
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h2 className="text-2xl font-semibold">
                {shop.name}
              </h2>

              <p className="text-gray-600">
                {shop.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
