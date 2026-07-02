# REST API Specifications - AURA Gallery

This document outlines the planned backend routes for API integrations.

---

## 1. Authentication Routes (Proxied via Supabase Auth)
- **POST `/api/auth/register`**: Register new profiles.
- **POST `/api/auth/login`**: Authenticate profiles and return JWT.

---

## 2. Artworks API
- **GET `/api/artworks`**: Retrieve lists of artworks.
  - **Query Params**:
    - `category`: Filter by paintings, calligraphy, sketches.
    - `featured`: Filter by featured.
- **GET `/api/artworks/:slug`**: Fetch a single artwork profile.
- **POST `/api/artworks`**: Create new artwork items (Admin restricted).

---

## 3. Commissions API
- **POST `/api/commissions`**: Submit custom artwork commission inquiries.
  - **Payload**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "medium": "oil",
      "dimensions": "medium",
      "description": "Abstract oil painting with gold textures."
    }
    ```
- **GET `/api/commissions`**: View past commission requests (User JWT restricted).

---

## 4. Shopping Bag & Checkout API
- **GET `/api/cart`**: Get items currently in user's shopping bag.
- **POST `/api/cart`**: Add an item to the shopping bag.
- **DELETE `/api/cart/:id`**: Remove an item from the shopping bag.
- **POST `/api/checkout`**: Create a Stripe Checkout Session for payment.
