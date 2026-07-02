# Deployment and Pipeline Configurations - AURA Gallery

This document outlines the deployment strategy for the AURA eCommerce system.

---

## 1. Hosting Architecture

- **Frontend Application**: Deployed to **Vercel** to leverage serverless functions, App Router optimization, global edge CDN networks, and automated SSL.
- **Backend API**: Deployed to a containerized platform like **Railway** or **Render**, hosting the express server environment with scaling configurations.
- **Database / Media**: Hosted on **Supabase** (PostgreSQL database instance + CDN-backed Object Storage buckets for media assets).

---

## 2. Environment Variables Mapping

### Frontend Vercel Panel
- `NEXT_PUBLIC_SUPABASE_URL`: Production Supabase API endpoint.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client anonymous role JWT key.
- `NEXT_PUBLIC_SITE_URL`: Production site URL (e.g. `https://aura-gallery.vercel.app`).
- `STRIPE_PUBLIC_KEY`: Production Stripe merchant key.

### Backend Railway Panel
- `PORT`: Server port (e.g. `5000` or dynamic).
- `SUPABASE_SERVICE_ROLE_KEY`: Service role bypass token.
- `STRIPE_SECRET_KEY`: Merchant checkout secret key.
- `DATABASE_URL`: Connection string to PostgreSQL instance.

---

## 3. GitHub Actions Continuous Integration

A continuous integration action configuration (.github/workflows/ci.yml) should enforce:
1. **Linting**: Execute `npm run lint` on the frontend codebase.
2. **Formatting**: Ensure files match style configurations via `npx prettier --check .`.
3. **Compilation**: Run TypeScript checks `npm run build` to verify there are no type errors before merging branches.
