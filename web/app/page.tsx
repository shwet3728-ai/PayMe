import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        PayMe
      </h1>

      <p className="mt-4">
        Smart Queue Management & Pickup Platform
      </p>

      <Link
        href="/shop/cmpsvawq40001s56250slr71b"
        className="inline-block mt-6 px-4 py-2 border rounded"
      >
        Open Test Shop
      </Link>
    </main>
  );
}
