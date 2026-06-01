# PayMe Deployment

PayMe is two deploys:

1. `web` on Vercel or any Next.js host.
2. `services/api` on a Node host such as Render, Railway, Fly.io, or a VPS.

## Backend Environment

Set these on the API host:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=replace_with_a_long_random_secret
CUSTOMER_WEB_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
RAZORPAY_KEY_ID=rzp_live_or_test_key
RAZORPAY_KEY_SECRET=razorpay_secret
OTP_DEBUG=false
```

Use `OTP_DEBUG=true` only for a private staging demo. Production startup fails if
critical env vars are missing.

## Frontend Environment

Set this on Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Database

From `services/api`, run migrations against the production database:

```bash
npx prisma migrate deploy
```

Optional demo seed data can be inserted with a custom seed script, but real shop
owners can now create their shop from `/owner/dashboard`.

## Build Commands

Root monorepo build:

```bash
npm run build
```

API-only build:

```bash
cd services/api
npm run build
```

Web-only build:

```bash
cd web
npm run build
```

## Smoke Test

After deploy:

1. Open the Vercel frontend.
2. Login with a phone number.
3. Open `/owner/dashboard` and create a shop.
4. Add products from `/owner/products`.
5. Open the home page, select the shop, and place an order.
6. Complete Razorpay checkout.
7. Verify the customer sees the paid order in `/orders`.
8. Verify the owner sees the order in `/owner/orders`.
9. Move the order through `PREPARING`, `READY`, and `DELIVERED`.
10. Open the queue QR URL and confirm only token/status data is visible.
