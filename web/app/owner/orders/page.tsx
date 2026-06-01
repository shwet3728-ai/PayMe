import UpdateStatusButton from '@/components/UpdateStatusButton';

type Order = {
  id: string;
  tokenNumber: number;
  status: string;
  totalAmount: number;
};

async function getOrders() {
  const res = await fetch(
    'http://localhost:3001/api/orders/shop/cmpsvawq40001s56250slr71b',
    {
      cache: 'no-store',
    },
  );

  return res.json();
}

async function getCurrentToken() {
  const res = await fetch(
    'http://localhost:3001/api/orders/shop/cmpsvawq40001s56250slr71b/current',
    {
      cache: 'no-store',
    },
  );

  return res.json();
}

function statusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-200';
    case 'PREPARING':
      return 'bg-yellow-200';
    case 'READY':
      return 'bg-blue-200';
    case 'DELIVERED':
      return 'bg-green-200';
    default:
      return 'bg-gray-200';
  }
}

export default async function OwnerOrdersPage() {
  const orders = await getOrders();
  const current = await getCurrentToken();

  return (
    <main className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Queue Dashboard
        </h1>

        <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <p className="text-xl font-bold">
            🔔 Now Serving: Token #{current.tokenNumber}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Status: {current.status}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
          >
            <h2 className="text-2xl font-bold">
              🎟 Token #{order.tokenNumber}
            </h2>

            <span
              className={`inline-block px-3 py-1 rounded mt-2 ${statusColor(order.status)}`}
            >
              {order.status}
            </span>

            <p className="mt-2">
              ₹{order.totalAmount}
            </p>

            <div className="mt-4">
              <UpdateStatusButton
                orderId={order.id}
                status="PREPARING"
              />

              <UpdateStatusButton
                orderId={order.id}
                status="READY"
              />

              <UpdateStatusButton
                orderId={order.id}
                status="DELIVERED"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
