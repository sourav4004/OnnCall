# Architecture Decision Records (ADRs) — OnnCall

This document records the architectural and technology decisions made for the OnnCall frontend codebase.

---

## ADR 001: Mobile Touch-First React SPA Architecture

- **Status**: Accepted
- **Context**: The product is an on-demand service marketplace intended for high mobile engagement. The startup plans to wrap this interface into an app shell (Capacitor/React Native Web/PWA) or serve mobile web directly.
- **Decision**: Built as a responsive React 19 application with a touch-first container layout (375px to 430px optimal viewport with smooth scaling).
- **Consequences**:
  - Eliminates desktop-only patterns (hover-dependent menus, microscopic click targets).
  - Guarantees $44\text{px}+$ touch targets, bottom thumb-reach navigation, and sliding bottom sheet drawers.

---

## ADR 002: Dual-Mode Network Client (Mock vs. Live API)

- **Status**: Accepted
- **Context**: The frontend is being built concurrently while an external backend engineering team builds the microservices/API. If the frontend uses hardcoded mock data directly inside screens, connecting to the backend later requires rewriting dozens of screen components.
- **Decision**: Implement an explicit Service Layer (`src/services/api.ts`) backed by an HTTP client (`src/services/apiClient.ts`). The behavior is controlled via `VITE_USE_MOCK_API`:
  - When `true`: Uses an in-memory & localStorage database simulating network delays.
  - When `false`: Dispatches real HTTP requests to `VITE_API_BASE_URL`.
- **Consequences**:
  - Screen components never import raw mock data; they solely consume typed service methods.
  - Zero code changes required on UI screens when switching to live backend endpoints.

---

## ADR 003: Monochromatic High-Trust Design System

- **Status**: Accepted
- **Context**: Home services require high visual trust, clarity, and rapid scanning. Flashy neon gradients or over-decorated cards distract users and convey amateurism.
- **Decision**: Implemented an intentional monochromatic palette:
  - Deep black `#111111` for high-intent actions and typography.
  - Subtle surfaces `#F5F5F5` and hairline borders `#E5E5E5`.
  - Semantic indicators restricted to `#1E7A34` (verified & available) and `#C23B3B` (emergency & cancellation).
- **Consequences**: Matches Apple Human Interface Guidelines and premium service platforms (Uber, Urban Company).

---

## ADR 004: Optimistic UI for Messaging and Order Tracking

- **Status**: Accepted
- **Context**: When a customer sends a message or books a technician, waiting for roundtrip HTTP latency can make the mobile app feel sluggish.
- **Decision**: Messages and booking updates are dispatched optimistically to the local state, followed by asynchronous sync to the server.
- **Consequences**: Instant feedback for the user, with automatic error reversion if network calls fail.

---

## ADR 005: Customer and Partner Perspective Co-existence

- **Status**: Accepted
- **Context**: In an early-stage startup, demonstrating the full two-sided marketplace loop (Customer Booking $\rightarrow$ Worker Acceptance $\rightarrow$ Navigation $\rightarrow$ Payouts) is vital for user research and stakeholder presentations.
- **Decision**: Implemented a built-in "Switch to Partner View" mode in the Profile tab without requiring a separate web codebase.
- **Consequences**: Allows testing and verifying both sides of the marketplace contract within the same development build.
