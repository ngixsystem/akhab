# Planner

Production-ready fullstack web application for a metal products store with public storefront, admin panel, order workflow, stock control, notifications, PostgreSQL, Prisma, and Docker. Routes support either root-domain deployment or an optional `/planner` base path.

## Project plan

1. Set up a Next.js application with Tailwind, Prisma, PostgreSQL, JWT auth, and configurable base path support.
2. Model products, orders, inventory, notifications, admin users, and company settings in Prisma.
3. Build public storefront pages: home, catalog, product details, contacts, checkout.
4. Build admin pages: login, dashboard, products, product editor, orders, order detail, inventory, notifications, settings.
5. Add secure route handlers, image upload, seed data, Docker, and deployment docs.

## Folder structure

```text
app/
  admin/
    (panel)/
      dashboard/
      inventory/
      notifications/
      orders/
      products/
      settings/
    login/
  api/
    auth/
    inventory/
    notifications/
    orders/
    products/
    settings/
    upload/
  catalog/
  checkout/
  contacts/
  product/[slug]/
components/
  admin/
  storefront/
  ui/
lib/
  api.ts
  auth.ts
  constants.ts
  data.ts
  inventory.ts
  notifications.ts
  prisma.ts
  server.ts
  utils.ts
  validations.ts
prisma/
  schema.prisma
  seed.ts
public/
  placeholder.svg
  uploads/
Dockerfile
docker-compose.yml
.env.example
README.md
```

## Database schema

Main entities:

- `AdminUser`: admin authentication.
- `Product`: common product fields plus rebar-specific numeric fields.
- `ProductAttribute`: extendable key/value attributes for `профиль`.
- `Inventory`: `inStock`, `reserved`, `available`.
- `Order`: customer order, status, comment, internal notes.
- `OrderItem`: order line items with product snapshots.
- `Notification`: admin notifications for new orders and status changes.
- `StoreSetting`: company contacts and storefront texts.

See full schema in [schema.prisma](/c:/Projects/akh/prisma/schema.prisma).

## Full code

The working application code is included in this repository. Core entry points:

- Public home: [page.tsx](/c:/Projects/akh/app/page.tsx)
- Catalog: [page.tsx](/c:/Projects/akh/app/catalog/page.tsx)
- Product details: [page.tsx](/c:/Projects/akh/app/product/[slug]/page.tsx)
- Checkout: [page.tsx](/c:/Projects/akh/app/checkout/page.tsx)
- Admin layout: [layout.tsx](/c:/Projects/akh/app/admin/(panel)/layout.tsx)
- Product API: [route.ts](/c:/Projects/akh/app/api/products/route.ts)
- Orders API: [route.ts](/c:/Projects/akh/app/api/orders/route.ts)
- Prisma seed: [seed.ts](/c:/Projects/akh/prisma/seed.ts)

## Docker setup

```bash
docker compose up --build
```

App:

- Root deployment: `http://localhost:3000`
- Optional subpath deployment: `http://localhost:3000/planner`
- Admin login: `admin@planner.local`
- Admin password: `admin12345`

Database:

- PostgreSQL runs on `localhost:5432`

## VPS deployment for akh.icafedash.com

For deployment on `https://akh.icafedash.com` with admin at `https://akh.icafedash.com/admin`, use:

```env
NEXT_PUBLIC_BASE_PATH=""
```

Resulting routes:

- storefront home: `https://akh.icafedash.com/`
- catalog: `https://akh.icafedash.com/catalog`
- checkout: `https://akh.icafedash.com/checkout`
- admin login: `https://akh.icafedash.com/admin/login`
- admin dashboard: `https://akh.icafedash.com/admin/dashboard`

If you ever need the old subpath mode again, set:

```env
NEXT_PUBLIC_BASE_PATH="/planner"
```

## Seed data

Seed includes:

- one admin user
- company settings
- one `арматура` product
- one `профиль` product with custom attributes
- inventory for both products
- one sample order
- one sample notification

## Run instructions

### Local development

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL locally or through Docker.
3. Install dependencies:

```bash
npm install
```

4. Push schema and seed:

```bash
npx prisma db push
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Open either:

- `http://localhost:3000` when `NEXT_PUBLIC_BASE_PATH=""`
- `http://localhost:3000/planner` when `NEXT_PUBLIC_BASE_PATH="/planner"`

### Production-style Docker run

```bash
docker compose up --build
```

## API summary

- `POST /planner/api/auth/login`
- `POST /planner/api/auth/logout`
- `GET /planner/api/products`
- `POST /planner/api/products`
- `PUT /planner/api/products/:id`
- `DELETE /planner/api/products/:id`
- `POST /planner/api/orders`
- `GET /planner/api/orders`
- `GET /planner/api/orders/:id`
- `PATCH /planner/api/orders/:id`
- `PATCH /planner/api/inventory/:productId`
- `GET /planner/api/notifications`
- `PATCH /planner/api/notifications/:id`
- `GET /planner/api/settings`
- `PATCH /planner/api/settings`
- `POST /planner/api/upload`

## Notes

- Admin route protection is enforced on server-rendered admin pages and admin API mutations.
- Confirming an order increments `reserved` stock and decrements `available`.
- Images are uploaded to `public/uploads`.
- Base path is configured from `NEXT_PUBLIC_BASE_PATH` in [next.config.ts](/c:/Projects/akh/next.config.ts).
