type Order = {
  tokenNumber: number;
  status: string;
};

async function getQueue(shopId: string) {
  const res = await fetch(
    `http://localhost:3001/api/orders/shop/${shopId}`,
    { cache: 'no-store' },
  );

  return res.json();
}

async function getCurrent(shopId: string) {
  const res = await fetch(
    `http://localhost:3001/api/orders/shop/${shopId}/current`,
    { cache: 'no-store' },
  );

  return res.json();
}

export default async function QueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orders = await getQueue(id);
  const current = await getCurrent(id);

  return (
    <main className="min-h-screen p-8">
      <div className="bg-yellow-100 border rounded p-4 mb-6">
        <h1 className="text-3xl font-bold">
          🔔 Now Serving: Token #{current.tokenNumber}
        </h1>
        <p>Status: {current.status}</p>
      </div>

      <div className="space-y-3">
        {orders.map((order: Order) => (
          <div
            key={order.tokenNumber}
            className="border rounded p-3"
          >
            🎟 Token #{order.tokenNumber} — {order.status}
          </div>
        ))}
      </div>
    </main>
  );
}
