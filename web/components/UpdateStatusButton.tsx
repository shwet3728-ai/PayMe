'use client';

import { API, authHeaders } from '@/lib/api';

export default function UpdateStatusButton({
  orderId,
  status,
  onUpdated,
}: {
  orderId: string;
  status: string;
  onUpdated?: () => void;
}) {
  async function updateStatus() {
    const res = await fetch(
      `${API}/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          status,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || 'Unable to update order status');
      return;
    }

    onUpdated?.();
  }

  return (
    <button
      onClick={updateStatus}
      className="border px-3 py-1 rounded mr-2"
    >
      {status}
    </button>
  );
}
