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
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    ```

* for github actions:

  ```bash
  npm install -D ts-node typescript
  ```

* Run the development server:

    ```bash
    npm run dev
    ```

## Supabase tables structure

* pins table

  ```sql
  create table pins (
    id uuid primary key default gen_random_uuid(),
    pin text not null,
    valid_from date not null,
    valid_to date not null,
    created_at timestamptz with time zone default now()
    );
  ```

* table_sessions table

  ```sql
  create table table_sessions (
    id uuid primary key default gen_random_uuid(),
    pin_id uuid references pins(id),
    table_number int not null,
    token uuid not null,
    expires_at timestamptz with time zone not null,
    created_at timestamptz with time zone default now()
  );
  ```

* orders table

  ```sql
  create type order_status as enum (
    'ricevuto',
    'consegnato',
    'rifiutato'
  );

  create table orders (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references table_sessions(id) on delete restrict,
    table_number int not null, -- is duplicated for the snapshot
    status order_status default 'ricevuto',
    notes text null,
    created_at timestamptz with time zone default now()
  );
  alter table orders
  add constraint notes_length_check
  check (char_length(notes) <= 200);
  ```

* order_items table

  ```sql
  create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    sanity_item_id text not null,
    [name] text not null,
    price numeric(6,2) not null,
    quantity int default 1,
    selected_options jsonb default '[]'
  );
  ```

* security

  ```sql
  alter table orders enable row level security;
  alter table order_items enable row level security;
  alter table table_sessions enable row level security;
  alter table pins enable row level security;

  -- orders
  create policy "deny all orders" on orders for all using (false) with check (false);

  -- order_items
  create policy "deny all order_items" on order_items for all using (false) with check (false);

  -- table_sessions
  create policy "deny all sessions" on table_sessions for all using (false) with check (false);

  create policy "public can read pins" on pins for select using (true);
  ```

* Functions

  ```sql
  create or replace function heartbeat()
  returns void
  language sql
  as $$
    select 1;
  $$;

  create or replace function cleanup_old_data()
  returns void
  language plpgsql
  as $$
  begin
    delete from order_items
    where order_id in (
      select id
      from orders
      where created_at < now() - interval '1 month'
    );

    delete from orders
    where created_at < now() - interval '1 month';

    delete from table_sessions
    where created_at < now() - interval '1 month';

    delete from pins
    where created_at < now() - interval '1 month';
  end;
  $$;


  create or replace function check_valid_session(p_token uuid)
  returns table (
    id uuid,
    table_number int,
    expires_at timestamptz
  )
  language sql
  as $$
    select id, table_number, expires_at
    from table_sessions
    where token = p_token
      and expires_at > now()
    limit 1;
  $$;
  revoke all on function check_valid_session from public;


  create or replace function get_new_active_pin()
  returns table (
    id text,
    pin text,
    valid_from timestamptz,
    valid_to timestamptz,
    created_at timestamptz
  )
  language sql
  security definer
  as $$
    select
      p.id,
      p.pin,
      p.valid_from,
      p.valid_to,
      p.created_at
    from pins p
    where
      now() between valid_from and valid_to
    order by p.created_at desc
    limit 1;
  $$;
  grant execute on function get_new_active_pin() to anon, authenticated;
  ```
