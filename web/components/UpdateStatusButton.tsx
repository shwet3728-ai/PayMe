'use client';

export default function UpdateStatusButton({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  async function updateStatus() {
    const res = await fetch(
      `http://localhost:3001/api/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBzOXgzOTMwMDAxczU1ZzJ6YWNya3NvIiwicGhvbmUiOiI5ODc2NTQzMjEwIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzgwMTQ3NDc3LCJleHAiOjE3ODA3NTIyNzd9.n77bzWz8FX284kn559LDMmv7yoLcobHRXE2iM-XeEj4',
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
