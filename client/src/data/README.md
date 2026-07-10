# Mock Data

Local constants/arrays simulating backend responses go here, one file per
domain entity (e.g. `users.js`, `products.js`, `orders.js`).

Convention:
- Export named constants, not defaults: `export const MOCK_USERS = [...]`
- Shape the data exactly as we expect the real API to return it later,
  so swapping mock data for real fetch calls is a drop-in replacement.
