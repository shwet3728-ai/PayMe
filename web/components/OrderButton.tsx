'use client';

import { useRouter } from 'next/navigation';
import { API, authHeaders, formatCurrency } from '@/lib/api';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
};

export default function OrderButton({
  productId,
  shopId,
  price,
}: {
  productId: string;
  shopId: string;
  price: number;
}) {
  const router = useRouter();

  async function order() {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first');
      return;
    }

    const orderRes = await fetch(`${API}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        shopId,
        productId,
        quantity: 1,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.success) {
      alert(orderData.message || 'Order creation failed');
      return;
    }

    const paymentRes = await fetch(`${API}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        orderId: orderData.order.id,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok || !paymentData.success) {
      alert(paymentData.message || 'Payment creation failed');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment checkout is still loading. Please try again.');
      return;
    }

    const options = {
      key: paymentData.key,
      amount: paymentData.amount * 100,
      currency: 'INR',
      name: 'PayMe',
      description: 'Order Payment',
      order_id: paymentData.razorpayOrderId,

      handler: async function (response: RazorpayResponse) {
        const verifyRes = await fetch(`${API}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          alert('Payment Successful');
          router.push('/orders');
        } else {
          alert(verifyData.message || 'Verification Failed');
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  return (
    <button
      className="mt-3 rounded bg-black text-white px-4 py-2"
      onClick={order}
    >
      Pay {formatCurrency(price)}
    </button>
  );
}
