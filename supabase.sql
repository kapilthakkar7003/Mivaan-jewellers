-- MIVAAN JEWELLERS DATABASE
-- Run this entire file in Supabase SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price text default '',
  images text[] not null default '{}',
  is_new boolean not null default true,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Public visitors can only read published products.
drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products for select
using (is_published = true);

-- Authenticated admins can manage products.
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (true);

-- Storage bucket for product photos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');

-- Optional seed products using the supplied local images is intentionally NOT inserted here.
-- The website ships with five demo products locally so it looks complete immediately.
-- Once Supabase is connected, use Admin > Add Product to create your live catalog.
