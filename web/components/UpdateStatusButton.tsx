'use client';

export default function UpdateStatusButton({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  async function updateStatus() {
    const token = localStorage.getItem('token');

    const res = await fetch(
      `http://localhost:3001/api/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      },
    );

    const data = await res.json();

    alert(JSON.stringify(data));

    window.location.reload();
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
