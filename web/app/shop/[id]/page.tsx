import OrderButton from '@/components/OrderButton';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

type Shop = {
  id: string;
  name: string;
  description?: string;
  products: Product[];
};

async function getShop(
  id: string,
): Promise<Shop> {
  const res = await fetch(
    `http://localhost:3001/api/shops/${id}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(
      'Failed to fetch shop',
    );
  }

  return res.json();
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const shop =
    await getShop(id);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">
        {shop.name}
      </h1>

      <p className="mt-2 text-gray-500">
        {shop.description}
      </p>

      <div className="mt-8 space-y-4">
        {shop.products.map(
          (product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4"
            >
              <h2 className="text-2xl font-semibold">
                {product.name}
              </h2>

              <p>
                ₹{product.price}
              </p>

              <p className="text-gray-500">
                {product.description}
              </p>

              <OrderButton
                productId={product.id}
                shopId={shop.id}
              />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
