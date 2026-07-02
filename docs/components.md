# Component Catalog - AURA Gallery

This document details the visual components created for Phase 1.

---

## 1. Reusable Layouts (`components/layout/`)

- **`Container`**: Standardized horizontal wrapper restricting maximum content width to `7xl` (`1280px`) with responsive padding.
- **`Section`**: Controls vertical block spacing with preconfigured padding variants (`none`, `sm`, `md`, `lg`, `xl`) to maintain consistent whitespace.
- **`PageWrapper`**: A client-side Framer Motion container that animates page entries using a smooth spring fade-in and slide-up transition.

---

## 2. Reusable UI Controls (`components/ui/`)

- **`Button`**: Highly configurable button. Supports:
  - Variants: `primary` (charcoal), `secondary` (accent gold), `outline` (transparent with border), `ghost` (text-only hover).
  - Sizes: `sm`, `md`, `lg`.
- **`Card`**: White card with a subtle border, supporting a luxury hover float and deep shadow transition.
- **`Badge`**: Minimal uppercase text tags used for category badges or inventory status tags.
- **`Input`**: Text input with styling, supporting labels and form validation error states.
- **`Dropdown`**: A custom select selector with hover transitions (used for commission requests).
- **`Modal`**: A client-side overlay box that locks body scrolls and animates in/out using spring physics (used for Quick View).

---

## 3. Skeleton Loaders (`components/skeleton/`)

- **`ArtworkSkeleton`**: Replicates the layout of an artwork card, displaying a shimmering aspect-ratio image box, title, artist, and price.
- **`CardSkeleton`**: General block layout loader.

---

## 4. Visual Sections (`components/sections/`)

- **`Navbar`**: Responsive sticky header. Incorporates scroll listeners to transition from transparent to backdrop-blurred background.
- **`Hero`**: Fullscreen visual showcase. Combines slide-up typography with custom background image assets.
- **`FeaturedCategories`**: Three-column categories index card (Paintings, Calligraphy, Sketches) with zoom transitions and overlays.
- **`FeaturedCollection`**: Four-column showcase of catalog artworks. Hover actions expose detailed specifications and trigger the Quick View Modal.
- **`Footer`**: Brand column, quick navigation links, curator contact numbers, and newsletter subscription form.
