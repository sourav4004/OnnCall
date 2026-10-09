# OnnCall — Production-Ready On-Demand Home Services Frontend

OnnCall is a mobile-first, enterprise-grade on-demand service marketplace frontend built with React 19, TypeScript, Vite, and Tailwind CSS. The interface was engineered specifically for rapid, seamless integration with backend engineering teams.

## 🚀 Key Highlights & Architectural Features

- **Decoupled API Client Architecture**: All network calls, API methods, models, and mock/live fallbacks are routed through `src/services/api.ts` and `src/services/apiClient.ts`.
- **Environment Driven (`VITE_USE_MOCK_API`)**:
  - `VITE_USE_MOCK_API="true"`: Runs the application hermetically with in-memory persistence and localStorage synchronization. Perfect for QA, mobile app demos, investor pitching, and standalone testing.
  - `VITE_USE_MOCK_API="false"`: Automatically sends real HTTP REST requests to `VITE_API_BASE_URL` with bearer token auth headers and standard JSON payloads.
- **Strict TypeScript Schemas**: Complete typing coverage across domain entities: `ServiceCategory`, `Professional`, `Booking`, `Address`, `ChatThread`, `AppNotification`, and `ApiResponse<T>`.
- **Mobile Touch-First Design System**: Follows Apple Human Interface Guidelines and Material You touch ergonomics ($44\text{px}+$ touch hitboxes, bottom thumb-nav zone, responsive bottom sheets, and native-feeling transitions).
- **Dual Perspective Engine**:
  - **Customer Portal**: Browse categories (Painter, Plumber, Carpenter, AC, etc.), view verified professional profiles, configure multi-step bookings, track real-time 6-stage service milestones, direct chat, and leave post-service ratings.
  - **Partner / Professional Mode**: Dedicated dashboard for technicians to toggle online/offline dispatch status, review & accept leads, inspect navigation coordinates, and track weekly earnings.

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── README.md                 # Project introduction and quickstart
├── project_context.md        # Startup vision, target users, and domain context
├── architecture.md           # High-level architecture, state flow & layers
├── api.md                    # REST API contracts, endpoints & request/response specs
├── database.md               # Backend database relational schema & indexes
├── decisions.md              # Architectural Decision Records (ADRs)
├── changelog.md              # Versioned release & feature history
├── metadata.json             # AI Studio applet configuration
├── package.json              # Dependencies and scripts
├── src/
│   ├── components/           # Reusable UI primitives
│   │   ├── AppIcon.tsx       # Standard icon mapping
│   │   ├── BottomNav.tsx     # 5-tab mobile navigation bar
│   │   ├── BottomSheet.tsx   # Native mobile drawer overlay
│   │   ├── BookingCard.tsx   # Order status & timeline preview
│   │   ├── HeaderBar.tsx     # Standard app top bar
│   │   └── ProfessionalCard.tsx # Service worker profile card
│   ├── context/              # Centralized application state
│   │   └── AppContext.tsx    # Global state management & real-time dispatcher
│   ├── screens/              # Core screen modules
│   │   ├── HomeTab.tsx       # Discovery feed, quick utilities, popular services
│   │   ├── MarketplaceTab.tsx# Advanced search, filtering & sorting
│   │   ├── BookingsTab.tsx   # Active and historical appointments
│   │   ├── InboxTab.tsx      # Conversation list
│   │   ├── ProfileTab.tsx    # User settings, addresses, help
│   │   ├── CategoryDetailScreen.tsx # Category packages & rate cards
│   │   ├── ProProfileScreen.tsx     # Technician bio, metrics & reviews
│   │   ├── BookingFlowScreen.tsx    # 4-step checkout & payment
│   │   ├── BookingDetailScreen.tsx  # Live 6-stage timeline tracker & review
│   │   ├── ChatScreen.tsx           # Direct messaging client
│   │   └── ProDashboardScreen.tsx   # Partner mode for technicians
│   ├── services/             # Network & API integration layer
│   │   ├── apiClient.ts      # HTTP wrapper with auth token handling
│   │   └── api.ts            # Concrete service calls (Categories, Bookings, etc.)
│   ├── types/                # Strongly typed domain models
│   │   └── index.ts          # Centralized interfaces & API payloads
│   ├── App.tsx               # Root view router & sheet manager
│   ├── index.css             # Tailwind 4 baseline & typography
│   └── main.tsx              # React DOM mounting
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```

Configure your environment parameters:
```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
VITE_USE_MOCK_API="true"
```

### 3. Install & Run Dev Server
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

---

## 🤝 For the Backend Engineering Team

1. Read **`api.md`** to verify all endpoint signatures, URL parameters, and JSON payloads.
2. Read **`database.md`** to mirror PostgreSQL tables, enums, foreign keys, and indexes.
3. When ready to test with your live server, simply update:
   ```env
   VITE_USE_MOCK_API="false"
   VITE_API_BASE_URL="https://api.yourbackend.com/api/v1"
   ```
   No changes to UI components will be required!
