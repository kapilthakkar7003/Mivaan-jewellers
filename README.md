# Mivaan Jewellers — Premium Mangalsutra Website (Luxury Edition)

A light, luxury, mobile-first React/Vite catalogue website with:
- Mivaan Jewellers branding
- 5 supplied Mangalsutra demo photos
- Product detail modal
- WhatsApp enquiry with product name
- Call/contact button
- Supabase-backed product catalog
- Private admin login
- Admin add/edit/hide/delete products
- Multiple product photo uploads
- New / Featured labels
- No product categories
- No cart and no online payment

## 1. Run the design locally

Install Node.js 20+.

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## 2. Enable the live Admin Panel

Create a free Supabase project.

1. Open Supabase Dashboard.
2. Create a project.
3. Open SQL Editor.
4. Paste and run `supabase.sql`.
5. In Authentication > Users, create the owner/admin user with email + password.
6. Copy the project URL and anon/publishable key.
7. Create `.env` from `.env.example` and fill the two values.
8. Restart `npm run dev`.

The website automatically switches from demo/local products to Supabase products once Supabase is configured.

## 3. Admin

Open:

`/admin`

Sign in with the Supabase user you created.

Admin can:
- add a Mangalsutra
- upload multiple photos
- edit details
- set price
- mark New / Featured
- publish/unpublish
- delete

## 4. Important security note

The browser only receives the Supabase anonymous/publishable key. Never put a Supabase service-role/secret key into this project or any frontend file.

For a real production launch, restrict admin access further with a dedicated `admin_users` table/RLS or a server-side admin role if multiple staff accounts are added.

## 5. Deploy

This is a static Vite build and can be deployed to Cloudflare Pages, Netlify, Vercel, GitHub Pages (with appropriate SPA routing), or similar static hosting.

For Cloudflare Pages:
- connect the GitHub repository
- build command: `npm run build`
- output directory: `dist`
- add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables

## WhatsApp

The website uses Mivaan's WhatsApp number:
+91 7600661234

It opens WhatsApp with a pre-filled enquiry containing the product name.


## Visual direction
The public site uses a light ivory/white luxury editorial aesthetic, restrained champagne-gold accents, serif display typography, large product photography, subtle reveal animations, and a mobile-first layout. It intentionally has no product categories, cart, checkout, or online payment.
