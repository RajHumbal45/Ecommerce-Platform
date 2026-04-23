# Everyday Store

Everyday Store is a production-shaped e-commerce frontend built with Next.js App Router. It focuses on one complete shopping flow: discover products, filter and search the catalog, inspect product details, manage the cart, check out, and land on an order confirmation page.

## Project Overview

The app is designed as a polished storefront for beauty, fragrance, skincare, and home essentials. It uses a public product API for catalog data, Redux for UI state, Redux-Saga for async checkout flow, and persistent client storage for cart and wishlist state.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Redux Toolkit with a custom feature-based folder structure
- Redux-Saga
- `next-redux-wrapper`
- React Hook Form
- Zod
- Tailwind CSS v4
- Lucide React
- DummyJSON public API for product data

## Features

- Home page with a hero section, featured products, and category shortcuts
- Global header search with autocomplete
- Product listing page with search, category filtering, price filtering, rating filtering, and sorting
- Product detail page with image gallery, variant awareness, and add-to-cart controls
- Cart page with item management, quantity controls, totals, and free-shipping messaging
- Checkout flow with order submission through Redux-Saga
- Success page with order summary and confirmation details
- Wishlist support with persistent client storage
- Responsive layout for desktop and mobile
- Loading states, empty states, and accessible focus handling

## Setup

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

## Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Create a production build
- `npm run start` - Start the production server
- `npm run lint` - Run Next.js linting

## Architecture

### Data flow

- Product data is fetched from DummyJSON and mapped into the app's internal product shape.
- Catalog and product detail pages use cached fetch helpers so repeated requests are deduplicated.
- Cart, wishlist, and checkout data are kept in Redux and persisted on the client.

### Redux structure

Feature folders are organized by concern:

- `src/redux/actions/<feature>/`
- `src/redux/reducers/<feature>/`
- `src/redux/sagas/handlers/<feature>/`
- `src/redux/sagas/requests/`
- `src/redux/sagas/rootsaga.ts`
- `src/redux/store.ts`
- `src/redux/wrapper.ts`

### Persistence

- Cart state persists in `localStorage`
- Wishlist state persists in `localStorage`
- Checkout confirmation state persists in `sessionStorage`

### Implementation decisions

- Cart badge count represents unique cart items, not total quantity.
- Checkout clears the cart after a successful submit.
- The catalog uses deferred updates and memoized rendering to keep search and filtering responsive.
- Product cards and result cards use `content-visibility` hints to reduce offscreen rendering work.
- The featured carousel is lazy-loaded to reduce unnecessary bundle cost on non-carousel routes.

## Assumptions

- DummyJSON is treated as the primary catalog source.
- Checkout is simulated and does not talk to a real payment processor.
- Order confirmation is generated client-side after the saga resolves.
- There is no offline fallback dataset yet if the public API is unavailable.

## Future Improvements

- Add a local mock fallback for catalog data if the public API is unreachable
- Add real form validation with React Hook Form and Zod on the checkout page
- Add automated tests for cart, search, filtering, and checkout flows
- Add more granular skeletons for slow product and catalog states
- Add analytics or telemetry hooks if the app is extended beyond the demo scope

## Repository Notes

- `implementation-plan.md` documents the original phased build plan.
- `AGENT.md` contains project-specific working notes for agents.
- `tsconfig.tsbuildinfo` is intentionally ignored because it is a TypeScript build cache file.
