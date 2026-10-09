# Relational Database Schema — OnnCall (PostgreSQL)

This document provides the recommended PostgreSQL database schema, data types, foreign key constraints, and performance indexes for the backend engineering team.

---

## 1. Entity Relationship Diagram (ERD) Overview

```
 [ users ]
    | (1)
    |-----------------------+
    | (N)                   | (N)
 [ addresses ]          [ bookings ] (N) ----- (1) [ professionals ]
    |                       |                             |
    | (1)                   | (1)                         | (N)
    |                       | (1)                      [ reviews ]
    +-----------------------+                         
    |
 [ chat_messages ] (N) ----- (1) [ chat_threads ]
```

---

## 2. Table Definitions (DDL)

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('customer', 'professional', 'admin');
CREATE TYPE booking_status AS ENUM ('confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cash');
CREATE TYPE address_type AS ENUM ('home', 'work', 'other');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role DEFAULT 'customer',
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Customer Saved Addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL, -- e.g. 'Home', 'Studio'
    type address_type DEFAULT 'home',
    line1 TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Service Categories (e.g. Painter, Plumber, Carpenter)
CREATE TABLE service_categories (
    id VARCHAR(50) PRIMARY KEY, -- 'painter', 'plumber', 'carpenter'
    name VARCHAR(100) NOT NULL,
    icon_key VARCHAR(50) NOT NULL,
    tagline TEXT NOT NULL,
    starting_price DECIMAL(10, 2) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Service Packages / Rate Card Offerings
CREATE TABLE service_offerings (
    id VARCHAR(50) PRIMARY KEY, -- 'p-room', 'pl-leak'
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Service Professionals (Technicians / Partners)
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    primary_category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    experience_years INT DEFAULT 1,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    locality VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_available_today BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    response_time VARCHAR(50) DEFAULT '10 min',
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    languages VARCHAR(50)[] DEFAULT '{Hindi,English}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bookings (Customer Orders)
CREATE TABLE bookings (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'OC-94821'
    customer_id UUID NOT NULL REFERENCES users(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id),
    service_id VARCHAR(50) NOT NULL REFERENCES service_offerings(id),
    service_name VARCHAR(150) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_slot VARCHAR(50) NOT NULL,
    address_id UUID NOT NULL REFERENCES addresses(id),
    status booking_status DEFAULT 'confirmed',
    timeline_step INT DEFAULT 1, -- 0..5
    base_price DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 20.00,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method payment_method DEFAULT 'upi',
    is_paid BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Reviews and Ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(20) UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Real-time Messaging (Chat Threads & Messages)
CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (customer_id, professional_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_type VARCHAR(10) CHECK (sender_type IN ('user', 'pro')),
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. High-Performance Indexes

```sql
-- Fast lookup of customer addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Filter professionals by category and availability
CREATE INDEX idx_professionals_category ON professionals(primary_category_id);
CREATE INDEX idx_professionals_available ON professionals(is_available_today);

-- Fast booking retrieval for customer and partner views
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Message queries
CREATE INDEX idx_chat_messages_thread ON chat_messages(thread_id, created_at DESC);
```
