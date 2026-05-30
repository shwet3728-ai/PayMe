import UpdateStatusButton from '@/components/UpdateStatusButton';

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

async function getOrders() {
  const res = await fetch(
    'http://localhost:3001/api/orders/shop/cmpsamyvr0001s5sgqyl0n1n5',
    {
      cache: 'no-store',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBzOXgzOTMwMDAxczU1ZzJ6YWNya3NvIiwicGhvbmUiOiI5ODc2NTQzMjEwIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzgwMTQ3NDc3LCJleHAiOjE3ODA3NTIyNzd9.n77bzWz8FX284kn559LDMmv7yoLcobHRXE2iM-XeEj4',
      },
    },
  );

  return res.json();
}

export default async function OwnerOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        Shop Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
          >
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Amount:</strong> ₹{order.totalAmount}
            </p>

            <div className="mt-3">
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
