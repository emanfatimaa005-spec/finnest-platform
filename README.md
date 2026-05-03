# FinNest — Dynamic Financial Product Discovery Platform

> **Course:** Web Programming — BS Financial Technology  
> **University:** FAST National University, Islamabad  
> **Instructor:** Arsalan Khan  

---

## 📌 Project Overview

**FinNest** is a fully functional, single-page React application that simulates a real-world financial product discovery platform. Users can explore financial instruments (savings, investments, insurance, crypto), build a personal financial profile, get AI-style personalized product recommendations, and manage a live investment portfolio — all without a backend.

This is **not** a generic e-commerce clone. Every data attribute, filter, recommendation, and portfolio calculation reflects genuine financial reasoning.

---

## ✅ Features Implemented

### Pages
| Page | Route (simulated) | Description |
|------|-------------------|-------------|
| Home | `/home` | Hero section, featured products, category navigation, platform stats |
| Product Listing | `/products` | All 20 products with 6 combined filters |
| Product Detail | `/detail/:id` | Full attributes, risk bar, decision insight, return calculator, comparison |
| User Profile | `/profile` | Full form with validation — drives recommendations |
| Portfolio | `/portfolio` | Holdings, weighted return, risk distribution bar |
| Recommendations | `/recommendations` | Profile-driven dynamic product matching |
| 404 | `*` | Invalid product ID or route |

### Core FinTech Logic
- **Recommendation Engine** — Maps risk tolerance → allowed risk levels, investment horizon → time horizons, liquidity preference → liquidity types; sorts by risk/return based on profile
- **Portfolio Calculations** — Total invested, weighted expected return, risk distribution %, category distribution %
- **Decision Insight Generator** — Dynamically generates contextual text from product attributes (not hardcoded)
- **Return Calculator** — Compound and simple interest projections for 1–5 years
- **Product Comparison** — Side-by-side comparison of any 2 products on the detail page
- **Filter System** — 6 filters with AND logic (risk, return range, category, liquidity, time horizon, min investment)
- **API Data Transformation** — Fake Store API products are systematically transformed using deterministic mappings (same product always → same financial attributes)

---

## 🏗️ Component Architecture

```
App
├── UserProfileProvider (Context)
│   └── PortfolioProvider (Context)
│       └── AppContent
│           ├── Navbar
│           ├── HomePage
│           │   ├── ProductCard (×3-5 featured)
│           │   └── CategoryCards
│           ├── ProductListingPage
│           │   ├── FilterPanel
│           │   └── ProductList → ProductCard (×n)
│           ├── ProductDetailPage
│           │   ├── RiskBadge
│           │   ├── ReturnDisplay
│           │   └── ReturnCalculator / ComparePanel
│           ├── UserProfilePage
│           │   └── ProfileForm
│           ├── PortfolioPage
│           │   ├── PortfolioItem (×n)
│           │   └── PortfolioSummary
│           ├── RecommendationsPage
│           │   └── RecommendationList → ProductCard (×n)
│           └── NotFoundPage
```

---

## 🧠 State Management

### Context Providers

**PortfolioContext** — Global portfolio state
```js
{ portfolio, addToPortfolio, removeFromPortfolio, updateAllocation, calculatePortfolioStats }
```

**UserProfileContext** — Global user profile state
```js
{ profile, updateProfile, getRecommendations, isProfileComplete }
```

### Local useState Usage
- Filter state in `ProductListingPage`
- Form input state in `UserProfilePage` (controlled components)
- Calculator amount in `ProductDetailPage`
- Compare target selection in `ProductDetailPage`
- `added` state in `ProductCard` for button feedback

### useEffect Usage
- API fetch on mount in `AppContent`
- Sync `added` state with `isInPortfolio` prop in `ProductCard`

---

## 💰 Financial Logic

### Risk-Return Mapping (Deterministic)
```
Category     → Risk Level   → Return Range
savings      → low          → 3.2–6.7% (seeded by product ID)
investment   → medium       → 7.4–11.8%
insurance    → low          → 3.2–6.7%
crypto       → high         → 13.5–25.0%
```

### Recommendation Algorithm (Step-by-Step)
```
1. riskMapping:   conservative→[low] | moderate→[low,medium] | aggressive→[all]
2. horizonMapping: short→[short] | medium→[short,medium] | long→[all]
3. liquidityMapping: easy→[easy] | moderate→[easy,moderate] | locked→[all]
4. Budget filter: p.minInvestment <= profile.monthlyCapacity
5. Apply all filters with AND logic
6. Sort: conservative→lowest risk first | others→highest return first
```

### Portfolio Calculations
```
Total Invested     = Σ(allocatedAmount for each item)
Weighted Return    = Σ((allocation / total) × expectedReturn)
Risk Distribution  = (Σ risk-category amounts / total) × 100
```

### Filter Combination Logic (AND)
```js
passed = riskFilter.includes(p.riskLevel)
      && p.expectedReturn >= minReturn && p.expectedReturn <= maxReturn
      && categoryFilter.includes(p.category)
      && p.liquidity === liquidityFilter
      && p.timeHorizon === timeHorizonFilter
      && p.minInvestment <= maxMinInvestment
```

---

## 🔗 API Integration

**Source:** [Fake Store API](https://fakestoreapi.com/products)

**Transformation Logic:**
```
API Category         → FinTech Category → Risk   → Liquidity → Horizon
"electronics"        → "investment"     → medium → moderate  → medium
"jewelery"           → "savings"        → low    → easy      → short
"men's clothing"     → "insurance"      → low    → locked    → short
"women's clothing"   → "crypto"         → high   → easy      → long
```

Returns are assigned deterministically using `returnSeeds[riskLevel][id % length]` so the same API product always gets the same return value (no random-on-render).

**Error Handling:** A catch block sets an error state and shows a user-facing error message if the API fails.

---

## 🎨 Styling

- **100% custom CSS** — No Tailwind, Bootstrap, or any UI library
- CSS variables for theming (`--primary`, `--accent`, `--risk-low/medium/high`, etc.)
- Responsive grid layouts (mobile/tablet/desktop breakpoints at 600px and 900px)
- Risk color coding: green (low), amber (medium), red (high)

### Animations Implemented
- `fadeInUp` on page transitions and product cards
- Hover overlay reveal on ProductCard (opacity transition 0.28s)
- "Add to Portfolio" button color transition (→ green when added)
- Risk bar fill animation (0.6s cubic-bezier)
- Loading spinner

---

## 🚀 Installation & Running

```bash
# Prerequisites: Node.js 18+, a React project scaffold

# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/finnest-platform.git
cd finnest-platform

# 2. Install dependencies
npm install

# 3. Place FinTechPlatform.jsx as src/App.jsx (or import it)

# 4. Run locally
npm start

# 5. Build for production
npm run build
```

**Dependencies required:**
```json
{
  "react": "^18.x",
  "react-dom": "^18.x"
}
```
> Note: This app uses only React — no React Router (routing is simulated with useState for portability as a single .jsx file).

---

## 📂 Folder Structure

```
src/
└── FinTechPlatform.jsx    ← All components, contexts, logic, and styles
public/
└── index.html
package.json
README.md
```

---

## 🧩 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Deterministic returns (no random on re-render) | Pre-seeded return arrays indexed by `product.id % array.length` |
| Consistent financial data model from generic API | Category-mapping + risk-mapping + liquidity/horizon assignment functions |
| Portfolio weighted return recalculation | `calculatePortfolioStats` in context recomputes on every render from items array |
| Profile affecting recommendations globally | `UserProfileContext` exposes `getRecommendations(products)` called at render time |
| Button state sync when portfolio changes externally | `useEffect` watches `isInPortfolio` prop and resyncs local `added` state |

---

## 📸 Screenshots

> *(Add screenshots of: Home, Product Listing with filters, Product Detail, Profile form, Portfolio, Recommendations)*

---

## 🔮 Future Improvements

- Add localStorage persistence for profile and portfolio (bonus feature)
- Implement compound interest chart with visual graph
- Add search with debouncing
- TypeScript migration with proper interfaces
- Dark mode toggle

---

*Built with React 18 · Fake Store API · Custom CSS · No external UI libraries*
