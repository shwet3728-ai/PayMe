'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { API, Product, authHeaders, formatCurrency } from '@/lib/api';

type ProductForm = {
  name: string;
  description: string;
  price: string;
};

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
};

export default function OwnerProductsPage() {
  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function resolveShopId() {
    const params = new URLSearchParams(window.location.search);
    const requestedShopId = params.get('shopId');

    if (requestedShopId) {
      return requestedShopId;
    }

    const shopRes = await fetch(`${API}/shops/my-shops`, {
      headers: authHeaders(),
    });
    const shopData = await shopRes.json();

    if (!shopRes.ok || !shopData?.[0]?.id) {
      throw new Error(shopData.message || 'No shop found for this owner');
    }

    return shopData[0].id;
  }

  async function loadProducts(nextShopId = shopId) {
    try {
      const id = nextShopId || (await resolveShopId());
      setShopId(id);

      const res = await fetch(`${API}/products/shop/${id}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to load products');
      }

      setProducts(data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateForm(key: keyof ProductForm, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
    });
  }

  function resetForm() {
    setEditingId('');
    setForm(emptyForm);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!shopId || !form.name.trim() || Number(form.price) <= 0) {
      setError('Enter a product name and valid price.');
      return;
    }

    setSaving(true);

    try {
      const url = editingId
        ? `${API}/products/${editingId}`
        : `${API}/products/create`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          shopId,
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to save product');
      }

      resetForm();
      await loadProducts(shopId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save product');
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    const res = await fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.message || 'Unable to delete product');
      return;
    }

    await loadProducts(shopId);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-600">Add and maintain the menu customers can order from.</p>
          </div>

          <div className="flex gap-2">
            <Link href="/owner/dashboard" className="rounded border bg-white px-4 py-2">
              Dashboard
            </Link>
            {shopId && (
              <Link
                href={`/owner/orders?shopId=${shopId}`}
                className="rounded border bg-white px-4 py-2"
              >
                Orders
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={saveProduct} className="mb-8 rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-xl font-bold">
            {editingId ? 'Edit product' : 'Add product'}
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
              className="rounded border p-2"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              className="rounded border p-2"
            />
            <input
              placeholder="Price"
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => updateForm('price', event.target.value)}
              className="rounded border p-2"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              disabled={saving}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border bg-white px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p className="rounded border bg-white p-4">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="rounded border bg-white p-6">No products yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="rounded-lg border bg-white p-4">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="mt-1 text-gray-600">{product.description || 'No description'}</p>
                <p className="mt-3 text-lg font-semibold">
                  {formatCurrency(product.price)}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="rounded border px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
