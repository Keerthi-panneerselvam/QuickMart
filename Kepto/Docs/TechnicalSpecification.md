# QuickMart - Technical Specification Document

**Version:** 1.0  
**Last Updated:** October 2025  
**Project Type:** Grocery Delivery Application  
**Delivery Promise:** 7-8 Minutes  
**Platform:** Web & Mobile

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Architecture](#2-system-architecture)
3. [Database Design](#3-database-design)
4. [API Specifications](#4-api-specifications)
5. [Screen Specifications & User Flows](#5-screen-specifications--user-flows)
6. [Technology Stack](#6-technology-stack)
7. [Security Considerations](#7-security-considerations)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. System Overview

### 1.1 Project Description

QuickMart is a rapid grocery delivery platform inspired by Zepto, offering delivery within 7-8 minutes. The system enables users to browse products, manage carts, place orders, and track deliveries in real-time. The application is built using modern microservices architecture with a focus on scalability, performance, and user experience.

### 1.2 Key Features

- Ultra-fast 7-minute delivery promise
- Location-based product availability
- Real-time inventory management
- Multiple payment methods including CRED Pay integration
- Order tracking and management
- Dynamic pricing and offers system
- Multi-category product catalog (15+ main categories)
- OTP-based authentication
- Saved addresses and wishlist
- Admin dashboard for order fulfillment

### 1.3 Target Platforms

**Customer App**
- Platform: Web & Mobile
- Technology: React TypeScript with mobile-first responsive design

**Admin Dashboard**
- Platform: Web
- Technology: React TypeScript
- Purpose: Order management, inventory control, analytics

**Backend Services**
- Technology: Spring Boot Microservices with Java 17
- Architecture: Event-driven microservices

**Delivery Partner App**
- Platform: Mobile (iOS & Android)
- Technology: React Native

---

## 2. System Architecture

### 2.1 Architecture Pattern

**Microservices Architecture with Event-Driven Communication**

```
┌─────────────────────────────────────────┐
│         API Gateway (Spring Cloud)      │
│   - Authentication & Authorization      │
│   - Rate Limiting                       │
│   - Load Balancing                      │
└──────────────────┬──────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐    ┌───▼────┐    ┌───▼─────┐
│  User  │    │Product │    │  Order  │
│Service │    │Service │    │ Service │
└───┬────┘    └───┬────┘    └────┬────┘
    │             │              │
    │    ┌────────┼──────────┐   │
    │    │        │          │   │
┌───▼────▼──┐ ┌──▼────┐ ┌───▼───▼───┐
│  Payment  │ │Location│ │Notification│
│  Service  │ │Service │ │  Service  │
└─────┬─────┘ └───┬────┘ └─────┬─────┘
      │           │            │
      └───────────┴────────────┘
                  │
         ┌────────▼─────────┐
         │  Message Queue   │
         │ (Apache Kafka)   │
         └──────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐        ┌──────▼──────┐
│ PostgreSQL │        │    Redis    │
│ (Primary)  │        │  (Caching)  │
└────────────┘        └─────────────┘
```

### 2.2 Microservices Breakdown

**User Service**
- Authentication and authorization (OTP-based login)
- User profile management
- Address management (CRUD operations)
- Wishlist management
- Free cash balance tracking
- User preferences and settings

**Product Service**
- Product catalog management
- Category and subcategory management
- Product search with Elasticsearch
- Inventory management
- Product recommendations
- Trending products by location
- Brand-wise product listing

**Order Service**
- Shopping cart management (add, update, remove items)
- Order placement and validation
- Order status tracking
- Order history
- Reorder functionality
- Order cancellation and refunds
- Delivery time estimation

**Payment Service**
- Razorpay integration for payment processing
- CRED Pay integration
- Payment verification and webhook handling
- Refund processing
- Transaction history
- Multiple payment methods support
- Payment retry mechanism

**Notification Service**
- Push notifications (Firebase Cloud Messaging)
- SMS notifications (Twilio)
- Email notifications
- Order status updates
- Promotional notifications
- In-app notifications

**Location Service**
- Geolocation and reverse geocoding
- Delivery zone management
- Service area validation
- Store-to-customer distance calculation
- Delivery partner routing
- Real-time location tracking

### 2.3 Communication Patterns

**Synchronous Communication:**
- REST APIs for client-to-service communication
- Service-to-service communication via API Gateway

**Asynchronous Communication:**
- Apache Kafka for event-driven architecture
- Event topics: order.placed, payment.completed, order.delivered, inventory.updated
- Saga pattern for distributed transactions

---

## 3. Database Design

### 3.1 Database Strategy

**Pattern:** Database per Service  
**Primary Database:** PostgreSQL (ACID compliance)  
**Caching Layer:** Redis  
**Search Engine:** Elasticsearch

### 3.2 Core Tables

#### 3.2.1 Users Table (User Service)

```sql
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255),
    free_cash_balance DECIMAL(10, 2) DEFAULT 0.00,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
```

#### 3.2.2 Products Table (Product Service)

```sql
CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    subcategory_id BIGINT,
    brand VARCHAR(100),
    mrp_price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    quantity_unit VARCHAR(50),
    image_urls TEXT[],
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    inventory_count INTEGER DEFAULT 0,
    delivery_time_mins INTEGER DEFAULT 7,
    store_id BIGINT,
    is_returnable BOOLEAN DEFAULT FALSE,
    product_highlights TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (subcategory_id) REFERENCES categories(category_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_available ON products(is_available);
```

#### 3.2.3 Categories Table (Product Service)

```sql
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(500),
    display_order INTEGER,
    parent_category_id BIGINT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

CREATE INDEX idx_categories_parent ON categories(parent_category_id);
```

#### 3.2.4 Orders Table (Order Service)

```sql
CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    delivery_address_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_id VARCHAR(100),
    offer_code VARCHAR(50),
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    delivery_partner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(address_id)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
```

**Order Status Values:**
- PENDING
- CONFIRMED
- PACKED
- DISPATCHED
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
- REFUNDED

#### 3.2.5 Order Items Table (Order Service)

```sql
CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

#### 3.2.6 Addresses Table (User Service)

```sql
CREATE TABLE addresses (
    address_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_type VARCHAR(20) NOT NULL,
    house_no VARCHAR(50),
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200),
    landmark VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses(latitude, longitude);
```

**Address Type Values:** HOME, WORK, OTHER

#### 3.2.7 Cart Table (Order Service)

```sql
CREATE TABLE cart (
    cart_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_user ON cart(user_id);
```

#### 3.2.8 Offers Table (Payment Service)

```sql
CREATE TABLE offers (
    offer_id BIGSERIAL PRIMARY KEY,
    offer_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    offer_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    usage_limit INTEGER,
    usage_per_user INTEGER DEFAULT 1,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories BIGINT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_code ON offers(offer_code);
CREATE INDEX idx_offers_active ON offers(is_active, valid_from, valid_to);
```

**Offer Type Values:** PERCENTAGE, FLAT, CASHBACK, FREE_DELIVERY

#### 3.2.9 Wishlist Table (User Service)

```sql
CREATE TABLE wishlist (
    wishlist_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);
```

#### 3.2.10 Stores Table (Location Service)

```sql
CREATE TABLE stores (
    store_id BIGSERIAL PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    store_type VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone_number VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    operating_hours JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stores_location ON stores(latitude, longitude);
CREATE INDEX idx_stores_pincode ON stores(pincode);
```

#### 3.2.11 Payments Table (Payment Service)

```sql
CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_payment_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user ON payments(user_id);
```

**Payment Status Values:** INITIATED, PENDING, SUCCESS, FAILED, REFUNDED

---

## 4. API Specifications

### 4.1 Base URL
```
Production: https://api.quickmart.com/v1
Staging: https://api-staging.quickmart.com/v1
```

### 4.2 Authentication APIs

#### 4.2.1 Send OTP
```
POST /api/auth/send-otp

Request:
{
  "phone_number": "+919876543210",
  "country_code": "+91"
}

Response:
{
  "status": "success",
  "message": "OTP sent successfully",
  "otp_expiry": "2025-10-01T10:05:00Z"
}
```

#### 4.2.2 Verify OTP & Login
```
POST /api/auth/verify-otp

Request:
{
  "phone_number": "+919876543210",
  "otp": "123456"
}

Response:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh_token_here",
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "phone_number": "+919876543210",
    "email": "john@example.com",
    "free_cash_balance": 75.00
  }
}
```

#### 4.2.3 Refresh Token
```
POST /api/auth/refresh-token

Headers:
Authorization: Bearer <refresh_token>

Response:
{
  "token": "new_access_token",
  "refresh_token": "new_refresh_token"
}
```

#### 4.2.4 Logout
```
POST /api/auth/logout

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### 4.3 User APIs

#### 4.3.1 Get User Profile
```
GET /api/user/profile

Headers:
Authorization: Bearer <token>

Response:
{
  "user_id": 1,
  "name": "John Doe",
  "phone_number": "+919876543210",
  "email": "john@example.com",
  "free_cash_balance": 75.00,
  "profile_image_url": "https://...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

#### 4.3.2 Update User Profile
```
PUT /api/user/profile

Headers:
Authorization: Bearer <token>

Request:
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}

Response:
{
  "status": "success",
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### 4.4 Product APIs

#### 4.4.1 Get All Products
```
GET /api/products

Query Parameters:
- category: integer (optional)
- subcategory: integer (optional)
- page: integer (default: 1)
- limit: integer (default: 20)
- latitude: decimal (required)
- longitude: decimal (required)
- sort_by: string (price_low, price_high, rating, popularity)

Response:
{
  "products": [
    {
      "product_id": 1,
      "name": "Fresh Tomatoes",
      "category": "Fresh Vegetables",
      "mrp_price": 50.00,
      "offer_price": 45.00,
      "discount_percentage": 10.00,
      "quantity_unit": "500g",
      "image_urls": ["https://..."],
      "rating": 4.5,
      "total_ratings": 120,
      "is_available": true,
      "delivery_time_mins": 7
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8
}
```

#### 4.4.2 Get Product Details
```
GET /api/products/{product_id}

Response:
{
  "product_id": 1,
  "name": "Fresh Tomatoes",
  "description": "Farm fresh tomatoes...",
  "category": {
    "category_id": 1,
    "name": "Fresh Vegetables"
  },
  "brand": "FreshFarm",
  "mrp_price": 50.00,
  "offer_price": 45.00,
  "discount_percentage": 10.00,
  "quantity_unit": "500g",
  "image_urls": ["https://..."],
  "rating": 4.5,
  "total_ratings": 120,
  "is_available": true,
  "inventory_count": 50,
  "delivery_time_mins": 7,
  "is_returnable": false,
  "product_highlights": [
    "Farm fresh",
    "No pesticides",
    "Organically grown"
  ],
  "similar_products": [...]
}
```

#### 4.4.3 Search Products
```
GET /api/products/search

Query Parameters:
- q: string (search query)
- latitude: decimal
- longitude: decimal
- page: integer
- limit: integer

Response:
{
  "results": [...],
  "total": 25,
  "search_query": "milk"
}
```

#### 4.4.4 Get Categories
```
GET /api/categories

Response:
{
  "categories": [
    {
      "category_id": 1,
      "name": "Grocery & Kitchen",
      "icon_url": "https://...",
      "subcategories": [
        {
          "category_id": 11,
          "name": "Fresh Vegetables"
        },
        {
          "category_id": 12,
          "name": "Daily Bread & Eggs"
        }
      ]
    }
  ]
}
```

#### 4.4.5 Get Trending Products
```
GET /api/products/trending

Query Parameters:
- latitude: decimal
- longitude: decimal
- limit: integer (default: 10)

Response:
{
  "trending_products": [...]
}
```

### 4.5 Cart APIs

#### 4.5.1 Get Cart
```
GET /api/cart

Headers:
Authorization: Bearer <token>

Response:
{
  "cart_items": [
    {
      "cart_id": 1,
      "product": {
        "product_id": 1,
        "name": "Fresh Tomatoes",
        "image_url": "https://...",
        "offer_price": 45.00,
        "is_available": true
      },
      "quantity": 2,
      "total_price": 90.00
    }
  ],
  "subtotal": 450.00,
  "delivery_charges": 0.00,
  "discount": 50.00,
  "total": 400.00
}
```

#### 4.5.2 Add to Cart
```
POST /api/cart/add

Headers:
Authorization: Bearer <token>

Request:
{
  "product_id": 1,
  "quantity": 2
}

Response:
{
  "status": "success",
  "message": "Item added to cart",
  "cart": { ... }
}
```

#### 4.5.3 Update Cart Item
```
PUT /api/cart/update

Headers:
Authorization: Bearer <token>

Request:
{
  "product_id": 1,
  "quantity": 3
}

Response:
{
  "status": "success",
  "message": "Cart updated",
  "cart": { ... }
}
```

#### 4.5.4 Remove from Cart
```
DELETE /api/cart/remove/{product_id}

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Item removed from cart",
  "cart": { ... }
}
```

#### 4.5.5 Clear Cart
```
DELETE /api/cart/clear

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Cart cleared"
}
```

### 4.6 Order APIs

#### 4.6.1 Place Order
```
POST /api/orders/place

Headers:
Authorization: Bearer <token>

Request:
{
  "address_id": 1,
  "payment_method": "razorpay",
  "offer_code": "FLAT125",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "delivery_instructions": "Ring the bell twice"
}

Response:
{
  "status": "success",
  "order": {
    "order_id": 1001,
    "order_number": "QM1001202510",
    "total_amount": 450.00,
    "discount": 125.00,
    "final_amount": 325.00,
    "estimated_delivery_time": "2025-10-01T10:15:00Z",
    "payment_details": {
      "razorpay_order_id": "order_xxx",
      "amount": 32500,
      "currency": "INR"
    }
  }
}
```

#### 4.6.2 Get User Orders
```
GET /api/orders

Headers:
Authorization: Bearer <token>

Query Parameters:
- status: string (optional)
- page: integer
- limit: integer

Response:
{
  "orders": [
    {
      "order_id": 1001,
      "order_number": "QM1001202510",
      "status": "DELIVERED",
      "items_count": 3,
      "total_amount": 325.00,
      "created_at": "2025-10-01T10:00:00Z",
      "delivered_at": "2025-10-01T10:07:00Z",
      "items": [
        {
          "product_name": "Fresh Tomatoes",
          "quantity": 2,
          "image_url": "https://..."
        }
      ]
    }
  ],
  "total": 15,
  "page": 1
}
```

#### 4.6.3 Get Order Details
```
GET /api/orders/{order_id}

Headers:
Authorization: Bearer <token>

Response:
{
  "order_id": 1001,
  "order_number": "QM1001202510",
  "status": "DELIVERED",
  "delivery_address": {
    "address_line1": "123 Main Street",
    "city": "Bangalore",
    "pincode": "560001"
  },
  "items": [...],
  "total_amount": 450.00,
  "discount_amount": 125.00,
  "delivery_charges": 0.00,
  "final_amount": 325.00,
  "payment_method": "razorpay",
  "payment_status": "SUCCESS",
  "created_at": "2025-10-01T10:00:00Z",
  "estimated_delivery_time": "2025-10-01T10:07:00Z",
  "actual_delivery_time": "2025-10-01T10:07:00Z",
  "timeline": [
    {
      "status": "CONFIRMED",
      "timestamp": "2025-10-01T10:01:00Z"
    },
    {
      "status": "PACKED",
      "timestamp": "2025-10-01T10:03:00Z"
    }
  ]
}
```

#### 4.6.4 Track Order
```
GET /api/orders/{order_id}/track

Headers:
Authorization: Bearer <token>

Response:
{
  "order_id": 1001,
  "status": "OUT_FOR_DELIVERY",
  "estimated_delivery_time": "2025-10-01T10:07:00Z",
  "delivery_partner": {
    "name": "Raj Kumar",
    "phone": "+919876543210",
    "current_location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  }
}
```

#### 4.6.5 Cancel Order
```
PUT /api/orders/{order_id}/cancel

Headers:
Authorization: Bearer <token>

Request:
{
  "reason": "Changed mind"
}

Response:
{
  "status": "success",
  "message": "Order cancelled successfully",
  "refund_amount": 325.00,
  "refund_eta": "3-5 business days"
}
```

#### 4.6.6 Reorder
```
POST /api/orders/{order_id}/reorder

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Items added to cart",
  "cart": { ... }
}
```

### 4.7 Address APIs

#### 4.7.1 Get Saved Addresses
```
GET /api/addresses

Headers:
Authorization: Bearer <token>

Response:
{
  "addresses": [
    {
      "address_id": 1,
      "address_type": "HOME",
      "house_no": "123",
      "address_line1": "Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "is_default": true
    }
  ]
}
```

#### 4.7.2 Add Address
```
POST /api/addresses

Headers:
Authorization: Bearer <token>

Request:
{
  "address_type": "HOME",
  "house_no": "123",
  "address_line1": "Main Street",
  "address_line2": "Near Park",
  "landmark": "Opposite Bank",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "is_default": false
}

Response:
{
  "status": "success",
  "message": "Address added successfully",
  "address": { ... }
}
```

#### 4.7.3 Update Address
```
PUT /api/addresses/{address_id}

Headers:
Authorization: Bearer <token>

Request:
{
  "house_no": "124",
  "is_default": true
}

Response:
{
  "status": "success",
  "message": "Address updated successfully",
  "address": { ... }
}
```

#### 4.7.4 Delete Address
```
DELETE /api/addresses/{address_id}

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Address deleted successfully"
}
```

### 4.8 Payment APIs

#### 4.8.1 Initiate Payment
```
POST /api/payment/initiate

Headers:
Authorization: Bearer <token>

Request:
{
  "order_id": 1001,
  "payment_method": "razorpay"
}

Response:
{
  "razorpay_order_id": "order_xxx",
  "amount": 32500,
  "currency": "INR",
  "key": "rzp_live_xxx"
}
```

#### 4.8.2 Verify Payment
```
POST /api/payment/verify

Headers:
Authorization: Bearer <token>

Request:
{
  "order_id": 1001,
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx"
}

Response:
{
  "status": "success",
  "message": "Payment verified successfully",
  "payment_status": "SUCCESS"
}
```

#### 4.8.3 Process Refund
```
POST /api/payment/refund

Headers:
Authorization: Bearer <token>

Request:
{
  "order_id": 1001,
  "amount": 325.00,
  "reason": "Order cancelled"
}

Response:
{
  "status": "success",
  "refund_id": "rfnd_xxx",
  "amount": 325.00,
  "status": "PROCESSED",
  "eta": "3-5 business days"
}
```

### 4.9 Offers APIs

#### 4.9.1 Get Available Offers
```
GET /api/offers

Headers:
Authorization: Bearer <token>

Response:
{
  "offers": [
    {
      "offer_id": 1,
      "offer_code": "FLAT125",
      "title": "Flat ₹125 OFF",
      "description": "On orders above ₹499",
      "offer_type": "FLAT",
      "discount_value": 125.00,
      "min_order_value": 499.00,
      "valid_to": "2025-10-31T23:59:59Z"
    }
  ]
}
```

#### 4.9.2 Validate Offer
```
POST /api/offers/validate

Headers:
Authorization: Bearer <token>

Request:
{
  "offer_code": "FLAT125",
  "cart_value": 550.00
}

Response:
{
  "is_valid": true,
  "discount": 125.00,
  "final_amount": 425.00,
  "message": "Offer applied successfully"
}
```

### 4.10 Wishlist APIs

#### 4.10.1 Get Wishlist
```
GET /api/wishlist

Headers:
Authorization: Bearer <token>

Response:
{
  "wishlist": [
    {
      "wishlist_id": 1,
      "product": {
        "product_id": 1,
        "name": "Fresh Tomatoes",
        "image_url": "https://...",
        "offer_price": 45.00,
        "is_available": true
      },
      "added_at": "2025-09-25T10:00:00Z"
    }
  ]
}
```

#### 4.10.2 Add to Wishlist
```
POST /api/wishlist/add

Headers:
Authorization: Bearer <token>

Request:
{
  "product_id": 1
}

Response:
{
  "status": "success",
  "message": "Added to wishlist"
}
```

#### 4.10.3 Remove from Wishlist
```
DELETE /api/wishlist/remove/{product_id}

Headers:
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "Removed from wishlist"
}
```

---

## 5. Screen Specifications & User Flows

### 5.1 Select Location Screen

**Purpose:** Allow users to set their delivery location

**Components:**
- Header: "Select Location"
- Search bar with icon for address search
- "Use my current location" button (triggers geolocation API)
- List of saved addresses with radio button selection
- "Add new address" button at bottom

**User Flow:**
1. User opens app for first time OR taps location dropdown on home
2. System displays location selection screen
3. User can either:
   - Tap "Use my current location" → System requests GPS permission → Fetches address
   - Search for address using search bar
   - Select from saved addresses list
4. User confirms location
5. Navigate to Home screen with selected location

**State Management:**
- Selected location (address object with lat/long)
- List of saved addresses
- GPS permission status
- Search query and results

**APIs Used:**
- `GET /api/addresses` - Fetch saved addresses
- `POST /api/addresses` - Add new address
- Google Maps Geocoding API - Convert lat/long to address

**Validation:**
- Check if location is within serviceable area
- Minimum location accuracy threshold

---

### 5.2 Home Screen

**Purpose:** Main discovery and shopping interface

**Layout Structure:**

**Top Bar (Fixed):**
- Delivery time badge: "Delivery in 7 mins"
- Location dropdown: "Home - Casagrand Royale" with icon
- Profile icon (right side)

**Search Section:**
- Search bar (3/4 width): "Search for products..."
- Festival/Promotional CTA banner

**Category Chips (Horizontal Scroll):**
All | Kanjak | Cafe | Pharma | Fresh | Electronics | Home | Beauty | Fashion | New

**Promotional Banners Section:**
- Carousel/Slider with promotional banners
- Banner examples:
  - "₹75 Free Cash - Just for you"
  - "Lower prices, Cash on delivery, Instant refunds"

**Fresh Veggies Section:**
- Title: "Fresh Veggies at just ₹9"
- Subtitle: "Offer valid till stock lasts"
- Horizontal scrolling product cards

**Product Card Components:**
- Product image
- "Add" button → On click shows quantity selector (- 1 +)
- Offer price | Original price (strikethrough)
- Product name
- Quantity/weight
- Delivery time badge

**Marquee Banner:**
- Credit card offers scrolling text

**Trending Section:**
- Title: "Trending in [Location Name]"
- 3 rows × multiple columns grid
- Last column of last row: "Show All" card

**Category Sections (Repeating Pattern):**
Each category section follows this structure:
- Section title with icon
- Subtitle describing the category
- "See All" link
- 2 rows × 3 columns grid of products

**Categories to Display:**

1. **Grocery & Kitchen**
   - Fresh Vegetables
   - Daily Bread & Eggs
   - Atta, Rice, Oil, Dals
   - Meat, Fish, Eggs
   - Masala & Dry Fruits
   - Breakfast & Sauces
   - Packaged Foods

2. **Snacks & Drinks**
   - Tea, Coffee and More
   - Ice Cream and More
   - Frozen Foods
   - Sweet Cravings
   - Cold Drinks & Juices
   - Munchies
   - Biscuits & Cookies

3. **Beauty & Personal Care**
   - Makeup & Beauty
   - Skin Care
   - Protein & Nutrition
   - Baby Care
   - Bath & Body
   - Hair Care
   - Jewelry & Accessories
   - Apparel & Lifestyle
   - Fragrances & Grooming
   - Pharmacy & Wellness
   - Feminine Hygiene

4. **Household Essentials**
   - Home Needs
   - Kitchen & Dining
   - Cleaning Essentials
   - Electronic Appliances
   - Pet Care
   - Toys & Sports
   - Stationary & Books
   - Paan Corner

5. **Shop by Store**
   - Pooja Store
   - Gift Card Store
   - Monsoon Store
   - Decor Store
   - Fitness Store
   - Birthday Store
   - Gift Store
   - Pleasure Store
   - Premium Store
   - Vitamin Store
   - Gardening Store
   - Sports Store
   - Baby Store
   - Book Store

**Curated Collections (2 rows × 3 columns each):**
- Hair Care - "Solutions for every hair type"
- Repellents & More - "Insect protection indoors & outdoors"
- Vitamins & Supplements - "Small steps to a healthier you"
- Baby Care - "Everything for your little ones"
- Everyday Basics - "Comfort picks for you"
- Electronics - "Simplify life with appliances & gadgets"
- Skin Care - "Must-haves for your skin goals"
- Makeup & Beauty - "Shop skin-first beauty favourites"
- Fragrances & Grooming - "Smell good, feel fresh, look sharp"
- Bath & Body - "All you need to feel fresh"

**Footer:**
- "The place that fits all your needs"
- "Crafted with love from Zepto team"
- FSSAI License Number

**Bottom Navigation (Fixed):**
- Home (active)
- Categories
- Cart (with badge showing item count)

**Floating Action Button:**
- "View Cart" button (shows only when cart has items)
- Badge with item count
- Shows promotional text: "Flat ₹125 off plus ₹50 cashback with CRED Pay"

**State Management:**
- Selected location
- Cart items and count
- Product quantities in cart (for inline add/remove)
- Category scroll position
- Banner carousel index
- Wishlist items

**Interactions:**
1. Tapping location → Navigate to Select Location screen
2. Tapping Profile → Navigate to Profile screen
3. Search bar → Navigate to Search screen
4. Category chip → Filter/scroll to category section
5. Product card "Add" → Shows quantity selector, adds to cart
6. Product card image/name → Navigate to Product Details
7. "See All" → Navigate to Category page with all products
8. "View Cart" FAB → Navigate to Cart screen

**APIs Used:**
- `GET /api/products` - Fetch products by location and categories
- `GET /api/categories` - Fetch all categories
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update quantity
- `GET /api/products/trending` - Trending products
- `GET /api/offers` - Active promotional banners

**Performance Considerations:**
- Lazy loading for product images
- Virtual scrolling for long product lists
- Debounced cart updates
- Cache frequently accessed categories

---

### 5.3 Product Details Screen

**Purpose:** Display comprehensive product information

**Header:**
- Back arrow (left)
- Share icon (right)
- Search icon (right)

**Main Content:**

**Product Image Section:**
- Image carousel/slider
- Multiple product images
- Zoom on tap

**Product Information:**
- Product name (large, bold)
- Quantity/weight indicator
- Rating stars with count: "★ 4.5 (120 ratings)"

**Pricing Section:**
- Offer price (large, bold): "₹45"
- Discount badge: "10% OFF"
- MRP with strikethrough: "₹50"
- Text: "Incl. of all taxes"

**Offers Section:**
- "View all offers >" link
- Shows applicable offers/coupons

**Delivery Info:**
- Badge: "Estimated delivery: 8 mins"
- Location-based delivery time

**Brand Section:**
- "View all [Brand Name] products >" link

**Product Tags:**
- "No return/exchange"
- "Fast delivery"
- Other relevant tags

**Product Highlights Section:**
- Title: "Product Highlights"
- Bullet points with key features
- Example:
  - Farm fresh
  - No pesticides
  - Organically grown

**Product Information Section:**
- Title: "Information"
- Detailed description
- Ingredients/Contents
- Nutritional information (if applicable)
- Manufacturer details
- Best before date
- Storage instructions

**Similar Products Section:**
- Title: "Similar Products"
- Horizontal scroll of product cards
- Same card format as home screen

**You Might Also Like Section:**
- Title: "You might also like"
- 2 rows of product recommendations
- Based on browsing history and similar purchases

**Bottom Action Bar (Fixed):**
- Cart icon with badge (item count)
- "Add to Cart" button (primary CTA)
- If already in cart: Quantity selector (- 1 +)

**State Management:**
- Product details
- Selected image index
- Quantity in cart
- Wishlist status
- Similar products list

**User Interactions:**
1. Image carousel → Swipe to view different images
2. Rating → Show reviews modal
3. View all offers → Show offers modal/page
4. Brand link → Navigate to brand products page
5. Add to Cart → Add item and show confirmation
6. Quantity selector → Update cart quantity
7. Share → Open native share sheet
8. Similar products → Navigate to product details

**APIs Used:**
- `GET /api/products/{id}` - Get product details
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `GET /api/products/similar` - Get similar products

**Special Features:**
- Share product via WhatsApp, SMS, etc.
- Add to wishlist (heart icon in header)
- Product availability check based on location

---

### 5.4 Cart Screen

**Purpose:** Review items, apply offers, and proceed to checkout

**Header:**
- Title: "Cart"
- Clear cart option (3-dot menu)

**Cart Items Section:**
- List of products in cart
- Each item shows:
  - Product image
  - Product name
  - Quantity/weight
  - Quantity selector (- [count] +)
  - Offer price
  - Original price (strikethrough if discount)
  - Remove button (trash icon)

**Offers Section:**
- "Apply Coupon" input field
- "View all offers" link
- Applied coupon display with remove option
- Savings amount highlighted

**Bill Summary Section:**
- Item total: ₹450.00
- Delivery charges: ₹0.00 (or actual amount)
- Handling charges: ₹2.00
- Discount: -₹125.00 (in green)
- Free cash used: -₹50.00 (if applicable)
- Divider line
- **To Pay: ₹277.00** (bold, large)

**Delivery Address Section:**
- Title: "Deliver to"
- Selected address summary
- "Change" button → Navigate to address selection

**Payment Method Section:**
- Title: "Payment Method"
- Radio buttons for:
  - Razorpay (UPI, Cards, Net Banking)
  - CRED Pay (with offer badge)
  - Cash on Delivery
  - Pay Later options

**Suggested Products Section:**
- Title: "You might want to add"
- Horizontal scroll of recommended products
- Quick add functionality

**Bottom Bar (Fixed):**
- Total amount: "₹277.00"
- "Place Order" button (primary CTA)
- Shows savings: "You're saving ₹175"

**Empty Cart State:**
- Illustration
- Text: "Your cart is empty"
- "Start Shopping" button → Navigate to home

**State Management:**
- Cart items list
- Selected address
- Selected payment method
- Applied coupon
- Total calculations
- Suggested products

**User Flow:**
1. View cart items
2. Modify quantities using +/- buttons
3. Apply coupon code
4. Select/change delivery address
5. Choose payment method
6. Review bill summary
7. Tap "Place Order"
8. For online payment → Razorpay payment gateway
9. Payment success → Navigate to Order Confirmation
10. Payment failure → Show retry options

**APIs Used:**
- `GET /api/cart` - Get cart items
- `PUT /api/cart/update` - Update quantities
- `DELETE /api/cart/remove/{id}` - Remove item
- `POST /api/offers/validate` - Validate coupon
- `GET /api/addresses` - Get delivery addresses
- `POST /api/orders/place` - Place order
- `POST /api/payment/initiate` - Initiate payment

**Validations:**
- Minimum order value check
- Product availability check
- Delivery area serviceability check
- Payment method validation

**Special Features:**
- Real-time price calculations
- Auto-apply best offer
- Save for later functionality
- Quick reorder from past orders

---

### 5.5 Profile Screen

**Purpose:** User account management and settings

**Header:**
- Title: "Profile"
- Settings icon (optional)

**User Info Card:**
- Profile picture (placeholder if not set)
- Name: "John Doe"
- Phone: "+91 98765 43210"
- Free Cash Balance: "₹75.00" (highlighted in green)

**Quick Actions (3 cards in row):**
- Your Orders (icon + text)
- Help & Support (icon + text)
- Wishlist (icon + badge with count)

**Your Information Section:**
- Section title: "Your Information"
- List items with right arrow:
  1. **Your Orders** → Navigate to orders list
  2. **Your Wishlist** → Navigate to wishlist
  3. **Help and Support** → Navigate to help center
  4. **Refunds** → Navigate to refund status
  5. **Saved Addresses** (shows count badge) → Navigate to address list
  6. **Profile** → Navigate to edit profile
  7. **Payment Management** → Navigate to payment methods

**Other Info Section:**
- Section title: "Other Info"
- List items:
  1. **Suggested Products** → Personalized recommendations
  2. **Notifications** → Notification settings
  3. **General Info** → About, Terms, Privacy Policy

**Logout Button:**
- Red text button at bottom
- "Logout"

**State Management:**
- User profile data
- Free cash balance
- Order count
- Wishlist count
- Address count

**User Interactions:**
1. Tap profile picture → Change profile picture
2. Tap any list item → Navigate to respective screen
3. Tap Logout → Show confirmation → Logout and navigate to login

**APIs Used:**
- `GET /api/user/profile` - Get user data
- `POST /api/auth/logout` - Logout user

---

### 5.6 Your Orders Screen

**Purpose:** View order history and status

**Header:**
- Title: "Your Orders"
- Filter icon (right)

**Filter Tabs:**
- All
- Pending
- Delivered
- Cancelled

**Order Cards:**
Each order card displays:

**Top Section:**
- Status badge (colored): "Delivered", "Cancelled", "Pending"
- Amount (right): "₹325.00"
- Three-dot menu → Options: Delete order

**Order Info:**
- Order date: "Placed on 15 Sep 2025"
- Order number: "#QM1001202510"

**Product Carousel:**
- Horizontal scroll of product images
- Shows all products in order
- 3-4 visible at once

**Bottom Section:**
- "Order Again" button
- "View Details" link

**Empty State:**
- No orders illustration
- "No orders yet"
- "Start Shopping" button

**State Management:**
- Orders list
- Active filter
- Loading states

**User Interactions:**
1. Tap order card → Navigate to order details
2. Tap "Order Again" → Add items to cart
3. Three-dot menu → Delete order (soft delete)
4. Filter tabs → Filter by status
5. Swipe to refresh → Reload orders

**APIs Used:**
- `GET /api/orders` - Get user orders
- `POST /api/orders/{id}/reorder` - Reorder
- `DELETE /api/orders/{id}` - Delete order (soft)
- `GET /api/orders/{id}` - Get order details

**Floating Cart Button:**
- "View Cart" (if cart has items)

---

### 5.7 Order Details Screen

**Purpose:** View detailed order information and track status

**Header:**
- Back button
- Title: "Order Details"
- Help icon (right)

**Order Status Section:**
- Large status indicator
- Status text: "Delivered"
- Delivery date/time
- Timeline/stepper showing:
  - Order Confirmed
  - Packed
  - Out for Delivery
  - Delivered

**Delivery Partner Info (if applicable):**
- Partner name
- Partner phone
- Vehicle details
- Current location (map view)

**Order Items Section:**
- Title: "Items"
- List of products with:
  - Image
  - Name
  - Quantity
  - Price

**Delivery Address:**
- Address used for delivery
- Contact number

**Bill Details:**
- Item total
- Delivery charges
- Discount
- Total paid

**Payment Info:**
- Payment method
- Transaction ID
- Payment status

**Actions:**
- Download Invoice button
- Need Help? button
- Cancel Order button (if allowed)
- Rate & Review button (after delivery)

**APIs Used:**
- `GET /api/orders/{id}` - Order details
- `GET /api/orders/{id}/track` - Real-time tracking

---

### 5.8 Help & Support Screen

**Purpose:** Provide customer support and FAQs

**Header:**
- Title: "Help & Support"

**Quick Help Section:**
- Search bar: "Search for help"

**Categories:**

1. **Get Help on Orders** → See All
   - Shows recent orders
   - Quick actions per order

2. **FAQs** → See All
   - Common questions with expandable answers
   - Categories:
     - Orders & Delivery
     - Payments & Refunds
     - Account & Profile
     - Products & Availability

3. **Coupons & Offers**
   - View all active offers
   - Terms and conditions

4. **General Inquiry**
   - Contact form
   - Email support
   - Phone support

5. **Payment Related**
   - Payment issues
   - Refund status
   - Payment methods

6. **Order and Product Related**
   - Order not delivered
   - Wrong item received
   - Product quality issues
   - Missing items

**Contact Options:**
- Chat support button
- Call support: 1800-XXX-XXXX
- Email: support@quickmart.com

**APIs Used:**
- `GET /api/help/faqs` - Get FAQs
- `POST /api/help/inquiry` - Submit inquiry

---

### 5.9 Saved Addresses Screen

**Purpose:** Manage delivery addresses

**Header:**
- Title: "Saved Addresses"
- "+ Add New Address" button

**Address Cards:**
Each address shows:
- Address type badge: "Home", "Work", "Other"
- Default badge (if applicable)
- Name (if provided)
- Full address
- Pincode
- Edit button
- Delete button
- Set as default option

**Empty State:**
- Illustration
- "No saved addresses"
- "Add your first address" button

**User Interactions:**
1. Add new → Navigate to location selection
2. Edit → Navigate to edit address form
3. Delete → Confirmation dialog
4. Set as default → Update default address

**APIs Used:**
- `GET /api/addresses` - Get addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/{id}` - Update address
- `DELETE /api/addresses/{id}` - Delete address

---

### 5.10 Edit Profile Screen

**Purpose:** Update user information

**Form Fields:**
- Name (editable)
- Phone Number (read-only, shows as disabled)
- Email (editable)
- Profile Picture (upload option)

**Actions:**
- "Submit" button
- "Cancel" button

**Validations:**
- Name: Required, 2-50 characters
- Email: Valid email format

**APIs Used:**
- `PUT /api/user/profile` - Update profile

---

## 6. Technology Stack

### 6.1 Frontend Technologies

**Web Application:**
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS 3.x
- **State Management:** Zustand or Redux Toolkit
- **Data Fetching:** React Query (TanStack Query)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **UI Components:** shadcn/ui (optional for faster development)
- **Maps Integration:** Google Maps JavaScript API
- **Payment Integration:** Razorpay Checkout
- **Analytics:** Google Analytics 4

**Build Tools:**
- Vite or Create React App
- ESLint + Prettier
- Husky (Git hooks)

**Mobile Application:**
- React Native with TypeScript
- React Navigation
- AsyncStorage for local data
- Firebase SDK for push notifications

---

### 6.2 Backend Technologies

**Core Framework:**
- **Language:** Java 17
- **Framework:** Spring Boot 3.x
- **Build Tool:** Maven or Gradle

**Spring Modules:**
- Spring Web (REST APIs)
- Spring Data JPA (Database ORM)
- Spring Security (Authentication/Authorization)
- Spring Cloud Gateway (API Gateway)
- Spring Cloud Config (Centralized Configuration)
- Spring Cloud Netflix Eureka (Service Discovery)
- Spring Kafka (Event Streaming)
- Spring Cache (Caching Abstraction)

**Additional Libraries:**
- Lombok (Reduce boilerplate)
- MapStruct (Object mapping)
- JWT (io.jsonwebtoken)
- Swagger/OpenAPI (API Documentation)
- Logback/SLF4J (Logging)
- Hibernate Validator (Input validation)

---

### 6.3 Database & Storage

**Primary Database:**
- PostgreSQL 15+
- Separate databases per microservice
- Master-Slave replication for read scaling

**Caching:**
- Redis 7+ for:
  - Session management
  - Product catalog caching
  - Rate limiting
  - Real-time cart data
  - Temporary OTP storage

**Search Engine:**
- Elasticsearch 8+ for:
  - Product search
  - Autocomplete suggestions
  - Filters and faceted search

**File Storage:**
- AWS S3 or CloudFlare R2 for:
  - Product images
  - User profile pictures
  - Invoice documents

---

### 6.4 Message Queue & Event Streaming

**Message Broker:**
- Apache Kafka for:
  - Order events
  - Payment events
  - Inventory updates
  - Notification triggers
  - Audit logs

**Alternative:**
- RabbitMQ (can be used instead of Kafka)

---

### 6.5 DevOps & Infrastructure

**Containerization:**
- Docker for containerizing services
- Docker Compose for local development

**Orchestration:**
- Kubernetes (K8s) for production
- Helm charts for deployment

**CI/CD:**
- Jenkins for:
  - Automated builds
  - Unit testing
  - Integration testing
  - Deployment pipelines
- GitHub Actions (alternative)

**Code Quality:**
- SonarQube for code analysis
- JaCoCo for code coverage

**Monitoring & Logging:**
- Prometheus for metrics collection
- Grafana for visualization
- ELK Stack (Elasticsearch, Logstash, Kibana) for centralized logging
- Sentry for error tracking

**Infrastructure:**
- AWS/Azure/GCP for cloud hosting
- Nginx for load balancing
- CloudFlare for CDN and DDoS protection

---

### 6.6 Third-Party Integrations

**Payment Gateway:**
- Razorpay
  - Payment links
  - Webhook handling
  - Refund API
- CRED Pay integration

**SMS & OTP:**
- Twilio or AWS SNS
  - OTP delivery
  - Order notifications
  - Promotional SMS

**Push Notifications:**
- Firebase Cloud Messaging (FCM)
  - Order updates
  - Promotional notifications
  - Cart abandonment reminders

**Maps & Location:**
- Google Maps Platform
  - Geocoding API
  - Distance Matrix API
  - Places API
  - Maps JavaScript API

**Email Service:**
- SendGrid or AWS SES
  - Order confirmations
  - Promotional emails
  - Password reset

**Analytics:**
- Google Analytics 4
- Mixpanel (for event tracking)

**License & Compliance:**
- FSSAI license display
- PCI DSS compliance for payments

---

## 7. Security Considerations

### 7.1 Authentication & Authorization

**OTP-Based Authentication:**
- SMS-based OTP via Twilio
- OTP valid for 5 minutes
- Rate limiting: Max 3 OTP requests per phone number per hour
- Exponential backoff for retry attempts

**JWT Token Strategy:**
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Token stored in httpOnly cookies (web)
- Token revocation on logout
- Refresh token rotation

**Role-Based Access Control (RBAC):**
- Roles: USER, ADMIN, DELIVERY_PARTNER, STORE_MANAGER
- Permissions checked at API level
- Spring Security method-level security

**Password Security:**
- BCrypt hashing algorithm (strength: 12)
- No password recovery, only reset via OTP
- Password complexity requirements (if password auth added)

---

### 7.2 Data Security

**Transport Layer:**
- All APIs served over HTTPS/TLS 1.3
- Certificate pinning for mobile apps
- HSTS headers enabled

**Data at Rest:**
- Database encryption for sensitive fields
- AES-256 encryption for:
  - Payment information (tokenized)
  - Personal identifiable information (PII)

**Sensitive Data Handling:**
- No storage of card details (PCI DSS compliance)
- Payment tokens from Razorpay
- Masked phone numbers in logs
- Anonymized user data in analytics

**GDPR & Data Privacy:**
- User consent management
- Right to data deletion
- Data export functionality
- Privacy policy compliance
- Cookie consent management

---

### 7.3 API Security

**Rate Limiting:**
- 100 requests per minute per user (authenticated)
- 20 requests per minute per IP (unauthenticated)
- Redis-based rate limiting
- 429 Too Many Requests response

**Input Validation:**
- Server-side validation for all inputs
- Whitelist validation approach
- Sanitization to prevent XSS
- Request size limits

**SQL Injection Prevention:**
- Prepared statements via JPA
- Parameterized queries
- Input sanitization
- ORM security best practices

**CORS Configuration:**
- Whitelist allowed origins
- Credentials allowed for authenticated requests
- Proper headers configuration

**API Versioning:**
- URI versioning: /api/v1/
- Backward compatibility maintained

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy
- X-XSS-Protection: 1; mode=block

---

### 7.4 Payment Security

**Razorpay Integration:**
- PCI DSS Level 1 compliant
- Payment signature verification
- Webhook signature validation
- Secure callback URLs

**Payment Flow Security:**
1. Order created server-side
2. Payment initiated with order verification
3. Payment signature validated
4. Double-entry bookkeeping
5. Idempotent payment processing

**Refund Security:**
- Admin approval for refunds above threshold
- Audit trail for all refunds
- Automatic refund for cancellations
- Refund amount validation

**Transaction Monitoring:**
- Real-time fraud detection
- Suspicious activity alerts
- Transaction anomaly detection
- Daily reconciliation

---

### 7.5 Infrastructure Security

**Network Security:**
- VPC with private subnets
- Security groups and NACLs
- Bastion host for SSH access
- No direct internet access to databases

**Secrets Management:**
- Environment variables for secrets
- AWS Secrets Manager or HashiCorp Vault
- Secrets rotation policy
- No secrets in code or logs

**Backup & Disaster Recovery:**
- Daily automated database backups
- 30-day retention policy
- Cross-region backup replication
- Regular disaster recovery drills
- Point-in-time recovery capability

**Audit Logging:**
- All admin actions logged
- Payment transactions logged
- User authentication events logged
- Log retention: 90 days
- Tamper-proof logs

---

## 8. Non-Functional Requirements

### 8.1 Performance Requirements

**API Response Time:**
- 95th percentile: < 200ms
- 99th percentile: < 500ms
- Critical APIs (cart, checkout): < 100ms

**Page Load Time:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

**Database Performance:**
- Query execution time: < 50ms (avg)
- Indexed queries only
- Connection pooling: HikariCP
- Query optimization and explain plans

**Caching Strategy:**
- Redis for hot data
- TTL: Product catalog (5 mins), User session (15 mins)
- Cache-aside pattern
- Cache warming for popular products

**CDN Usage:**
- Static assets served via CDN
- Image optimization and lazy loading
- Progressive image loading
- WebP format for images

---

### 8.2 Scalability Requirements

**Horizontal Scaling:**
- Stateless microservices
- Auto-scaling based on CPU/Memory metrics
- Load balancing with Nginx
- Service mesh (Istio) for advanced routing

**Database Scaling:**
- Read replicas for read-heavy operations
- Write to master, read from slaves
- Partitioning/Sharding for large tables
- Connection pooling

**Traffic Handling:**
- Support 100,000+ concurrent users
- 10,000 requests per second
- Graceful degradation under load
- Queue-based processing for heavy operations

**Storage Scaling:**
- Horizontal scaling of file storage
- Database growth planning
- Archive strategy for old data

---

### 8.3 Availability & Reliability

**Uptime SLA:**
- 99.9% uptime guarantee
- Maximum planned downtime: 4 hours/month
- Scheduled maintenance during low-traffic windows
- Zero-downtime deployments

**High Availability:**
- Multi-zone deployment
- Redundant services across availability zones
- Database replication (Master-Slave)
- Automatic failover mechanisms
- Health checks every 30 seconds

**Circuit Breaker Pattern:**
- Hystrix or Resilience4j implementation
- Fallback mechanisms for service failures
- Timeout configuration per service
- Graceful degradation

**Error Handling:**
- Proper HTTP status codes
- User-friendly error messages
- Detailed error logs for debugging
- Error tracking with Sentry
- Automated alerting for critical errors

---

### 8.4 Monitoring & Observability

**Application Monitoring:**
- Prometheus for metrics collection
- Grafana dashboards for visualization
- Custom metrics:
  - Request rate, error rate, duration (RED metrics)
  - Orders per minute
  - Cart conversion rate
  - Payment success rate
  - API latency percentiles

**Logging Strategy:**
- Centralized logging with ELK Stack
- Structured JSON logs
- Log levels: DEBUG, INFO, WARN, ERROR
- Correlation IDs for request tracing
- Log retention: 90 days

**Distributed Tracing:**
- Spring Cloud Sleuth + Zipkin
- Request flow visualization
- Performance bottleneck identification
- Cross-service transaction tracking

**Alerting:**
- Real-time alerts via:
  - PagerDuty for critical issues
  - Slack for warnings
  - Email for informational alerts
- Alert rules:
  - API error rate > 1%
  - Response time > 1s
  - Database connection pool exhausted
  - Disk usage > 80%
  - Payment gateway failures

**Business Metrics Dashboard:**
- Real-time order count
- Revenue tracking
- Active users
- Cart abandonment rate
- Average order value
- Delivery time metrics
- Customer satisfaction scores

---

### 8.5 Maintainability

**Code Quality:**
- SonarQube integration in CI/CD
- Code coverage minimum: 80%
- Code review mandatory for all changes
- Coding standards documented
- Static code analysis

**Documentation:**
- Swagger/OpenAPI for API documentation
- README for each microservice
- Architecture decision records (ADRs)
- Deployment documentation
- Runbooks for common operations

**Testing Strategy:**
- Unit tests: 80%+ coverage
- Integration tests for critical flows
- End-to-end tests for user journeys
- Load testing with JMeter or Gatling
- Security testing (OWASP Top 10)

**Version Control:**
- Git branching strategy (GitFlow)
- Semantic versioning for releases
- Pull request reviews
- Automated changelog generation

---

## 9. Implementation Roadmap

### Phase 1: MVP - Core Functionality (Weeks 1-4)

**Week 1: Project Setup & Authentication**
- Initialize Spring Boot microservices
- Set up PostgreSQL databases
- Configure Redis cache
- API Gateway setup
- User Service: OTP authentication
- JWT token implementation
- React app initialization with TypeScript
- Basic routing setup

**Week 2: Product Catalog**
- Product Service development
- Categories and subcategories
- Product listing APIs
- Database schema for products
- Home screen UI
- Product card components
- Category navigation
- Product details screen

**Week 3: Cart & Location**
- Cart management APIs
- Location Service setup
- Address management
- Cart screen UI
- Select location screen
- Google Maps integration
- Add to cart functionality
- Quantity management

**Week 4: Basic Order Flow**
- Order Service development
- Place order API
- Basic payment integration (Razorpay)
- Order confirmation screen
- Payment gateway integration
- Order success/failure handling
- Basic email notifications

**Deliverables:**
- Working authentication system
- Product browsing and search
- Cart management
- Basic order placement
- Payment processing
- Location-based delivery

---

### Phase 2: Core Features Enhancement (Weeks 5-8)

**Week 5: Order Management**
- Order history screen
- Order details screen
- Order status tracking
- Cancel order functionality
- Reorder feature
- Order filters and search
- Timeline/stepper UI component

**Week 6: Offers & Promotions**
- Offers Service development
- Coupon validation API
- Apply offer at checkout
- Promotional banners
- Offers listing screen
- Dynamic pricing logic
- Free cash implementation

**Week 7: Profile & Preferences**
- Profile management
- Edit profile screen
- Saved addresses CRUD
- Wishlist functionality
- User preferences
- Notification settings
- Profile picture upload

**Week 8: Search & Recommendations**
- Elasticsearch integration
- Product search API
- Search screen UI
- Autocomplete suggestions
- Trending products algorithm
- Similar products recommendation
- Product filters

**Deliverables:**
- Complete order management
- Promotional offers system
- User profile features
- Advanced search capabilities
- Product recommendations

---

### Phase 3: Advanced Features (Weeks 9-12)

**Week 9: Admin Dashboard - Part 1**
- Admin authentication
- Order management dashboard
- Order status updates
- Product inventory management
- Real-time order notifications
- Admin analytics

**Week 10: Admin Dashboard - Part 2**
- Customer management
- Offer management
- Category management
- Reports and analytics
- Delivery partner assignment
- Store management

**Week 11: Notifications & Real-time**
- Notification Service
- Firebase Cloud Messaging setup
- Push notification for order updates
- SMS notifications via Twilio
- Email notifications
- In-app notifications
- WebSocket for real-time updates

**Week 12: Payment Enhancements**
- CRED Pay integration
- Multiple payment methods
- Refund management API
- Refund status tracking
- Payment history
- Auto-refund on cancellation
- Payment retry mechanism

**Deliverables:**
- Complete admin dashboard
- Real-time notifications
- Advanced payment options
- Refund system
- Delivery tracking

---

### Phase 4: Optimization & Polish (Weeks 13-16)

**Week 13: Performance Optimization**
- Database query optimization
- Index creation and tuning
- Redis caching implementation
- API response time optimization
- Image lazy loading
- Code splitting
- Bundle size optimization

**Week 14: Testing & Quality Assurance**
- Unit test coverage improvement
- Integration test suite
- End-to-end testing
- Load testing with JMeter
- Security vulnerability scanning
- OWASP Top 10 compliance
- Penetration testing

**Week 15: DevOps & Deployment**
- Jenkins pipeline setup
- Docker containerization
- Kubernetes deployment configs
- Helm charts creation
- Monitoring setup (Prometheus + Grafana)
- ELK stack for logging
- Staging environment setup

**Week 16: Launch Preparation**
- Production environment setup
- SSL certificate configuration
- CDN setup for static assets
- Final security audit
- Performance benchmarking
- Documentation finalization
- User acceptance testing (UAT)
- Soft launch preparation

**Deliverables:**
- Optimized application
- Comprehensive test coverage
- Complete CI/CD pipeline
- Production-ready deployment
- Monitoring and alerting
- Launch-ready platform

---

## 10. API Rate Limiting & Throttling

### 10.1 Rate Limit Configuration

**Unauthenticated Requests:**
- 20 requests per minute per IP
- Applied to: Login, OTP generation, public product listing

**Authenticated Requests:**
- 100 requests per minute per user
- Applied to: All authenticated endpoints

**Critical Operations:**
- Place Order: 5 requests per minute
- Payment: 3 requests per minute
- OTP Request: 3 requests per hour

**Implementation:**
- Redis-based token bucket algorithm
- Rate limit headers in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

---

## 11. Error Handling & Status Codes

### 11.1 HTTP Status Codes

**Success (2xx):**
- 200 OK: Successful GET, PUT, DELETE
- 201 Created: Successful POST (resource created)
- 204 No Content: Successful DELETE with no response body

**Client Errors (4xx):**
- 400 Bad Request: Invalid input
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Duplicate resource
- 422 Unprocessable Entity: Validation errors
- 429 Too Many Requests: Rate limit exceeded

**Server Errors (5xx):**
- 500 Internal Server Error: Unexpected error
- 502 Bad Gateway: Upstream service error
- 503 Service Unavailable: Service temporarily down
- 504 Gateway Timeout: Upstream timeout

### 11.2 Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist",
    "details": {
      "product_id": 12345
    },
    "timestamp": "2025-10-01T10:30:00Z",
    "path": "/api/products/12345"
  }
}
```

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

**Unit Tests (70%):**
- Service layer business logic
- Utility functions
- Validation logic
- Framework: JUnit 5, Mockito
- Coverage target: 80%+

**Integration Tests (20%):**
- API endpoint testing
- Database integration
- External service mocks
- Framework: Spring Boot Test, TestContainers

**End-to-End Tests (10%):**
- Critical user journeys
- Order placement flow
- Payment flow
- Framework: Selenium, Cypress

### 12.2 Test Scenarios

**Critical Flows to Test:**
1. User registration and login
2. Browse products → Add to cart → Checkout → Payment
3. Apply coupon code
4. Order tracking
5. Cancel order and refund
6. Address management
7. Search products
8. Admin order management

**Load Testing:**
- Target: 10,000 concurrent users
- Tool: Apache JMeter or Gatling
- Scenarios:
  - Normal load (1000 users)
  - Peak load (5000 users)
  - Stress test (10,000+ users)
  - Spike test (sudden traffic surge)

**Security Testing:**
- SQL injection attempts
- XSS attacks
- CSRF protection
- Authentication bypass attempts
- Authorization testing
- Sensitive data exposure

---

## 13. Deployment Strategy

### 13.1 Environment Setup

**Development:**
- Local Docker containers
- Docker Compose for services
- H2/PostgreSQL local database
- Mock payment gateway

**Staging:**
- Kubernetes cluster
- Staging database
- Test payment gateway (Razorpay test mode)
- Similar to production setup

**Production:**
- Multi-zone Kubernetes deployment
- Production databases with replication
- Live payment gateway
- CDN for static assets
- SSL/TLS certificates

### 13.2 CI/CD Pipeline

**Build Stage:**
1. Code checkout from Git
2. Run linters and code quality checks
3. Compile Java code
4. Build Docker images
5. Tag images with version

**Test Stage:**
1. Run unit tests
2. Run integration tests
3. Code coverage report
4. SonarQube analysis
5. Security vulnerability scan

**Deploy Stage:**
1. Push Docker images to registry
2. Update Kubernetes manifests
3. Apply rolling deployment
4. Health check verification
5. Rollback on failure

**Pipeline Triggers:**
- Commit to develop → Deploy to staging
- Tag/Release → Deploy to production
- Pull request → Run tests only

### 13.3 Blue-Green Deployment

- Maintain two identical production environments
- Route traffic to Blue (current version)
- Deploy new version to Green
- Run smoke tests on Green
- Switch traffic to Green
- Keep Blue as instant rollback option

---

## 14. Data Migration & Seeding

### 14.1 Initial Data

**Categories Data:**
- 15 main categories
- 100+ subcategories
- Category icons and metadata

**Products Data:**
- Minimum 5,000 products for MVP
- Product images from CDN
- Realistic pricing and offers
- Inventory levels

**Sample Users:**
- Test accounts for QA
- Admin accounts
- Delivery partner accounts

**Locations:**
- Serviceable pincodes
- Store locations
- Delivery zones

### 14.2 Migration Scripts

**Flyway or Liquibase:**
- Version-controlled database changes
- Incremental migrations
- Rollback capability
- Migration history tracking

---

## 15. Compliance & Legal

### 15.1 Regulatory Compliance

**FSSAI License:**
- Display FSSAI license number
- Food safety standards compliance
- Regular audits

**PCI DSS:**
- Never store card details
- Use PCI-compliant payment gateways
- Secure payment processing

**GDPR (if applicable):**
- Data protection policies
- User consent management
- Right to deletion
- Data portability

**GST Compliance:**
- Tax calculation
- Invoice generation
- GST number on invoices

### 15.2 Terms & Policies

**Required Documents:**
- Terms of Service
- Privacy Policy
- Refund & Cancellation Policy
- Shipping Policy
- Cookie Policy

---

## 16. Success Metrics & KPIs

### 16.1 Business Metrics

**Order Metrics:**
- Orders per day/week/month
- Average order value (AOV)
- Order completion rate
- Cart abandonment rate
- Repeat order rate

**Delivery Metrics:**
- On-time delivery percentage
- Average delivery time
- Delivery success rate

**Revenue Metrics:**
- Gross Merchandise Value (GMV)
- Net revenue
- Revenue per user
- Customer lifetime value (CLV)

**User Metrics:**
- Daily active users (DAU)
- Monthly active users (MAU)
- User retention rate
- Churn rate

### 16.2 Technical Metrics

**Performance:**
- API response time (p95, p99)
- Page load time
- Time to first byte (TTFB)
- Database query performance

**Reliability:**
- Uptime percentage
- Error rate
- Failed payment rate
- Service availability

**Scalability:**
- Concurrent users handled
- Requests per second
- Database connections
- Cache hit rate

---

## 17. Risk Management

### 17.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database failure | High | Master-slave replication, automated backups |
| Payment gateway downtime | High | Multiple payment options, queue failed payments |
| High traffic spikes | Medium | Auto-scaling, CDN, caching |
| Security breach | High | Regular security audits, encryption, monitoring |
| Third-party API failures | Medium | Circuit breakers, fallback mechanisms |

### 17.2 Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inventory stockouts | Medium | Real-time inventory tracking, alerts |
| Delivery delays | High | Multiple delivery partners, buffer time |
| Customer disputes | Medium | Clear policies, responsive support |
| Regulatory changes | Low | Regular compliance reviews |

---

## 18. Future Enhancements (Post-Launch)

### 18.1 Phase 5 Features

**Subscription Service:**
- Daily/weekly recurring orders
- Milk, bread, newspaper subscriptions
- Auto-charge and delivery

**Loyalty Program:**
- Points on every order
- Tier-based benefits
- Referral rewards

**AI/ML Features:**
- Personalized product recommendations
- Demand forecasting
- Dynamic pricing
- Chatbot support

**Social Features:**
- Share orders with friends
- Group ordering
- Social login (Google, Facebook)

**Advanced Delivery:**
- Scheduled delivery slots
- Express delivery option
- Contactless delivery

**Gamification:**
- Daily challenges
- Badges and achievements
- Leaderboards

### 18.2 Platform Expansion

**Delivery Partner App:**
- Accept/reject orders
- Navigation
- Earnings tracking
- Performance metrics

**Store Manager App:**
- Inventory management
- Order fulfillment
- Stock alerts
- Sales reports

**Vendor Portal:**
- Vendor onboarding
- Product management
- Analytics dashboard
- Payout management

---

## 19. Support & Maintenance

### 19.1 Support Tiers

**Tier 1 - User Issues:**
- Order issues
- Payment problems
- Account issues
- Response time: 2 hours

**Tier 2 - Technical Issues:**
- API errors
- Integration issues
- Performance problems
- Response time: 1 hour

**Tier 3 - Critical Issues:**
- System outages
- Security incidents
- Data loss
- Response time: 15 minutes

### 19.2 Maintenance Windows

**Regular Maintenance:**
- Weekly: Sunday 2 AM - 4 AM IST
- Database optimization
- Log cleanup
- Security patches

**Emergency Maintenance:**
- As needed for critical issues
- Advance notification (if possible)
- Rollback plan ready

---

## 20. Glossary

**API Gateway:** Entry point for all client requests, handles routing, authentication

**Cart Abandonment:** Users add items but don't complete checkout

**Circuit Breaker:** Design pattern to prevent cascading failures

**GMV:** Gross Merchandise Value - total sales value before deductions

**Microservices:** Architectural style with independent, loosely coupled services

**OTP:** One-Time Password for authentication

**Redis:** In-memory data store for caching

**SLA:** Service Level Agreement - guaranteed uptime/performance

**Webhook:** HTTP callback triggered by events (e.g., payment confirmation)

---

## Appendix A: Database Schema Diagram

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│    Users    │      │  Addresses   │      │  Wishlist   │
├─────────────┤      ├──────────────┤      ├─────────────┤
│ user_id PK  │──┐   │ address_id PK│      │wishlist_id  │
│ name        │  │   │ user_id FK   │◄─┐   │ user_id FK  │
│ phone       │  └──►│ address_type │  │   │ product_id  │
│ email       │      │ city         │  │   └─────────────┘
│ free_cash   │      │ pincode      │  │
└─────────────┘      └──────────────┘  │
       │                                │
       │ ┌──────────────┐              │
       ├─┤   Orders     │              │
       │ ├──────────────┤              │
       │ │ order_id PK  │              │
       │ │ user_id FK   │              │
       │ │ address_id FK├──────────────┘
       │ │ status       │
       │ │ final_amount │
       │ └──────────────┘
       │        │
       │        │ ┌──────────────┐
       │        └─┤ Order Items  │
       │          ├──────────────┤
       │          │order_item_id │
       │          │ order_id FK  │
       │          │ product_id FK│
       │          │ quantity     │
       │          └──────────────┘
       │
       │ ┌──────────────┐
       └─┤    Cart      │
         ├──────────────┤
         │ cart_id PK   │
         │ user_id FK   │
         │ product_id FK│
         │ quantity     │
         └──────────────┘

┌─────────────┐      ┌──────────────┐
│  Products   │      │ Categories   │
├─────────────┤      ├──────────────┤
│ product_id  │      │category_id PK│
│ name        │      │ name         │◄───┐
│ category_id │──────┤ parent_id FK ├────┘
│ offer_price │      │ icon_url     │
│ mrp_price   │      └──────────────┘
│ rating      │
│ inventory   │      ┌──────────────┐
└─────────────┘      │   Offers     │
                     ├──────────────┤
                     │ offer_id PK  │
                     │ offer_code   │
                     │ discount     │
                     │ valid_from   │
                     │ valid_to     │
                     └──────────────┘
```

---

## Appendix B: API Request/Response Examples

### Example 1: Place Order Flow

**Step 1: Validate Cart**
```
GET /api/cart
Response: { cart_items: [...], total: 450.00 }
```

**Step 2: Apply Offer**
```
POST /api/offers/validate
Request: { offer_code: "FLAT125", cart_value: 450.00 }
Response: { is_valid: true, discount: 125.00, final_amount: 325.00 }
```

**Step 3: Place Order**
```
POST /api/orders/place
Request: {
  address_id: 1,
  payment_method: "razorpay",
  offer_code: "FLAT125"
}
Response: {
  order_id: 1001,
  razorpay_order_id: "order_xxx",
  amount: 32500
}
```

**Step 4: Payment Verification**
```
POST /api/payment/verify
Request: {
  order_id: 1001,
  razorpay_payment_id: "pay_xxx",
  razorpay_signature: "sig_xxx"
}
Response: { status: "success", payment_status: "SUCCESS" }
```

---

## Appendix C: Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickmart
DB_USERNAME=admin
DB_PASSWORD=<encrypted>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<encrypted>

# JWT
JWT_SECRET=<encrypted>
JWT_EXPIRY=900000
REFRESH_TOKEN_EXPIRY=604800000

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=<encrypted>

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=<encrypted>
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps
GOOGLE_MAPS_API_KEY=<encrypted>

# Firebase
FCM_SERVER_KEY=<encrypted>

# AWS S3
AWS_ACCESS_KEY_ID=<encrypted>
AWS_SECRET_ACCESS_KEY=<encrypted>
S3_BUCKET_NAME=quickmart-prod

# Application
APP_ENV=production
LOG_LEVEL=INFO
PORT=8080
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 2025 | Tech Team | Initial document creation |

**Approval:**
- Technical Lead: ________________
- Product Manager: ________________
- CTO: ________________

**Next Review Date:** November 2025

---

*End of Technical Specification Document*
