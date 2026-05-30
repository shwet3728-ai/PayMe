'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  async function sendOtp() {
    const res = await fetch(
      'http://localhost:3001/api/auth/send-otp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      },
    );

    const data = await res.json();

    alert(`OTP: ${data.otp}`);

    setOtpSent(true);
  }

  async function verifyOtp() {
    const res = await fetch(
      'http://localhost:3001/api/auth/verify-otp',
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

    if (data.success) {
      localStorage.setItem(
        'token',
        data.accessToken,
      );

      alert('Login successful');

      router.push('/');
    } else {
      alert('Invalid OTP');
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">
        Login
      </h1>

      <input
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        placeholder="Phone Number"
        className="border p-2 mr-2"
      />

      {!otpSent ? (
        <button
          onClick={sendOtp}
          className="border px-4 py-2"
        >
          Send OTP
        </button>
      ) : (
        <div className="mt-4">
          <input
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            placeholder="Enter OTP"
            className="border p-2 mr-2"
          />

          <button
            onClick={verifyOtp}
            className="border px-4 py-2"
          >
            Verify OTP
          </button>
        </div>
      )}
    </main>
  );
}
