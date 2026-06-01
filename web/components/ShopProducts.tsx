'use client';

import OrderButton from './OrderButton';

export default function ShopProducts({
  products,
  shopId,
}: {
  products: any[];
  shopId: string;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Products
      </h2>

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4"
          >
            <h3 className="text-xl font-bold">
              {p.name}
            </h3>

            <p>{p.description}</p>

            <p className="font-bold mt-2">
              ₹{p.price}
            </p>

            <OrderButton
              productId={p.id}
              shopId={shopId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
