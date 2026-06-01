'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function sendOtp() {
    setLoading(true);
    setMessage('');

    const res = await fetch(
      `${API}/auth/send-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      },
    );

    const data = await res.json();

    if (res.ok && data.success) {
      setMessage(data.otp ? `Demo OTP: ${data.otp}` : 'OTP sent.');
      setOtpSent(true);
    } else {
      setMessage(data.message || 'Unable to send OTP.');
    }

    setLoading(false);
  }

  async function verifyOtp() {
    setLoading(true);
    setMessage('');

    const res = await fetch(
      `${API}/auth/verify-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      },
    );

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem(
        'token',
        data.accessToken,
      );

      router.push('/');
    } else {
      setMessage(data.message || 'Invalid OTP');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <section className="mx-auto max-w-md rounded-lg border bg-white p-6">
        <h1 className="text-3xl font-bold mb-2">
          Login
        </h1>

        <p className="mb-6 text-gray-600">
          Customers and shop owners use the same OTP login for this MVP.
        </p>

      <input
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        placeholder="Phone Number"
        className="mb-3 w-full rounded border p-2"
      />

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading || !phone}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <div className="mt-4">
          <input
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            placeholder="Enter OTP"
            className="mb-3 w-full rounded border p-2"
          />

          <button
            onClick={verifyOtp}
            disabled={loading || !otp}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

        {message && (
          <p className="mt-4 rounded border bg-gray-50 p-3 text-sm">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
