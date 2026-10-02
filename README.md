# Coldwell — Phases 1–9, wired to a real backend, with motion design

A Next.js (App Router) + TypeScript + Tailwind CSS frontend for a
Pakistan-focused clothing e-commerce site, now connected to a real
FastAPI + MongoDB backend (see the separate `coldwell-backend` project).

This covers **Phase 1** (design system, layout, navbar, footer), **Phase 2**
(the full homepage), **Phase 3** (shop/listing pages), **Phase 4** (the
product details page), **Phase 5** (a real, working cart), **Phase 6**
(checkout — guest checkout, COD-first, and order confirmation), **Phase 7**
(auth), **Phase 8** (order history + tracking), and **Phase 9** (the admin
dashboard — real product and order management, gated by a real admin
role). All product, order, and pricing data comes from the backend API —
nothing is hardcoded or mocked in this project. Testing (Phase 11) and
production optimization (Phase 12) are what's left.

A motion design pass (Framer Motion) has also been added on top: scroll-in
animations for the homepage and product grids, a staggered hero entrance,
an animated mega menu and mobile menu, a pulsing cart badge, and spring-in
transitions for the size guide modal and the add-to-cart confirmation. See
"Motion design" below for where it all lives.

## Run it locally

**The backend must be running first** — see `coldwell-backend/README.md`.
By default this expects it at `http://localhost:8000` (set in `.env.local`).

```bash
npm install
npm run dev
```

Then open http://localhost:3000. If a page shows a "Couldn't reach the
store's backend" error, the backend isn't running (or isn't on the port
`.env.local` points to).

## Folder structure

```
app/
  layout.tsx      Root layout — loads fonts, wraps every page in Navbar/Footer
  page.tsx         Homepage — hero, new arrivals, categories, best sellers,
                   promo banner, trust section, social gallery
  globals.css      Tailwind base layer + a couple of global utilities
components/
  layout/
    Navbar.tsx      Desktop nav + mega menu trigger + mobile menu trigger
    MegaMenu.tsx    Dropdown panel shown under Men / Women
    MobileMenu.tsx  Full-height slide-in menu with accordion categories
    Footer.tsx      Link columns, newsletter form, trust line
  home/
    SectionHeader.tsx    Shared "Title + View All" header
    NewArrivals.tsx      Homepage new-arrivals product grid
    BestSellers.tsx      Homepage best-sellers product grid
    ShopByCategory.tsx   Category tile grid
    PromoBanner.tsx      Full-width sale banner
    WhyShopWithUs.tsx    Trust/benefits strip
    SocialGallery.tsx    Instagram-style placeholder gallery
  product/
    ProductCard.tsx  Image w/ hover crossfade, wishlist toggle, price,
                     color swatches, click-to-open Quick Add size selector
  shop/
    ShopListing.tsx      Orchestrates a listing page: header/count, sort,
                         desktop sidebar + mobile sheet, product grid
    FilterPanel.tsx      Shared filter accordion (Category, Size, Color,
                         Price, Collection, Availability, Discount)
    SortSelect.tsx       Desktop sort dropdown
    MobileFilterSheet.tsx  Mobile "Filter & Sort" full-screen sheet
  product-details/
    ProductDetails.tsx      Main PDP: gallery, price, color/size selection,
                            quantity, add to cart / buy now, wishlist
    ProductGallery.tsx      Placeholder image gallery with thumbnails
    SizeGuideModal.tsx      Size chart modal
    ProductInfoAccordion.tsx  Details / Shipping / Returns accordion
  cart/
    CartProvider.tsx     Global cart state (Context + localStorage) — stores
                         a name/price snapshot per item, so the cart and
                         checkout don't need extra API calls to render
    CartPageContent.tsx  Cart page: line items, quantity controls, order
                         summary, empty state
  checkout/
    CheckoutContent.tsx           Contact info, delivery address, COD-first
                                  payment method, order summary, validation,
                                  calls POST /api/orders on submit
    OrderConfirmationContent.tsx  Fetches the real order from the backend
                                  and shows the confirmation screen
lib/
  site-config.ts   Brand name, currency, delivery thresholds — change once, applies everywhere
  navigation.ts    The nav + footer link structure, data-driven, plus a
                   slug → subcategory-label resolver for the dynamic routes
  types.ts         Product type
  api-client.ts    Base fetch() wrapper for the backend (reads
                   NEXT_PUBLIC_API_URL, throws ApiError on failure)
  api/products.ts  fetchProducts() / fetchProductBySlug() — calls the
                   real backend, replaces the old local mock catalog
  format.ts        Price formatting + discount-percent helper
  sort.ts          Sort options + sortProducts() (still applied client-side,
                   on top of whatever the API returns)
  filters.ts       Filter types, facet derivation, applyFilters() (also
                   client-side, for the instant no-reload filtering UX)
  cart-utils.ts    computeTotals() — subtotal/shipping/total from the cart's
                   own item snapshots, no API call needed
  orders.ts        createOrder() / fetchOrder() — calls the real backend
                   (POST /api/orders, GET /api/orders/{orderNumber})
  validation.ts    Pakistani phone + email validation for the checkout form
```

**Note on architecture:** product filtering and sorting still happen
client-side (in `ShopListing`), on top of a full category/collection fetch
from the API — this keeps the instant, no-page-reload filtering UX from
Phase 3. The backend *also* supports server-side filtering via query params
(see `coldwell-backend/README.md`) if you'd rather move that logic
server-side later (worth doing once the catalog is large enough that
fetching "all of Men" isn't cheap).

Routes: `/shop`, `/men`, `/women`, `/men/[subcategory]`, `/women/[subcategory]`
(unknown slugs 404), `/new-arrivals`, `/best-sellers`, `/sale`,
`/product/[slug]` (unknown slugs 404), `/cart`, `/checkout`,
`/order-confirmation/[orderNumber]`, `/login`, `/signup`, `/account`,
`/account/orders`, and `/track-order`.

## Design system

- **Colors** — `paper` (#FAFAF8) background, `ink` (#15140F) text, `ink-soft`
  (#55534A) secondary text, `line` (#E3E0D6) hairline borders, and one accent,
  `oxblood` (#6E1E2B), reserved for Sale, active states, and primary hover
  states. No drop shadows or rounded "SaaS card" styling — flat panels with
  1px borders, 2px corner radius on interactive elements.
- **Type** — Fraunces (serif) for display headlines, Manrope (sans) for
  everything else. Both are self-hosted via `@fontsource-variable/*` packages
  (imported in `app/layout.tsx`), so there's no runtime fetch to Google Fonts
  — useful on a slow or restricted connection.
- **Brand name** — set once in `lib/site-config.ts` (`SITE_NAME`). Swap it
  there when the real brand name is ready; it's used in the navbar, footer,
  and page metadata.

## Cart behavior

The cart (`components/cart/CartProvider.tsx`) is a React Context wrapping
the whole app, persisted to `localStorage` under the key `shop-cart-v2`, so
a cart survives a page refresh or closing the tab. Each cart item stores a
snapshot of the product's name/price at the moment it was added (so the
cart and checkout pages render instantly with no extra API calls) — but the
**order total is always recalculated server-side from the live database
price** when you actually place the order, so a stale snapshot can never be
used to under- or over-charge. Adding a product (Quick Add on a card, or Add
to Cart / Buy Now on the product page) immediately updates the navbar badge.

## Checkout & orders

Checkout (`components/checkout/CheckoutContent.tsx`) is a single page:
contact info, delivery address (with the 7 Pakistani provinces/territories),
and payment method — Cash on Delivery, Online Payment, or Bank Transfer,
with COD first and selected by default, per the brief. There's no login
*requirement* — guest checkout always works — but if the shopper is logged
in, their name/email are pre-filled and the order is linked to their
account (so it shows up in `/account/orders`). On submit, it validates
every field (including a Pakistani phone number format) and shows inline
errors rather than an alert.

Placing an order calls `POST /api/orders` on the real backend
(`lib/orders.ts`), which resolves every item's real price from the
database, generates the order number, and stores it in MongoDB. The cart is
then cleared and the user lands on `/order-confirmation/[orderNumber]`,
which fetches that same order back from the backend (`GET
/api/orders/{orderNumber}`) and shows the items, delivery address, payment
method, and totals. If the backend is unreachable, checkout shows an
inline error instead of silently failing.

## Auth & order history

Auth (`components/auth/AuthProvider.tsx`) is a React Context wrapping the
app, same pattern as the cart. It stores a JWT in `localStorage`
(`coldwell-auth-token`) and re-verifies it against `GET /api/auth/me` on
every page load — an expired or tampered token is silently cleared rather
than shown as a broken logged-in state.

- `/login` and `/signup` both accept a `?next=` query param and redirect
  there on success (used by `/account` and `/account/orders` when they
  bounce a logged-out visitor to log in first)
- `/account` — profile info + a logout button, or a login/signup prompt if
  logged out
- `/account/orders` — the logged-in user's real order history from
  `GET /api/orders/mine`, with a status badge per order
- `/track-order` — works without logging in: enter an order number and the
  phone number used at checkout, and it shows a visual progress tracker
  (Order Placed → Confirmed → Processing → Shipped → Delivered). The phone
  is checked server-side (see the backend README) so this can't be used to
  browse other people's orders by guessing order numbers.

One thing worth knowing: **order status never advances past "Pending"
right now**, because nothing yet moves it forward — that's the admin
dashboard's job (Phase 9). The tracker and status badges are fully wired
and will reflect real progress the moment something starts updating order
status in the database.

## Admin dashboard

Reachable at `/admin` — there's no link to it in the public navbar on
purpose (customers shouldn't stumble onto it). Getting in requires a real
admin account; see "Creating an admin" in the backend README, since there's
no way to become an admin through the site itself.

- `/admin` — quick stats (product count, total orders, pending orders)
  and links into the two sections below
- `/admin/products` — every product in a table, with Edit and Delete
  actions and an "Add Product" button
- `/admin/products/new` and `/admin/products/[slug]/edit` — the same form
  component (`components/admin/ProductForm.tsx`) for both creating and
  editing: name, category, subcategory, price, sale price, description,
  sizes (comma-separated), a click-to-toggle "out of stock" state per
  size, colors (add/remove rows with a name and a color picker), and the
  New Arrival / Best Seller flags
- `/admin/orders` — every order across every customer, with an inline
  dropdown to move each one through Pending → Confirmed → Processing →
  Shipped → Delivered (or Cancelled). This is what makes the customer-facing
  order tracker (`/track-order`) actually mean something.

`components/admin/AdminGuard.tsx` wraps every admin page: logged out → a
login prompt; logged in but not an admin → "Access Denied"; admin → the
real page. The check is the user's `role` from `/api/auth/me`, which the
backend re-verifies against the database on every request — not something
baked into the token, so revoking someone's admin access takes effect
immediately.

**Scope note:** this covers the two parts of the original brief's admin
section that had real detail behind them — Product Management and Order
Management. Categories, Customers, Discounts, Coupons, Reviews, and
Banners were only named in a bullet list with nothing specified about how
they should work, so they're not built here. Also out of scope for now:
image upload (products still use the placeholder image blocks) and SKU
fields (not part of the current Product model).

## Motion design

Built with [Framer Motion](https://www.framer.com/motion/). The reusable
piece is `components/motion/Reveal.tsx` — a fade-up-on-scroll wrapper used
throughout the homepage (category tiles, benefit icons, the promo banner,
the Instagram-style gallery, section headers). Everything else is animated
directly in its own component:

- `components/home/Hero.tsx` — staggered entrance on page load (not
  scroll-triggered, since it's above the fold)
- `components/product/ProductCard.tsx` — scroll-reveal with a per-card
  stagger delay (based on its position in the grid), plus a hover lift and
  a wishlist-heart bounce
- `components/layout/Navbar.tsx` — the cart badge replays its pop-in
  animation every time the count changes (via a `key={itemCount}` trick)
- `components/layout/MegaMenu.tsx` / `MobileMenu.tsx` — real enter/exit
  transitions via `AnimatePresence`, not just instant show/hide; the mobile
  subcategory accordion animates its height open/closed
- `components/product-details/ProductDetails.tsx` /
  `SizeGuideModal.tsx` — spring-in transitions for the add-to-cart
  confirmation and the size guide modal

If you want to add motion somewhere new, reach for `<Reveal>` first for a
simple "fade up as it scrolls into view" — it covers most cases. For
anything more custom (hover states, exit animations, staggered lists), the
pattern in `ProductCard.tsx` or `MobileMenu.tsx` is a good template to copy.

## Next phases

1. ✅ Design system, layout, navbar, footer
2. ✅ Homepage — new arrivals grid, shop-by-category, best sellers, promo
   banner, trust section, social gallery
3. ✅ Shop / listing pages — filters, sort, responsive product grid
4. ✅ Product details page — gallery, size/color selection, add to cart
5. ✅ Cart — line items, quantity controls, order summary, persists via
   localStorage, live navbar badge
6. ✅ Checkout — guest checkout, COD-first for Pakistan, order confirmation
7. ✅ Auth (login/signup) — JWT-based, verified against the real backend
8. ✅ Order history + tracking — logged-in order history, plus guest
   order tracking by order number + phone (phone must match, checked
   server-side)
9. ✅ Admin dashboard — real product & order management, gated by a real
   admin role (not just "logged in")
10. ✅ FastAPI + MongoDB backend — built separately as `coldwell-backend`,
    and this frontend now calls it for all product/order data
11. Testing
12. Production optimization
