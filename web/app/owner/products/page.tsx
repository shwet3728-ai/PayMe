'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OwnerProductsPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId')!;

  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  async function loadProducts() {
    const res = await fetch(
      `http://localhost:3001/api/products/shop/${shopId}`
    );
    setProducts(await res.json());
  }

  async function addProduct() {
    const token = localStorage.getItem('token');

    await fetch(
      'http://localhost:3001/api/products/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopId,
          name,
          description,
          price: Number(price),
        }),
      }
    );

    setName('');
    setDescription('');
    setPrice('');
    loadProducts();
  }

  async function deleteProduct(id: string) {
    await fetch(
      `http://localhost:3001/api/products/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadProducts();
  }

  useEffect(() => {
    if (shopId) loadProducts();
  }, [shopId]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <div className="border p-4 mb-6">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={addProduct}
          className="bg-green-600 text-white px-4 py-2"
        >
          Add Product
        </button>
      </div>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4">
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.description}</p>
            <p>₹{p.price}</p>

            <button
              onClick={() => deleteProduct(p.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
