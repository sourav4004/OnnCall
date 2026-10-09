# Project Context — OnnCall Startup Platform

## 1. Executive Summary & Vision

**OnnCall** is a modern, high-trust on-demand home services marketplace designed to connect homeowners and tenants with background-verified local service professionals—such as painters, plumbers, carpenters, electricians, HVAC technicians, deep cleaners, and pest control specialists.

The platform eliminates the frustration of unpredictable pricing, delayed technicians, unverified handymen, and lack of accountability by providing:
1. **Upfront Standard Pricing**: Fixed packages with transparent labor and material costs.
2. **Quality & Safety Assurance**: 100% Aadhaar/police background checks and a 30-day rework warranty.
3. **End-to-End Real-Time Visibility**: 6-stage milestone tracker (Confirmed → Assigned → On the Way → Arrived → In Progress → Completed).
4. **Direct Channel**: In-app secure communication between customer and assigned technician without exposing private phone numbers if preferred.
5. **Worker Empowerment**: A dedicated "Partner Mode" allowing local technicians to access nearby job leads, accept work, navigate to addresses, and receive automated payouts.

---

## 2. Target Personas

### Persona A: Urban Homeowner / Tenant ("The Customer")
- **Pain Points**: Leaking pipes causing wall dampness, seeking reliable room painting before a festival, uncoordinated furniture assembly, hidden service fees.
- **Goals**: Rapid booking under 60 seconds, punctual arrival, guaranteed workmanship, clean upfront pricing, cashless digital payments.

### Persona B: Service Professional ("The Partner / Technician")
- **Pain Points**: Inconsistent daily job flow, dependency on middlemen, delayed customer payments, scheduling chaos.
- **Goals**: Consistent high-paying nearby service leads, flexible working hours (toggle online/offline), instant wallet payouts, clear navigation coordinates.

---

## 3. Product Scope & Functional Modules

| Module | Purpose | Status in Frontend |
| :--- | :--- | :--- |
| **Discovery Feed** | Home landing with instant search, top categories, popular packages, nearby pros | ✅ Fully Implemented |
| **Marketplace** | Filterable by category, distance, rating, and availability today | ✅ Fully Implemented |
| **Pro Profiles** | Bio, specializations, verified badge, ratings count, response speed | ✅ Fully Implemented |
| **Booking Checkout** | 4-step wizard: Package Selection → Scheduling → Address → Payment | ✅ Fully Implemented |
| **Order Tracking** | Live 6-stage status timeline, receipt downloads, cancel & reschedule actions | ✅ Fully Implemented |
| **Messaging** | Direct chat thread with assigned technician | ✅ Fully Implemented |
| **Customer Portal** | Saved addresses, favorite pros, notifications drawer, emergency hotline | ✅ Fully Implemented |
| **Partner Portal** | Job lead requests (Accept/Decline), navigation hook, payout dashboard | ✅ Fully Implemented |
| **Backend Integration Layer** | `apiClient` + `api.ts` with transparent mock-or-live switch | ✅ Fully Implemented |

---

## 4. Key Business Metrics & Value Proposition

- **Average Time to Book**: < 90 seconds.
- **Fulfillment SLA**: Within 30 minutes for urgent plumbers/electricians; custom scheduled slots for painting/carpentry.
- **Warranty**: 30-day customer satisfaction guarantee.
- **Platform Monetization**: Flat convenience fee (₹20) + 12-18% platform commission on completed partner invoices.
