# API Contracts & Endpoint Specifications — OnnCall

This document defines the RESTful HTTP API contracts expected by the OnnCall frontend. The backend team should follow these paths, request schemas, and response formats to guarantee 100% plug-and-play compatibility.

- **Base URL**: `https://api.yourdomain.com/api/v1` (configured via `VITE_API_BASE_URL`)
- **Content-Type**: `application/json`
- **Authentication**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Standard Response Envelope

All API endpoints return JSON conforming to the standard wrapper:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation message",
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Resource validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "timeSlot", "issue": "Requested slot is no longer available" }
    ]
  }
}
```

---

## 2. Service Categories & Offerings

### `GET /api/v1/categories`
Retrieves all active service categories with package rate cards.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "painter",
      "name": "Painter",
      "icon": "paint",
      "tagline": "Interior, exterior, waterproofing & stencil painting",
      "startingPrice": 599,
      "services": [
        {
          "id": "p-room",
          "name": "Full Room Painting",
          "desc": "Walls, ceiling, primer + 2 coats premium emulsion",
          "price": 1499,
          "duration": "1 day"
        }
      ]
    }
  ]
}
```

---

## 3. Professionals & Matching

### `GET /api/v1/professionals`
Returns verified service technicians.

#### Query Parameters:
- `category` (optional, string): e.g. `painter`, `plumber`, `carpenter`
- `availableToday` (optional, boolean): `true` or `false`
- `maxDistance` (optional, number): in kilometers
- `minRating` (optional, number): e.g. `4.5`
- `search` (optional, string): query term

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "pro-painter-1",
      "name": "Amit Verma",
      "role": "Master Painter & Wall Artist",
      "catId": "painter",
      "rating": 4.9,
      "reviewsCount": 312,
      "completedJobs": 420,
      "distanceKm": 1.2,
      "experienceYears": 9,
      "hourlyRate": 499,
      "isAvailableToday": true,
      "locality": "South Extension, Delhi",
      "languages": ["Hindi", "English"],
      "isVerified": true,
      "responseTime": "8 min",
      "bio": "Asian Paints certified master applicator...",
      "skills": ["Interior Emulsion", "Texture Stencil", "PU Wood Polish"]
    }
  ]
}
```

---

## 4. Bookings Management

### `GET /api/v1/bookings`
Returns current user's booking history.

#### Query Parameters:
- `status` (optional): `confirmed` | `in_progress` | `completed` | `cancelled`

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "OC-94821",
      "catId": "painter",
      "serviceId": "p-room",
      "serviceName": "Full Room Painting",
      "proId": "pro-painter-1",
      "proName": "Amit Verma",
      "proRole": "Master Painter & Wall Artist",
      "date": "Tomorrow, Oct 9",
      "timeSlot": "10:00 AM",
      "address": {
        "id": "addr-home",
        "label": "Home",
        "type": "home",
        "line1": "Flat 402, Block B, Silver Oak Residency, Saket",
        "city": "New Delhi",
        "pincode": "110017"
      },
      "status": "confirmed",
      "price": 1499,
      "platformFee": 20,
      "paymentMethod": "upi",
      "createdAt": "Today, 02:40 PM",
      "timelineStep": 1
    }
  ]
}
```

### `POST /api/v1/bookings`
Creates a new service booking.

#### Request Body:
```json
{
  "catId": "painter",
  "serviceId": "p-room",
  "serviceName": "Full Room Painting",
  "proId": "pro-painter-1",
  "proName": "Amit Verma",
  "proRole": "Master Painter",
  "date": "Tomorrow, Oct 9",
  "timeSlot": "10:00 AM",
  "addressId": "addr-home",
  "paymentMethod": "upi",
  "price": 1499
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "OC-89214",
    "status": "confirmed",
    "timelineStep": 1,
    "createdAt": "2026-10-08T10:48:00Z"
  },
  "message": "Booking confirmed successfully"
}
```

### `PATCH /api/v1/bookings/:id/cancel`
Cancels an existing booking.

#### Request Body:
```json
{
  "reason": "Customer requested change of plan"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": { "id": "OC-89214", "status": "cancelled" }
}
```

### `POST /api/v1/bookings/:id/reviews`
Submits post-service rating and testimonial.

#### Request Body:
```json
{
  "rating": 5,
  "comment": "Amit was punctual, taped up all the switches neatly, and finished in a single day."
}
```

---

## 5. In-App Messaging & Chats

### `GET /api/v1/chats`
Returns active conversation threads.

### `GET /api/v1/chats/:proId/messages`
Returns conversation history between user and specified technician.

### `POST /api/v1/chats/:proId/messages`
Sends a new message.

#### Request Body:
```json
{
  "text": "Hello, could you bring extra plastic drop sheets for our sofa?"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "msg-8821",
    "sender": "user",
    "text": "Hello, could you bring extra plastic drop sheets for our sofa?",
    "timestamp": "Just now"
  }
}
```

---

## 6. Partner Mode / Service Provider Operations

### `PATCH /api/v1/partners/status`
Toggle online/offline dispatch status.

#### Request Body:
```json
{ "isOnline": true }
```

### `POST /api/v1/partners/leads/:leadId/accept`
Technician accepts a nearby service lead.

### `POST /api/v1/partners/leads/:leadId/decline`
Technician declines a lead.
