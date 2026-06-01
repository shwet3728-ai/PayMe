import ShopProducts from '@/components/ShopProducts';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getShop(id: string) {
  const res = await fetch(
    `http://localhost:3001/api/shops/${id}`,
    {
      cache: 'no-store',
    }
  );

  return res.json();
}

async function getQr(id: string) {
  const res = await fetch(
    `http://localhost:3001/api/shops/${id}/qr`,
    {
      cache: 'no-store',
    }
  );

  return res.json();
}

async function getProducts(id: string) {
  const res = await fetch(
    `http://localhost:3001/api/products/shop/${id}`,
    {
      cache: 'no-store',
    }
  );

  return res.json();
}

export default async function ShopPage({
  params,
}: Props) {
  const { id } = await params;

  const shop = await getShop(id);
  const qr = await getQr(id);
  const products = await getProducts(id);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-2">
        {shop.name}
      </h1>

      <p className="mb-6 text-gray-600">
        {shop.description}
      </p>

      <ShopProducts
        products={products}
        shopId={id}
      />

      <div className="border rounded-lg p-6 max-w-md mt-10">
        <h2 className="text-2xl font-bold mb-4">
          📱 Queue QR
        </h2>

        <img
          src={qr.qrCode}
          alt="QR Code"
          className="w-64 h-64"
        />

        <p className="mt-4 break-all text-sm">
          {qr.queueUrl}
        </p>
      </div>
    </main>
  );
}
