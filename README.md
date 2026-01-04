# Fusa & Caffè

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

* Activate Next: `npx next dev`

* Packages To install if missing:
  * `npm install next-sitemap`
  * `npm install @emailjs/browser`
  * `npm install react-hook-form`
  * `npm install emailjs-com`
  * `npm i @vercel/speed-insights`
  * `npm install @supabase/supabase-js`
  * `npm install react-hot-toast`

* Before To run the project you have to create a `.env.local` file with these values:

    ```bash
    NEXT_PUBLIC_SANITY_PROJECT_ID="..."
    NEXT_PUBLIC_SANITY_DATASET="..."
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
    NEXT_PUBLIC_EMAILJS_USER_ID=...
    ```

* Run the development server:

    ```bash
    npm run dev
    ```

## Supabase tables structure

* weekly_pins table

  ```sql
  create table weekly_pins (
    id uuid primary key default gen_random_uuid(),
    pin text not null,
    valid_from date not null,
    valid_to date not null,
    created_at timestamp with time zone default now()
    );
  ```

* table_sessions table

  ```sql
  create table table_sessions (
    id uuid primary key default gen_random_uuid(),
    pin_id uuid references weekly_pins(id),
    table_number int not null,
    token uuid not null,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default now()
  );
  ```

* orders table

  ```sql
  create type order_status as enum (
    'ricevuto',
    'in_preparazione',
    'pronto',
    'consegnato'
  );

  create table orders (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references table_sessions(id) on delete restrict,
    table_number int not null, -- is duplicated for the snapshot
    status order_status default 'ricevuto',
    created_at timestamp with time zone default now()
  );
  ```

* order_items table

  ```sql
  create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    sanity_item_id text not null,
    [name] text not null,
    price numeric(6,2) not null,
    quantity int default 1
  );
  ```

* security

  ```sql
  alter table orders enable row level security;
  alter table order_items enable row level security;

  create policy "Insert orders with valid token" on orders for insert with check (true);
  create policy "Insert order items" on order_items for insert with check (true);
  create policy "Allow select for anon" on weekly_pins for select using (true);
  create policy "Allow select for anon" on table_sessions for select using (true);
  create policy "Allow insert for anon" on "public"."table_sessions" to public with check (true);
  create policy "Allow select for anon" on orders for select using (true);
  create policy "Allow select for anon" on order_items for select using (true);
  create policy "Allow select by token" on table_sessions for select using (true);
  create policy "allow server write" on table_sessions for all using (true) with check (true);
  ```
