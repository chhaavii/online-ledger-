# 🌸 Taipei EasyCard ATM & Double-Entry Ledger Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-19.0-black?logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite&logoColor=646CFF)](https://vitejs.dev/) [![Express](https://img.shields.io/badge/Express-4.21-green?logo=express&logoColor=000000)](https://expressjs.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![PostgreSQL](https://img.shields.io/badge/Postgres-Neon-336791?logo=postgresql&logoColor=white)](https://neon.tech/) [![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

**An interactive, anime cyberpunk-inspired Taipei EasyCard ATM Terminal & Double-Entry Accounting Engine**

[Features](#-features) • [Live Site](#live-site) • [Installation](#-installation) • [API](#-api-endpoints) • [Contributing](#-contributing)

---

[![Demo GIF](https://github.com/chhaavii/online-ledger-/raw/main/demo.gif)](/chhaavii/online-ledger-/blob/main/demo.gif)

Designed for **Player CHHAVI**, this application combines tactile hardware interactions (physical card slot insertion, thermal paper receipt printing with drag-to-tear animations, Web Audio synthesized sound effects) with a **mathematically rigorous double-entry bookkeeping engine, built on the same accounting principles GAAP sits on top of**.

---

## Live Site

- <https://online-ledger.vercel.app/>

---

## ✨ Features

### 🎮 Interactive ATM Experience
- **Physical Card Insertion**: Drag your EasyCard into the illuminated card reader slot
- **Thermal Receipt Printing**: Watch receipts print with realistic animations
- **Drag-to-Tear**: Physically tear off receipts with satisfying audio feedback
- **Web Audio Synthesis**: Zero-dependency sound effects (card swipe, printer, paper tear, clicks)

### 📊 Double-Entry Accounting Engine
- **GAAP-Compliant**: Built on the same accounting principles as professional bookkeeping
- **Automatic Categorization**: Longest-match keyword algorithm for smart expense categorization
- **Trial Balance Verification**: Ensures debits always equal credits (Δ < 0.001)
- **Roommate IOU Tracking**: Track fronted expenses and one-click reimbursement settlements

### 🎨 Cyberpunk UI/UX
- **Anime Night Market Theme**: Immersive Taipei cyberpunk aesthetic
- **Animated Intro Screen**: Flying credit card 3D orbit animation
- **HUD Navigation**: Player stats drawer with level progression
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Highlights
- **TypeScript**: Full type safety across the codebase
- **React 19**: Latest React features and performance
- **Vite 6**: Lightning-fast HMR and optimized builds
- **Express API**: RESTful endpoints with idempotency protection
- **PostgreSQL Database**: Serverless Postgres (via Neon), accessed through Prisma ORM with the `@prisma/adapter-pg` driver adapter

> **Why Postgres instead of a local JSON file?** This project originally used a JSON file (`data/db.json`) for storage. It was migrated to PostgreSQL because serverless platforms like Vercel have ephemeral, read-only filesystems — local file writes don't reliably persist between requests in production. This mirrors why real financial systems avoid file-based storage for transactional data.

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- A PostgreSQL database (this project uses [Neon](https://neon.tech), free tier)

### Clone the Repository
```
git clone https://github.com/chhaavii/online-ledger-.git
cd online-ledger-
```

### Install Dependencies
```
npm install
```

### Environment Setup
```
cp .env.example .env
```
Add your PostgreSQL connection string to `.env`:
```
DATABASE_URL="postgresql://user:password@your-neon-host/dbname?sslmode=require"
```

### Sync the Database Schema
```
npx prisma generate
npx prisma db push
```

### Start Development Server
```
npm run dev
```
The application will be available at `http://localhost:3000`

---

## 🛠️ Development

```
# Start development server (Port 3000 with Express + Vite)
npm run dev

# Run TypeScript type check
npm run lint

# Build production bundle (Vite frontend + esbuild server bundle)
npm run build

# Start production server
npm run start

# Clean build artifacts
npm run clean
```

---

## 📁 Directory & File Structure

```text
├── server/
│   ├── dataStore.ts            # Prisma-backed data layer (async) with idempotency
│   └── prisma.ts               # PrismaClient instance using the pg driver adapter
├── prisma/
│   └── schema.prisma           # Database schema (Transaction, Keyword models)
├── prisma.config.ts            # Prisma CLI config (schema path, migrations, datasource)
├── server.ts                   # Express 5 server with async API routes & Vite middleware
├── src/
│   ├── assets/                 # Background image assets
│   ├── components/
│   │   ├── AtmMachine.tsx              # Interactive physical ATM terminal & thermal printer dispenser
│   │   ├── BarcodeStrip.tsx            # Category spectral barcode visualization
│   │   ├── IntroScreen.tsx             # Anime cyberpunk intro splash screen & startup animation
│   │   ├── KeywordManagerModal.tsx     # Keyword auto-categorization manager & live playground
│   │   ├── ReceiptCard.tsx             # Reusable thermal receipt card item component
│   │   ├── RoommateIouPanel.tsx        # Roommate fronted expense & IOU settlement tracker
│   │   ├── Sidebar.tsx                 # HUD navigation menu & player stats drawer
│   │   ├── StatsOverview.tsx           # Key metrics summary dashboard cards
│   │   ├── TransactionRoll.tsx         # Continuous thermal receipt roll transaction history
│   │   └── TrialBalanceModal.tsx       # Double-entry trial balance modal
│   ├── utils/
│   │   └── audioEffects.ts             # Web Audio API sound synthesizer (card, printer, tear, clicks)
│   ├── App.tsx                         # Main application layout, state manager & router
│   ├── index.css                       # Global Tailwind CSS stylesheet
│   ├── ledgerEngine.ts                 # Double-entry calculation & keyword matching logic
│   ├── main.tsx                        # React application DOM root entry point
│   └── types.ts                        # Shared TypeScript interface & type definitions
├── .env.example                        # Environment variable definitions
├── metadata.json                       # Application metadata & frame permissions
├── package.json                        # Dependencies & build scripts
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite build configuration
```

---

## ⚙️ Core Modules & Functions Documentation

### 1. Double-Entry Accounting Ledger (`src/ledgerEngine.ts`)

- **`categorizeDescription(desc: string, keywords: KeywordPair[]): string`**
  * **Strategy:** Longest-Keyword Match First.
  * **Logic:** Sorts all rule keywords by length descending before checking containment. Ensures specific phrases like `"night market"` match `"Dining Out"` before shorter generic keywords like `"market"` match `"Groceries"`.
  * **Fallback:** Returns `"General"` if no rule matches.

- **`computeLedger(transactions: Transaction[]): LedgerSummary`**
  * Calculates balanced double-entry ledger entries following standard debit/credit bookkeeping rules:
    + **Personal Spend (`Mine`):** Debit `Expense:{Category}`, Credit `Cash`
    + **Roommate Fronted (`Roommate`):** Debit `Roommate Receivable`, Credit `Cash`
    + **Roommate Reimbursement Settled (`reimbursed = true`):** Debit `Cash`, Credit `Roommate Receivable`
  * **Returns:** Sum of total debits, total credits, account balances, equilibrium verification status (Δ < 0.001), and spending metrics.

### 2. Database Layer (`server/prisma.ts` & `server/dataStore.ts`)

- **`server/prisma.ts`** — Instantiates a single shared `PrismaClient`, connected via the `@prisma/adapter-pg` driver adapter using the `DATABASE_URL` environment variable (loaded through `dotenv/config`).

- **`ensureSeeded()`** — Runs once per server instance. If the `Transaction` or `Keyword` tables are empty, seeds them with default sample data (7-Eleven, MRT, YouBike, PX Mart, etc.) so the app has usable data on first run.

- **`addTransaction(txData)`** *(async)* — Checks for duplicate submissions via `idempotencyKey`, auto-categorizes the description if no category is provided, and inserts the row into Postgres.

- **`updateTransaction(id, updates)`** *(async)* — Supports partial updates (e.g. toggling `reimbursed`, or editing `category`/`desc`).

- **`deleteTransaction(id)`** *(async)* — Removes a transaction row by ID.

- **`getTransactions()` / `getKeywords()` / `setKeywords()`** *(async)* — Read/write helpers backed by Prisma queries instead of file I/O.

All data-layer functions are asynchronous; API route handlers in `server.ts` `await` them accordingly.

#### REST API Endpoints:

| Endpoint                | Method   | Description                                                       |
| ----------------------- | -------- | ------------------------------------------------------------------|
| `/api/transactions`     | `GET`    | Fetches all recorded transactions sorted chronologically.         |
| `/api/transactions`     | `POST`   | Records a new transaction with idempotency protection.            |
| `/api/transactions/:id` | `PATCH`  | Updates a transaction (e.g., toggle reimbursement).               |
| `/api/transactions/:id` | `DELETE` | Deletes a transaction from the ledger.                            |
| `/api/keywords`         | `GET`    | Retrieves all auto-categorization keyword rules.                  |
| `/api/keywords`         | `PUT`    | Updates keyword rules array.                                      |
| `/api/ledger`           | `GET`    | Computes and returns full double-entry ledger trial balance data. |
| `/api/health`           | `GET`    | Server health check endpoint.                                     |

### 3. Frontend Components (`src/components/`)

- **`AtmMachine.tsx`** — Tactile card insertion (drag into the illuminated reader slot), animated thermal receipt dispensing with drag-to-tear interaction, and the transaction entry form (amount, description, date, owner).
- **`TransactionRoll.tsx`** — Renders transaction history as a continuous, stacked thermal paper roll with category filtering, search, reimbursement toggle, and deletion.
- **`BarcodeStrip.tsx`** — Interactive barcode-style spending breakdown by category.
- **`RoommateIouPanel.tsx`** — Tracks fronted expenses and provides one-click settlement.
- **`TrialBalanceModal.tsx`** — Shows the double-entry trial balance (Debits = Credits), account balances, and itemized journal entries.
- **`KeywordManagerModal.tsx`** — Rule editor for keyword-to-category auto-categorization, with a live test playground.
- **`IntroScreen.tsx`** — Anime Taipei cyberpunk splash screen with startup animation and sound toggle.
- **`Sidebar.tsx`** — HUD navigation with player stats and audio controls.

### 4. Audio Effects Synthesizer (`src/utils/audioEffects.ts`)

Uses the browser's native **Web Audio API** (`AudioContext`) for zero-dependency sound:
- **`playCardInsertSound()`** — Dual-frequency sine sweep simulating a magnetic card slide.
- **`playPrintReceiptSound()`** — Pulsed square wave simulating thermal printer whirring.
- **`playPaperTearSound()`** — Bandpass-filtered white noise simulating paper tearing.
- **`playClickSound()`** — Short sine click for button feedback.

---

## 🧮 Double-Entry Accounting Logic

### Personal Expenses (`Mine`)
```
Debit:  Expense:{Category}
Credit: Cash
```

### Roommate Fronted Expenses (`Roommate`)
```
Debit:  Roommate Receivable
Credit: Cash
```

### Reimbursement Settlement
```
Debit:  Cash
Credit: Roommate Receivable
```

### Trial Balance
The system automatically verifies that total debits equal total credits within floating-point tolerance (Δ < 0.001).

---

## 🎯 Usage Examples

### Adding a Transaction
```
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2026-07-23',
    amount: 150,
    desc: '7-Eleven lunch',
    whose: 'Mine',
    category: 'Dining Out',
    idempotencyKey: 'unique-key-123'
  })
});
```

### Auto-Categorization
```
import { categorizeDescription } from './ledgerEngine';

const keywords = [
  ['7-Eleven', 'Groceries'],
  ['night market', 'Dining Out']
];

const category = categorizeDescription('night market snacks', keywords);
// Returns: 'Dining Out' (longest match wins)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (TypeScript, Prettier)
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is open source and available under the [MIT License](https://github.com/chhaavii/online-ledger-/blob/main/LICENSE).

---

## 👤 Author

**Made by Chhavi** 😊

- GitHub: [@chhaavii](https://github.com/chhaavii)
- Project Link: <https://github.com/chhaavii/online-ledger->

---

## 🙏 Acknowledgments

- Inspired by Taipei's night market culture and EasyCard system
- Built with modern web technologies (React, Vite, TypeScript, Prisma, PostgreSQL)
- Double-entry accounting principles based on GAAP standards

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the existing documentation
- Review the API endpoints section

---

**⭐ If you like this project, please give it a star! ⭐**

Made with ❤️ by Chhavi
