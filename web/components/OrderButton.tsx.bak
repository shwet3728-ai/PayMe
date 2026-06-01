'use client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderButton({
  productId,
  shopId,
}: {
  productId: string;
  shopId: string;
}) {
  async function order() {
    const token =
      localStorage.getItem('token');

    if (!token) {
      alert('Please login first');
      return;
    }

    const orderRes = await fetch(
      'http://localhost:3001/api/orders/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopId,
          productId,
          quantity: 1,
        }),
      },
    );

    const orderData =
      await orderRes.json();

    if (!orderData.success) {
      alert('Order creation failed');
      return;
    }

    const paymentRes = await fetch(
      'http://localhost:3001/api/payments/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.order.id,
        }),
      },
    );

    const paymentData =
      await paymentRes.json();

    const options = {
      key: paymentData.key,
      amount:
        paymentData.amount * 100,
      currency: 'INR',
      name: 'PayMe',
      description: 'Order Payment',
      order_id:
        paymentData.razorpayOrderId,

      handler: async function (
        response: any,
      ) {
        const verifyRes =
          await fetch(
            'http://localhost:3001/api/payments/verify',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify(
                response,
              ),
            },
          );

        const verifyData =
          await verifyRes.json();

        if (
          verifyData.success
        ) {
          alert(
            'Payment Successful',
          );
          window.location.href =
            '/orders';
        } else {
          alert(
            'Verification Failed',
          );
        }
      },
    };

    const razorpay =
      new window.Razorpay(
        options,
      );

    razorpay.open();
  }

  return (
    <button
      className="mt-3 rounded bg-black text-white px-4 py-2"
      onClick={order}
    >
      Pay Now
    </button>
  );
}
