type Order = {
  id: string;
  tokenNumber: number;
  status: string;
  totalAmount: number;
};

async function getOrders(): Promise<Order[]> {
  const res = await fetch(
    'http://localhost:3001/api/orders/my-orders',
    {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBzOXgzOTMwMDAxczU1ZzJ6YWNya3NvIiwicGhvbmUiOiI5ODc2NTQzMjEwIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzgwMTQ3NDc3LCJleHAiOjE3ODA3NTIyNzd9.n77bzWz8FX284kn559LDMmv7yoLcobHRXE2iM-XeEj4',
      },
      cache: 'no-store',
    },
  );

  return res.json();
}

function getStatusColor(status: string) {
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

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
          >
            <h2 className="text-2xl font-bold">
              🎟 Token #{order.tokenNumber}
            </h2>

            <span
              className={`inline-block px-3 py-1 rounded mt-2 ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>

            <p className="mt-3 text-lg">
              ₹{order.totalAmount}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Order ID: {order.id}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
