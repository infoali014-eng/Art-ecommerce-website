# Architectural Specifications - AURA Gallery

This document outlines the architectural patterns and codebase structure of the AURA Art Gallery & Custom Artwork eCommerce system.

---

## 1. High-Level Directory Design

AURA is structured as a modular repository, prepared to scale into a multi-app monorepo:

- **`/frontend`**: Built with Next.js (App Router), TypeScript, and Tailwind CSS.
- **`/backend`**: Node.js/Express with TypeScript, serving future REST API endpoints.
- **`/docs`**: System design blueprints, roadmap catalogs, database tables, and API endpoints.

---

## 2. Frontend Layering (Next.js App Router)

The `/frontend` codebase is structured to enforce isolation of concerns and maintain dry principles:

```text
frontend/
├── app/                  # Router layers & layouts (CSS, fonts, layout templates)
├── assets/               # Static image assets sorted by section (hero, gallery, logos)
├── components/
│   ├── layout/           # Shared page constraints (Containers, Sections, Wrappers)
│   ├── ui/               # Reusable Atomic UI controls (Buttons, Inputs, Modals)
│   ├── skeleton/         # Content loaders
│   └── sections/         # Composed UI pages segments (Navbar, Hero, Footer)
├── config/               # Extracted environment, brand theme, and link maps
├── constants/            # Client static database mock data and enumeration keys
├── types/                # Strict Type definitions for domain entities
```

### Path Aliasing
To prevent deeply nested relative imports, the workspace utilizes path aliasing. Import references point to `@/*` (mapping to the `/frontend` root):
- Good: `import { Button } from '@/components/ui/Button'`
- Avoid: `import { Button } from '../../../components/ui/Button'`

---

## 3. Styling & Branding System (Tailwind CSS v4)

Branding tokens are configured in `frontend/config/theme.ts` and loaded into Tailwind CSS v4's dynamic `@theme` compiler inside `frontend/app/globals.css`:
- **Background Layer**: `#FAF7F2` (cream-luxury white)
- **Primary Text**: `#1F1F1F` (charcoal black)
- **Secondary Text**: `#6B6B6B` (medium-warm grey)
- **Accent Details**: `#B68D40` (brass gold)

### Anti-Aliasing and Rendering
Global resets ensure that font-rendering is optimized (`-webkit-font-smoothing: antialiased`) and custom fine scrollbar thumbs match the theme styling.

---

## 4. State Management & Side Effects

1. **Client Components**: Flagged with `"use client"` at the entry point of the file. Used strictly when components rely on hooks (`useState`, `useEffect`) or interact with browser events.
2. **Server Components**: All page routes and static components default to Server Components to leverage Server-Side Rendering (SSR) and minimize client-side bundle sizes.
3. **Data Fetching**: Mocked statically in Phase 1 via `frontend/constants/artworks.ts`. Ready to be replaced by async fetch requests or Supabase hooks in Phase 2.
