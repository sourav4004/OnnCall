# Changelog — OnnCall Application

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-08

### Added
- **Core Architecture & Service Layer**:
  - Implemented `apiClient.ts` with auto-bearer auth headers and standard API envelope parsing.
  - Implemented `api.ts` supporting dual-mode operation (`VITE_USE_MOCK_API="true"` vs `"false"`).
  - Created global `AppContext.tsx` for state management, optimistic updates, and persistent user preferences.
- **Service Categories & Catalog**:
  - Full service taxonomy: Painter, Carpenter, Plumber, Electrician, AC Repair, Home Deep Cleaning, Pest Control, Salon & Grooming.
  - Transparent itemized rate cards with durations, pricing, and rework warranties.
- **Discovery & Marketplace**:
  - Home feed with quick booking shortcuts, active appointment cards, and category tiles.
  - Marketplace search with filters: category, 4.8+ ratings, nearby distance, and "Available Today" toggles.
  - Verified professional profiles with experience badges, skills tags, and customer testimonials.
- **Booking Checkout Engine**:
  - 4-step wizard: Package Selection $\rightarrow$ Professional Assignment $\rightarrow$ Schedule & Slot $\rightarrow$ Address & Payment.
  - Support for multiple payment methods: UPI, Card, and Cash After Service.
- **Live Order Milestone Tracker**:
  - 6-stage service tracking timeline with interactive steps.
  - Reschedule and cancelation actions with instant feedback.
  - Post-service star rating and written reviews with receipt downloading simulation.
- **In-App Messaging & Notifications**:
  - Real-time chat client between customer and assigned technician with auto-replies.
  - Slide-up notification drawer for booking confirmations and updates.
- **Partner Dashboard (Pro Mode)**:
  - Toggle online/offline dispatch status.
  - Accept and decline nearby incoming job requests.
  - Route navigation hook and weekly payout analytics.
- **Comprehensive Startup Documentation**:
  - `README.md`, `project_context.md`, `architecture.md`, `api.md`, `database.md`, `decisions.md`, `changelog.md`, and `.env.example`.
