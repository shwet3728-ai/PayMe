'use client';

export default function OrderButton({
  productId,
  shopId,
}: {
  productId: string;
  shopId: string;
}) {
  async function order() {
    const token =
      localStorage.getItem(
        'token',
      );

    if (!token) {
      alert(
        'Please login first',
      );
      return;
    }

    const res = await fetch(
      'http://localhost:3001/api/orders/create',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopId,
          productId,
          quantity: 1,
        }),
      },
    );

    const data =
      await res.json();

    if (data.success) {
      alert(
        'Order created successfully',
      );
    } else {
      alert(
        JSON.stringify(data),
      );
    }
  }

  return (
    <button
      className="mt-3 rounded bg-black text-white px-4 py-2"
      onClick={order}
    >
      Order Now
    </button>
  );
}
