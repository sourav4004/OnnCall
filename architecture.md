# System Architecture — OnnCall Frontend

## 1. High-Level Architectural Diagram

```
+---------------------------------------------------------------------------------+
|                                 USER INTERFACE                                  |
|   [ Mobile Viewport Wrapper: 375px - 430px Responsive Native Touch Ergonomics ]   |
+---------------------------------------------------------------------------------+
       |                      |                       |                     |
       v                      v                       v                     v
[ Screens / Views ]    [ Navigation ]         [ Overlays ]          [ Domain Cards ]
• HomeTab              • BottomNav (5 tabs)   • BottomSheet Drawer  • ProfessionalCard
• MarketplaceTab       • ViewStack Router     • Location Picker     • BookingCard
• BookingsTab          • Pro Dashboard Toggle • Emergency Hotline   • AppIcon
• InboxTab                                    • Add Address Modal
• ProfileTab
• CategoryDetailScreen
• ProProfileScreen
• BookingFlowScreen
• BookingDetailScreen
• ChatScreen
• ProDashboardScreen
       |
       +------------------------------------+
                                            |
                                            v
                        +---------------------------------------+
                        |      APPLICATION CONTEXT / STATE      |
                        |      `src/context/AppContext.tsx`     |
                        +---------------------------------------+
                        | • Categories Cache                    |
                        | • Professionals Cache                 |
                        | • Active & Past Bookings              |
                        | • Chat Threads & Unread Counts        |
                        | • Saved Addresses & Favorites         |
                        | • Real-Time Optimistic Dispatcher     |
                        +---------------------------------------+
                                            |
                                            v
                        +---------------------------------------+
                        |      API INTEGRATION ABSTRACTION      |
                        |       `src/services/api.ts`           |
                        +---------------------------------------+
                                   /                 \
                                  /                   \
        if (VITE_USE_MOCK_API == true)                 if (VITE_USE_MOCK_API == false)
                                /                       \
                               v                         v
        +-----------------------------+       +-----------------------------+
        |   Mock Data Store Engine    |       |     HTTP REST Client        |
        |   (Local Storage Synced)    |       |   `src/services/apiClient`  |
        +-----------------------------+       +-----------------------------+
                                                             |
                                                             v
                                              [ BACKEND SERVER: Node / Go / Python ]
                                              [ REST API: /api/v1/*                ]
```

---

## 2. Layer Responsibilities

### Layer 1: Presentation & Touch Ergonomics (`src/screens`, `src/components`)
- **Strict Mobile Geometry**: Adheres to touch-first target sizing ($\ge 44 \times 44\text{px}$ hitboxes).
- **Zero-Pill Typography**: Follows clean, modern typographical hierarchies without cluttered badges.
- **Micro-Interactions**: Active-scale damping (`active:scale-95`, `active:scale-98`) and backdrop blur overlays simulate iOS and Android native feel.

### Layer 2: Global State & Context (`src/context/AppContext.tsx`)
- Central source of truth for the active session.
- Handles asynchronous data fetching, optimistic UI updates (e.g. instant message sending in chat before server response), and persistent user preferences.

### Layer 3: Service Abstraction (`src/services/api.ts`)
- **Single Point of Backend Integration**: UI components NEVER call `fetch()` directly.
- All screen components invoke typed service methods like `serviceApi.createBooking()`, `serviceApi.getCategories()`, etc.
- When the backend is ready, the frontend configuration flag `VITE_USE_MOCK_API=false` sends all traffic through standard HTTP without modifying any screen components.

### Layer 4: Network Transport (`src/services/apiClient.ts`)
- Universal `fetch` wrapper with:
  - Base URL prefixing (`VITE_API_BASE_URL`).
  - Automatic `Authorization: Bearer <TOKEN>` header injection.
  - Timeout and standardized error interception.
  - JSON serialization/deserialization.

---

## 3. Data Flow Example: Creating a Booking

1. **User Action**: In `BookingFlowScreen`, customer clicks "Confirm Booking".
2. **Component Level**: Validates form fields, gathers selected package, pro, address, and payment method into a `CreateBookingPayload`.
3. **Context Dispatch**: Calls `createBooking(payload)` in `AppContext`.
4. **Service Gateway**: `serviceApi.createBooking(payload)` is invoked:
   - If `VITE_USE_MOCK_API=true`: Appends to in-memory store, persists to localStorage, simulates 300ms network latency, returns typed `Booking`.
   - If `VITE_USE_MOCK_API=false`: Sends `POST /api/v1/bookings` with payload, validates status code `201 Created`.
5. **UI Transition**: Booking is added to active state, confirmation toast fires, view router jumps user straight to `BookingDetailScreen` with active tracking enabled.
