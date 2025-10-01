# QuickMart API Endpoints Specification

**Version:** 1.0  
**Base URL:** `https://api.quickmart.com/v1`  
**Protocol:** HTTPS  
**Authentication:** JWT Bearer Token  
**Content-Type:** application/json

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User Management APIs](#2-user-management-apis)
3. [Address APIs](#3-address-apis)
4. [Product APIs](#4-product-apis)
5. [Category APIs](#5-category-apis)
6. [Cart APIs](#6-cart-apis)
7. [Order APIs](#7-order-apis)
8. [Payment APIs](#8-payment-apis)
9. [Offer APIs](#9-offer-apis)
10. [Wishlist APIs](#10-wishlist-apis)
11. [Review APIs](#11-review-apis)
12. [Notification APIs](#12-notification-apis)
13. [Search APIs](#13-search-apis)
14. [Location APIs](#14-location-apis)
15. [Admin APIs](#15-admin-apis)

---

## Common Response Formats

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { },
  "timestamp": "2025-10-01T10:30:00Z"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { },
    "path": "/api/endpoint",
    "timestamp": "2025-10-01T10:30:00Z"
  }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 1. Authentication APIs

### 1.1 Send OTP

**Endpoint:** `POST /api/auth/send-otp`  
**Authentication:** None  
**Rate Limit:** 3 requests per hour per phone number

**Request Body:**
```json
{
  "phone_number": "+919876543210",
  "country_code": "+91"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "phone_number": "+919876543210",
    "otp_expiry": "2025-10-01T10:05:00Z",
    "retry_after": 60
  }
}
```

**Error Responses:**
- `400` - Invalid phone number format
- `429` - Too many OTP requests
- `500` - SMS gateway error

---

### 1.2 Verify OTP & Login

**Endpoint:** `POST /api/auth/verify-otp`  
**Authentication:** None  
**Rate Limit:** 5 attempts per phone number

**Request Body:**
```json
{
  "phone_number": "+919876543210",
  "otp": "123456",
  "device_info": {
    "device_id": "unique_device_id",
    "device_type": "android",
    "fcm_token": "firebase_token_here"
  }
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "user_id": 1,
      "name": "John Doe",
      "phone_number": "+919876543210",
      "email": "john@example.com",
      "free_cash_balance": 75.00,
      "profile_image_url": "https://...",
      "is_new_user": false
    }
  }
}
```

**Error Responses:**
- `400` - Invalid OTP
- `401` - OTP expired
- `404` - Phone number not found
- `423` - Account locked due to too many attempts

---

### 1.3 Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`  
**Authentication:** Refresh Token Required  
**Rate Limit:** 10 requests per hour

**Request Headers:**
```
Authorization: Bearer <refresh_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token",
    "expires_in": 900
  }
}
```

---

### 1.4 Logout

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Rate Limit:** Unlimited

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## 2. User Management APIs

### 2.1 Get User Profile

**Endpoint:** `GET /api/user/profile`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "phone_number": "+919876543210",
    "email": "john@example.com",
    "free_cash_balance": 75.00,
    "profile_image_url": "https://...",
    "is_verified": true,
    "created_at": "2025-01-15T10:30:00Z",
    "last_login_at": "2025-10-01T09:00:00Z",
    "total_orders": 25,
    "lifetime_value": 5500.00
  }
}
```

---

### 2.2 Update User Profile

**Endpoint:** `PUT /api/user/profile`  
**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user_id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "updated_at": "2025-10-01T10:35:00Z"
  }
}
```

---

### 2.3 Upload Profile Picture

**Endpoint:** `POST /api/user/profile/picture`  
**Authentication:** Required  
**Content-Type:** multipart/form-data

**Request Body:**
```
image: [File] (max 5MB, jpg/png only)
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile picture uploaded successfully",
  "data": {
    "profile_image_url": "https://cdn.quickmart.com/users/1/profile.jpg"
  }
}
```

---

### 2.4 Get User Preferences

**Endpoint:** `GET /api/user/preferences`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "push_notifications": true,
    "email_notifications": true,
    "sms_notifications": true,
    "promotional_notifications": true,
    "order_updates": true,
    "language": "en",
    "theme": "light"
  }
}
```

---

### 2.5 Update User Preferences

**Endpoint:** `PUT /api/user/preferences`  
**Authentication:** Required

**Request Body:**
```json
{
  "push_notifications": false,
  "promotional_notifications": false,
  "theme": "dark"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Preferences updated successfully"
}
```

---

## 3. Address APIs

### 3.1 Get All Addresses

**Endpoint:** `GET /api/addresses`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "addresses": [
      {
        "address_id": 1,
        "address_type": "HOME",
        "address_label": "Home",
        "house_no": "123",
        "address_line1": "Main Street",
        "address_line2": "Near Park",
        "landmark": "Opposite Bank",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560001",
        "country": "India",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "is_default": true,
        "is_active": true
      }
    ],
    "count": 3
  }
}
```

---

### 3.2 Add New Address

**Endpoint:** `POST /api/addresses`  
**Authentication:** Required

**Request Body:**
```json
{
  "address_type": "HOME",
  "address_label": "Home",
  "house_no": "123",
  "address_line1": "Main Street",
  "address_line2": "Near Park",
  "landmark": "Opposite Bank",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "is_default": true
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Address added successfully",
  "data": {
    "address_id": 4,
    "address_type": "HOME",
    "is_serviceable": true,
    "estimated_delivery_time": "7 mins"
  }
}
```

**Error Responses:**
- `400` - Invalid address format
- `422` - Address not serviceable in this area

---

### 3.3 Update Address

**Endpoint:** `PUT /api/addresses/{address_id}`  
**Authentication:** Required

**Request Body:**
```json
{
  "house_no": "124",
  "is_default": true
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Address updated successfully",
  "data": {
    "address_id": 1,
    "updated_at": "2025-10-01T10:40:00Z"
  }
}
```

---

### 3.4 Delete Address

**Endpoint:** `DELETE /api/addresses/{address_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Address deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete default address (set another as default first)
- `404` - Address not found

---

### 3.5 Check Address Serviceability

**Endpoint:** `POST /api/addresses/check-serviceability`  
**Authentication:** Optional

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "pincode": "560001"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "is_serviceable": true,
    "delivery_time_mins": 7,
    "delivery_charges": 0.00,
    "min_order_value": 0.00,
    "zone_name": "Bangalore Central",
    "store_id": 1,
    "store_name": "QuickMart Hub - Koramangala"
  }
}
```

---

## 4. Product APIs

### 4.1 Get All Products

**Endpoint:** `GET /api/products`  
**Authentication:** Optional  
**Query Parameters:**

```
category_id: integer (optional)
subcategory_id: integer (optional)
brand_id: integer (optional)
latitude: decimal (required)
longitude: decimal (required)
page: integer (default: 1)
limit: integer (default: 20, max: 100)
sort_by: string (price_low, price_high, rating, popularity, new)
is_featured: boolean (optional)
is_bestseller: boolean (optional)
price_min: decimal (optional)
price_max: decimal (optional)
in_stock: boolean (optional, default: true)
```

**Example Request:**
```
GET /api/products?category_id=1&latitude=12.9716&longitude=77.5946&page=1&limit=20&sort_by=popularity
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "product_id": 1,
        "name": "Fresh Tomatoes",
        "slug": "fresh-tomatoes-500g",
        "description": "Farm fresh tomatoes",
        "category": {
          "category_id": 1,
          "name": "Fresh Vegetables"
        },
        "brand": {
          "brand_id": 1,
          "name": "FreshFarm"
        },
        "mrp_price": 50.00,
        "offer_price": 45.00,
        "discount_percentage": 10.00,
        "quantity_value": 500,
        "quantity_unit": "g",
        "image_urls": [
          "https://cdn.quickmart.com/products/1/main.jpg",
          "https://cdn.quickmart.com/products/1/alt1.jpg"
        ],
        "rating": 4.5,
        "total_ratings": 120,
        "is_available": true,
        "is_in_stock": true,
        "inventory_count": 50,
        "delivery_time_mins": 7,
        "is_returnable": false,
        "is_featured": true,
        "is_bestseller": false,
        "tags": ["organic", "fresh", "local"]
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

### 4.2 Get Product Details

**Endpoint:** `GET /api/products/{product_id}`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "product_id": 1,
    "name": "Fresh Tomatoes",
    "slug": "fresh-tomatoes-500g",
    "description": "Premium quality farm fresh tomatoes, carefully selected for freshness and taste.",
    "category": {
      "category_id": 1,
      "name": "Fresh Vegetables",
      "slug": "fresh-vegetables"
    },
    "subcategory": {
      "category_id": 11,
      "name": "Tomatoes & Potatoes"
    },
    "brand": {
      "brand_id": 1,
      "name": "FreshFarm",
      "logo_url": "https://..."
    },
    "sku": "FF-TOM-500",
    "barcode": "8901234567890",
    "mrp_price": 50.00,
    "offer_price": 45.00,
    "discount_percentage": 10.00,
    "tax_percentage": 0.00,
    "quantity_value": 500,
    "quantity_unit": "g",
    "weight_grams": 500,
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 8,
      "unit": "cm"
    },
    "image_urls": [
      "https://cdn.quickmart.com/products/1/main.jpg",
      "https://cdn.quickmart.com/products/1/alt1.jpg",
      "https://cdn.quickmart.com/products/1/alt2.jpg"
    ],
    "rating": 4.5,
    "total_ratings": 120,
    "total_reviews": 45,
    "is_available": true,
    "is_returnable": false,
    "is_featured": true,
    "is_bestseller": false,
    "is_new": false,
    "product_highlights": [
      "Farm fresh tomatoes",
      "No pesticides used",
      "Organically grown",
      "Rich in vitamins"
    ],
    "ingredients": "100% Fresh Tomatoes",
    "nutritional_info": {
      "serving_size": "100g",
      "calories": 18,
      "protein": "0.9g",
      "carbohydrates": "3.9g",
      "fat": "0.2g"
    },
    "storage_instructions": "Store in a cool, dry place",
    "usage_instructions": "Wash before use",
    "manufacturer_name": "FreshFarm Pvt Ltd",
    "manufacturer_address": "123 Farm Road, Bangalore",
    "country_of_origin": "India",
    "best_before_days": 5,
    "delivery_time_mins": 7,
    "inventory": {
      "in_stock": true,
      "quantity_available": 50
    },
    "offers_applicable": [
      {
        "offer_code": "FRESH10",
        "discount": "10% off"
      }
    ]
  }
}
```

---

### 4.3 Get Product by Slug

**Endpoint:** `GET /api/products/slug/{slug}`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    // Same as Get Product Details
  }
}
```

---

### 4.4 Get Similar Products

**Endpoint:** `GET /api/products/{product_id}/similar`  
**Authentication:** Optional  
**Query Parameters:**
```
limit: integer (default: 10, max: 20)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      // Array of product objects (simplified format)
    ],
    "count": 10
  }
}
```

---

### 4.5 Get Products by Brand

**Endpoint:** `GET /api/products/brand/{brand_id}`  
**Authentication:** Optional  
**Query Parameters:** Same as Get All Products

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "brand": {
      "brand_id": 1,
      "name": "FreshFarm",
      "logo_url": "https://..."
    },
    "products": [ ]
  },
  "pagination": { }
}
```

---

### 4.6 Get Featured Products

**Endpoint:** `GET /api/products/featured`  
**Authentication:** Optional  
**Query Parameters:**
```
latitude: decimal (required)
longitude: decimal (required)
limit: integer (default: 20)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [ ],
    "count": 20
  }
}
```

---

### 4.7 Get Bestseller Products

**Endpoint:** `GET /api/products/bestsellers`  
**Authentication:** Optional  
**Query Parameters:** Same as Featured Products

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [ ],
    "count": 20
  }
}
```

---

### 4.8 Get Trending Products

**Endpoint:** `GET /api/products/trending`  
**Authentication:** Optional  
**Query Parameters:**
```
latitude: decimal (required)
longitude: decimal (required)
limit: integer (default: 10)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "location": "Bangalore Central",
    "products": [ ],
    "count": 10
  }
}
```

---

### 4.9 Check Product Availability

**Endpoint:** `POST /api/products/check-availability`  
**Authentication:** Optional

**Request Body:**
```json
{
  "product_ids": [1, 2, 3, 4],
  "latitude": 12.9716,
  "longitude": 77.5946,
  "quantities": {
    "1": 2,
    "2": 1,
    "3": 3,
    "4": 1
  }
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "all_available": true,
    "products": [
      {
        "product_id": 1,
        "is_available": true,
        "quantity_requested": 2,
        "quantity_available": 50,
        "can_fulfill": true
      },
      {
        "product_id": 3,
        "is_available": true,
        "quantity_requested": 3,
        "quantity_available": 2,
        "can_fulfill": false,
        "message": "Only 2 units available"
      }
    ]
  }
}
```

---

## 5. Category APIs

### 5.1 Get All Categories

**Endpoint:** `GET /api/categories`  
**Authentication:** Optional  
**Query Parameters:**
```
include_subcategories: boolean (default: true)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "category_id": 1,
        "name": "Grocery & Kitchen",
        "slug": "grocery-kitchen",
        "icon_url": "https://cdn.quickmart.com/categories/1/icon.png",
        "banner_url": "https://cdn.quickmart.com/categories/1/banner.jpg",
        "display_order": 1,
        "product_count": 450,
        "subcategories": [
          {
            "category_id": 11,
            "name": "Fresh Vegetables",
            "slug": "fresh-vegetables",
            "icon_url": "https://...",
            "product_count": 85
          },
          {
            "category_id": 12,
            "name": "Daily Bread & Eggs",
            "slug": "daily-bread-eggs",
            "product_count": 42
          }
        ]
      }
    ],
    "count": 15
  }
}
```

---

### 5.2 Get Category Details

**Endpoint:** `GET /api/categories/{category_id}`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "category_id": 1,
    "name": "Grocery & Kitchen",
    "slug": "grocery-kitchen",
    "description": "Fresh groceries and kitchen essentials",
    "icon_url": "https://...",
    "banner_url": "https://...",
    "display_order": 1,
    "parent_category": null,
    "subcategories": [ ],
    "product_count": 450,
    "meta_title": "Grocery & Kitchen - QuickMart",
    "meta_description": "Shop fresh groceries..."
  }
}
```

---

### 5.3 Get Products by Category

**Endpoint:** `GET /api/categories/{category_id}/products`  
**Authentication:** Optional  
**Query Parameters:** Same as Get All Products

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "category": {
      "category_id": 1,
      "name": "Fresh Vegetables"
    },
    "products": [ ]
  },
  "pagination": { }
}
```

---

## 6. Cart APIs

### 6.1 Get Cart

**Endpoint:** `GET /api/cart`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "cart_items": [
      {
        "cart_id": 1,
        "product": {
          "product_id": 1,
          "name": "Fresh Tomatoes",
          "slug": "fresh-tomatoes-500g",
          "image_url": "https://...",
          "offer_price": 45.00,
          "mrp_price": 50.00,
          "quantity_unit": "500g",
          "is_available": true,
          "is_in_stock": true,
          "max_quantity_per_order": 10
        },
        "quantity": 2,
        "price_per_unit": 45.00,
        "total_price": 90.00,
        "added_at": "2025-10-01T09:00:00Z"
      }
    ],
    "summary": {
      "item_count": 5,
      "subtotal": 450.00,
      "delivery_charges": 0.00,
      "handling_charges": 2.00,
      "tax_amount": 0.00,
      "discount": 0.00,
      "free_cash_applicable": 50.00,
      "total": 452.00,
      "total_savings": 50.00
    },
    "applicable_offers": [
      {
        "offer_code": "FLAT125",
        "title": "Flat ₹125 OFF",
        "discount": 125.00,
        "min_order_value": 499.00,
        "can_apply": false,
        "message": "Add ₹49 more to apply this offer"
      }
    ]
  }
}
```

---

### 6.2 Add to Cart

**Endpoint:** `POST /api/cart/add`  
**Authentication:** Required

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Item added to cart",
  "data": {
    "cart_id": 1,
    "product_id": 1,
    "quantity": 2,
    "cart_summary": {
      "item_count": 5,
      "total": 452.00
    }
  }
}
```

**Error Responses:**
- `400` - Product not available
- `400` - Quantity exceeds available stock
- `400` - Maximum quantity limit exceeded

---

### 6.3 Update Cart Item

**Endpoint:** `PUT /api/cart/update`  
**Authentication:** Required

**Request Body:**
```json
{
  "cart_id": 1,
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart updated",
  "data": {
    "cart_id": 1,
    "quantity": 3,
    "total_price": 135.00,
    "cart_summary": {
      "item_count": 6,
      "total": 497.00
    }
  }
}
```

---

### 6.4 Remove from Cart

**Endpoint:** `DELETE /api/cart/remove/{cart_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Item removed from cart",
  "data": {
    "cart_summary": {
      "item_count": 4,
      "total": 362.00
    }
  }
}
```

---

### 6.5 Clear Cart

**Endpoint:** `DELETE /api/cart/clear`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart cleared successfully"
}
```

---

### 6.6 Add Multiple Items to Cart

**Endpoint:** `POST /api/cart/add-bulk`  
**Authentication:** Required

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 5,
      "quantity": 1
    },
    {
      "product_id": 8,
      "quantity": 3
    }
  ]
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Items added to cart",
  "data": {
    "added_count": 3,
    "failed_items": [],
    "cart_summary": {
      "item_count": 8,
      "total": 750.00
    }
  }
}
```

---

## 7. Order APIs

### 7.1 Place Order

**Endpoint:** `POST /api/orders/place`  
**Authentication:** Required

**Request Body:**
```json
{
  "delivery_address_id": 1,
  "payment_method": "razorpay",
  "offer_code": "FLAT125",
  "use_free_cash": true,
  "delivery_instructions": "Ring the bell twice",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 5,
      "quantity": 1
    }
  ]
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Order placed successfully",
  "data": {
    "order_id": 1001,
    "order_number": "QM1001202510",
    "status": "PENDING",
    "subtotal": 450.00,
    "discount": 125.00,
    "delivery_charges": 0.00,
    "free_cash_used": 50.00,
    "final_amount": 275.00,
    "estimated_delivery_time": "2025-10-01T10:15:00Z",
    "payment_details": {
      "payment_method": "razorpay",
      "razorpay_order_id": "order_xxx",
      "amount": 27500,
      "currency": "INR",
      "key": "rzp_live_xxx"
    },
    "created_at": "2025-10-01T10:08:00Z"
  }
}
```

**Error Responses:**
- `400` - Cart is empty
- `400` - Minimum order value not met
- `400` - Address not serviceable
- `400` - Products out of stock
- `422` - Invalid offer code

---

### 7.2 Get User Orders

**Endpoint:** `GET /api/orders`  
**Authentication:** Required  
**Query Parameters:**
```
status: string (optional: PENDING, CONFIRMED, DELIVERED, CANCELLED)
page: integer (default: 1)
limit: integer (default: 10)
from_date: date (optional)
to_date: date (optional)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order_id": 1001,
        "order_number": "QM1001202510",
        "status": "DELIVERED",
        "items_count": 3,
        "total_amount": 275.00,
        "payment_status": "SUCCESS",
        "estimated_delivery_time": "2025-10-01T10:15:00Z",
        "actual_delivery_time": "2025-10-01T10:12:00Z",
        "created_at": "2025-10-01T10:00:00Z",
        "items_preview": [
          {
            "product_name": "Fresh Tomatoes",
            "quantity": 2,
            "image_url": "https://..."
          }
        ],
        "can_reorder": true,
        "can_cancel": false,
        "can_rate": true
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

### 7.3 Get Order Details

**Endpoint:** `GET /api/orders/{order_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "order_id": 1001,
    "order_number": "QM1001202510",
    "status": "DELIVERED",
    "delivery_address": {
      "address_id": 1,
      "house_no": "123",
      "address_line1": "Main Street",
      "city": "Bangalore",
      "pincode": "560001",
      "phone_number": "+919876543210"
    },
    "items": [
      {
        "order_item_id": 1,
        "product_id": 1,
        "product_name": "Fresh Tomatoes",
        "product_image_url": "https://...",
        "quantity": 2,
        "unit_price": 45.00,
        "mrp_price": 50.00,
        "discount_amount": 10.00,
        "total_price": 90.00
      }
    ],
    "pricing": {
      "subtotal": 450.00,
      "discount": 125.00,
      "delivery_charges": 0.00,
      "handling_charges": 2.00,
      "tax_amount": 0.00,
      "free_cash_used": 50.00,
      "final_amount": 275.00,
      "total_savings": 175.00
    },
    "payment": {
      "payment_method": "razorpay",
      "payment_status": "SUCCESS",
      "payment_id": "pay_xxx",
      "transaction_id": "TXN123456",
      "paid_at": "2025-10-01T10:02:00Z"
    },
    "offer_applied": {
      "offer_code": "FLAT125",
      "discount": 125.00
    },
    "delivery": {
      "estimated_time": "2025-10-01T10:15:00Z",
      "actual_time": "2025-10-01T10:12:00Z",
      "delivery_partner": {
        "name": "Raj Kumar",
        "phone": "+919876543210"
      },
      "delivery_otp": "1234"
    },
    "timeline": [
      {
        "status": "PENDING",
        "timestamp": "2025-10-01T10:00:00Z",
        "message": "Order placed"
      },
      {
        "status": "CONFIRMED",
        "timestamp": "2025-10-01T10:01:00Z",
        "message": "Order confirmed"
      },
      {
        "status": "PACKED",
        "timestamp": "2025-10-01T10:05:00Z",
        "message": "Order packed"
      },
      {
        "status": "DISPATCHED",
        "timestamp": "2025-10-01T10:07:00Z",
        "message": "Out for delivery"
      },
      {
        "status": "DELIVERED",
        "timestamp": "2025-10-01T10:12:00Z",
        "message": "Order delivered"
      }
    ],
    "can_cancel": false,
    "can_reorder": true,
    "can_rate": true,
    "rating": null,
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

---

### 7.4 Track Order

**Endpoint:** `GET /api/orders/{order_id}/track`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "order_id": 1001,
    "order_number": "QM1001202510",
    "status": "OUT_FOR_DELIVERY",
    "estimated_delivery_time": "2025-10-01T10:15:00Z",
    "time_remaining_mins": 3,
    "delivery_partner": {
      "partner_id": 1,
      "name": "Raj Kumar",
      "phone": "+919876543210",
      "rating": 4.8,
      "vehicle_type": "Bike",
      "vehicle_number": "KA01AB1234",
      "current_location": {
        "latitude": 12.9700,
        "longitude": 77.5950
      },
      "photo_url": "https://..."
    },
    "customer_location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "distance_remaining_km": 0.5,
    "delivery_otp": "1234"
  }
}
```

---

### 7.5 Cancel Order

**Endpoint:** `PUT /api/orders/{order_id}/cancel`  
**Authentication:** Required

**Request Body:**
```json
{
  "reason": "Changed mind",
  "additional_comments": "Will order later"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order cancelled successfully",
  "data": {
    "order_id": 1001,
    "status": "CANCELLED",
    "refund_amount": 275.00,
    "refund_method": "Original payment method",
    "refund_eta": "3-5 business days",
    "cancelled_at": "2025-10-01T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - Order cannot be cancelled (already dispatched/delivered)
- `404` - Order not found

---

### 7.6 Reorder

**Endpoint:** `POST /api/orders/{order_id}/reorder`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Items added to cart",
  "data": {
    "added_items": 3,
    "unavailable_items": [
      {
        "product_name": "Product X",
        "reason": "Out of stock"
      }
    ],
    "cart_summary": {
      "item_count": 5,
      "total": 450.00
    }
  }
}
```

---

### 7.7 Rate Order

**Endpoint:** `POST /api/orders/{order_id}/rate`  
**Authentication:** Required

**Request Body:**
```json
{
  "rating": 5,
  "review_text": "Excellent service! Super fast delivery.",
  "delivery_rating": 5,
  "product_quality_rating": 5
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Thank you for your feedback!",
  "data": {
    "order_id": 1001,
    "rating": 5,
    "reviewed_at": "2025-10-01T11:00:00Z"
  }
}
```

---

### 7.8 Download Invoice

**Endpoint:** `GET /api/orders/{order_id}/invoice`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "invoice_url": "https://cdn.quickmart.com/invoices/1001.pdf",
    "invoice_number": "INV/2025/10/001",
    "generated_at": "2025-10-01T10:13:00Z"
  }
}
```

---

## 8. Payment APIs

### 8.1 Initiate Payment

**Endpoint:** `POST /api/payment/initiate`  
**Authentication:** Required

**Request Body:**
```json
{
  "order_id": 1001,
  "payment_method": "razorpay"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "payment_id": 1,
    "razorpay_order_id": "order_xxx",
    "amount": 27500,
    "currency": "INR",
    "key": "rzp_live_xxx",
    "name": "QuickMart",
    "description": "Order #QM1001202510",
    "image": "https://quickmart.com/logo.png",
    "prefill": {
      "name": "John Doe",
      "email": "john@example.com",
      "contact": "+919876543210"
    }
  }
}
```

---

### 8.2 Verify Payment

**Endpoint:** `POST /api/payment/verify`  
**Authentication:** Required

**Request Body:**
```json
{
  "order_id": 1001,
  "payment_id": 1,
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "order_id": 1001,
    "payment_status": "SUCCESS",
    "payment_method": "UPI",
    "transaction_id": "TXN123456",
    "paid_at": "2025-10-01T10:02:00Z"
  }
}
```

**Error Responses:**
- `400` - Invalid signature
- `400` - Payment verification failed

---

### 8.3 Process Refund

**Endpoint:** `POST /api/payment/refund`  
**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "payment_id": 1,
  "order_id": 1001,
  "amount": 275.00,
  "refund_type": "FULL",
  "reason": "Order cancelled by customer"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Refund initiated successfully",
  "data": {
    "refund_id": 1,
    "payment_id": 1,
    "order_id": 1001,
    "refund_amount": 275.00,
    "status": "PROCESSING",
    "gateway_refund_id": "rfnd_xxx",
    "eta": "3-5 business days",
    "initiated_at": "2025-10-01T10:30:00Z"
  }
}
```

---

### 8.4 Get Payment History

**Endpoint:** `GET /api/payment/history`  
**Authentication:** Required  
**Query Parameters:**
```
page: integer (default: 1)
limit: integer (default: 20)
from_date: date (optional)
to_date: date (optional)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "payment_id": 1,
        "order_id": 1001,
        "order_number": "QM1001202510",
        "amount": 275.00,
        "payment_method": "UPI",
        "status": "SUCCESS",
        "transaction_id": "TXN123456",
        "created_at": "2025-10-01T10:00:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

---

### 8.5 Get Saved Payment Methods

**Endpoint:** `GET /api/payment/methods`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "payment_methods": [
      {
        "method_id": 1,
        "method_type": "CARD",
        "card_brand": "Visa",
        "card_last4": "4242",
        "card_expiry_month": 12,
        "card_expiry_year": 2025,
        "is_default": true
      },
      {
        "method_id": 2,
        "method_type": "UPI",
        "upi_id": "john@paytm",
        "is_default": false
      }
    ]
  }
}
```

---

## 9. Offer APIs

### 9.1 Get Available Offers

**Endpoint:** `GET /api/offers`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "offers": [
      {
        "offer_id": 1,
        "offer_code": "FLAT125",
        "title": "Flat ₹125 OFF",
        "description": "On orders above ₹499",
        "offer_type": "FLAT",
        "discount_value": 125.00,
        "min_order_value": 499.00,
        "max_discount": null,
        "valid_from": "2025-10-01T00:00:00Z",
        "valid_to": "2025-10-31T23:59:59Z",
        "usage_per_user": 1,
        "remaining_usage": 1,
        "banner_url": "https://...",
        "terms_conditions": "Terms apply..."
      }
    ],
    "count": 5
  }
}
```

---

### 9.2 Validate Offer

**Endpoint:** `POST /api/offers/validate`  
**Authentication:** Required

**Request Body:**
```json
{
  "offer_code": "FLAT125",
  "cart_value": 550.00,
  "product_ids": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "is_valid": true,
    "offer_code": "FLAT125",
    "discount": 125.00,
    "final_amount": 425.00,
    "message": "Offer applied successfully"
  }
}
```

**Error Responses:**
- `400` - Invalid offer code
- `400` - Offer expired
- `400` - Minimum order value not met
- `400` - Offer already used
- `400` - Offer not applicable to cart items

---

### 9.3 Get Offer Details

**Endpoint:** `GET /api/offers/{offer_code}`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "offer_id": 1,
    "offer_code": "FLAT125",
    "title": "Flat ₹125 OFF",
    "description": "On orders above ₹499",
    "offer_type": "FLAT",
    "discount_value": 125.00,
    "min_order_value": 499.00,
    "valid_from": "2025-10-01T00:00:00Z",
    "valid_to": "2025-10-31T23:59:59Z",
    "applicable_categories": ["Grocery", "Fresh Vegetables"],
    "applicable_payment_methods": ["razorpay", "cred_pay"],
    "usage_limit": 1000,
    "usage_per_user": 1,
    "terms_conditions": "Full terms and conditions..."
  }
}
```

---

## 10. Wishlist APIs

### 10.1 Get Wishlist

**Endpoint:** `GET /api/wishlist`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "wishlist": [
      {
        "wishlist_id": 1,
        "product": {
          "product_id": 1,
          "name": "Fresh Tomatoes",
          "slug": "fresh-tomatoes-500g",
          "image_url": "https://...",
          "offer_price": 45.00,
          "mrp_price": 50.00,
          "is_available": true,
          "is_in_stock": true
        },
        "added_at": "2025-09-25T10:00:00Z"
      }
    ],
    "count": 5
  }
}
```

---

### 10.2 Add to Wishlist

**Endpoint:** `POST /api/wishlist/add`  
**Authentication:** Required

**Request Body:**
```json
{
  "product_id": 1
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Added to wishlist",
  "data": {
    "wishlist_id": 1,
    "product_id": 1
  }
}
```

---

### 10.3 Remove from Wishlist

**Endpoint:** `DELETE /api/wishlist/remove/{product_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Removed from wishlist"
}
```

---

### 10.4 Move Wishlist to Cart

**Endpoint:** `POST /api/wishlist/move-to-cart`  
**Authentication:** Required

**Request Body:**
```json
{
  "product_ids": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Items moved to cart",
  "data": {
    "moved_count": 3,
    "unavailable_items": [],
    "cart_summary": {
      "item_count": 5,
      "total": 450.00
    }
  }
}
```

---

## 11. Review APIs

### 11.1 Get Product Reviews

**Endpoint:** `GET /api/reviews/product/{product_id}`  
**Authentication:** Optional  
**Query Parameters:**
```
page: integer (default: 1)
limit: integer (default: 10)
rating_filter: integer (1-5, optional)
sort_by: string (recent, helpful, rating_high, rating_low)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "product_id": 1,
    "average_rating": 4.5,
    "total_reviews": 45,
    "rating_distribution": {
      "5": 25,
      "4": 15,
      "3": 3,
      "2": 1,
      "1": 1
    },
    "reviews": [
      {
        "review_id": 1,
        "user": {
          "name": "John D.",
          "profile_image_url": "https://..."
        },
        "rating": 5,
        "title": "Excellent quality!",
        "review_text": "Very fresh tomatoes, delivered quickly.",
        "images": ["https://..."],
        "is_verified_purchase": true,
        "helpful_count": 12,
        "created_at": "2025-09-28T14:30:00Z",
        "admin_response": null
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

---

### 11.2 Submit Product Review

**Endpoint:** `POST /api/reviews/product/{product_id}`  
**Authentication:** Required

**Request Body:**
```json
{
  "order_id": 1001,
  "rating": 5,
  "title": "Excellent quality!",
  "review_text": "Very fresh tomatoes, delivered quickly.",
  "images": ["base64_encoded_image"]
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Review submitted successfully. It will be published after approval.",
  "data": {
    "review_id": 1,
    "product_id": 1,
    "rating": 5,
    "is_approved": false
  }
}
```

---

### 11.3 Update Review

**Endpoint:** `PUT /api/reviews/{review_id}`  
**Authentication:** Required

**Request Body:**
```json
{
  "rating": 4,
  "title": "Good quality",
  "review_text": "Updated review text"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Review updated successfully"
}
```

---

### 11.4 Delete Review

**Endpoint:** `DELETE /api/reviews/{review_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Review deleted successfully"
}
```

---

### 11.5 Mark Review as Helpful

**Endpoint:** `POST /api/reviews/{review_id}/helpful`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Marked as helpful",
  "data": {
    "helpful_count": 13
  }
}
```

---

## 12. Notification APIs

### 12.1 Get Notifications

**Endpoint:** `GET /api/notifications`  
**Authentication:** Required  
**Query Parameters:**
```
page: integer (default: 1)
limit: integer (default: 20)
is_read: boolean (optional)
notification_type: string (optional)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "notification_id": 1,
        "notification_type": "ORDER_DELIVERED",
        "title": "Order Delivered!",
        "message": "Your order #QM1001202510 has been delivered",
        "data": {
          "order_id": 1001,
          "order_number": "QM1001202510"
        },
        "priority": "HIGH",
        "is_read": false,
        "created_at": "2025-10-01T10:12:00Z"
      }
    ],
    "unread_count": 5
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

### 12.2 Mark Notification as Read

**Endpoint:** `PUT /api/notifications/{notification_id}/read`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

### 12.3 Mark All Notifications as Read

**Endpoint:** `PUT /api/notifications/read-all`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "All notifications marked as read",
  "data": {
    "updated_count": 5
  }
}
```

---

### 12.4 Delete Notification

**Endpoint:** `DELETE /api/notifications/{notification_id}`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Notification deleted"
}
```

---

### 12.5 Register FCM Token

**Endpoint:** `POST /api/notifications/register-device`  
**Authentication:** Required

**Request Body:**
```json
{
  "fcm_token": "firebase_token_here",
  "device_type": "android",
  "device_id": "unique_device_id"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Device registered for push notifications"
}
```

---

## 13. Search APIs

### 13.1 Search Products

**Endpoint:** `GET /api/search`  
**Authentication:** Optional  
**Query Parameters:**
```
q: string (search query, required)
latitude: decimal (required)
longitude: decimal (required)
category_id: integer (optional)
page: integer (default: 1)
limit: integer (default: 20)
sort_by: string (relevance, price_low, price_high, rating)
```

**Example Request:**
```
GET /api/search?q=tomato&latitude=12.9716&longitude=77.5946&page=1&limit=20
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "query": "tomato",
    "results_count": 15,
    "products": [
      // Array of product objects
    ],
    "suggestions": [
      "fresh tomatoes",
      "tomato ketchup",
      "cherry tomatoes"
    ],
    "categories": [
      {
        "category_id": 1,
        "name": "Fresh Vegetables",
        "count": 10
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

---

### 13.2 Get Search Suggestions

**Endpoint:** `GET /api/search/suggestions`  
**Authentication:** Optional  
**Query Parameters:**
```
q: string (partial search query)
limit: integer (default: 10)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "suggestions": [
      "tomato",
      "tomato sauce",
      "tomato ketchup",
      "cherry tomatoes"
    ]
  }
}
```

---

### 13.3 Get Popular Searches

**Endpoint:** `GET /api/search/popular`  
**Authentication:** Optional

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "popular_searches": [
      "milk",
      "bread",
      "eggs",
      "tomatoes",
      "onions"
    ]
  }
}
```

---

## 14. Location APIs

### 14.1 Geocode Address

**Endpoint:** `POST /api/location/geocode`  
**Authentication:** Optional

**Request Body:**
```json
{
  "address": "123 Main Street, Bangalore, Karnataka 560001"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "formatted_address": "123 Main St, Bangalore, Karnataka 560001, India",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  }
}
```

---

### 14.2 Reverse Geocode

**Endpoint:** `POST /api/location/reverse-geocode`  
**Authentication:** Optional

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "formatted_address": "Koramangala, Bangalore, Karnataka 560001, India",
    "house_no": "",
    "address_line1": "Koramangala",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  }
}
```

---

### 14.3 Get Nearby Stores

**Endpoint:** `GET /api/location/nearby-stores`  
**Authentication:** Optional  
**Query Parameters:**
```
latitude: decimal (required)
longitude: decimal (required)
radius_km: decimal (default: 5)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "stores": [
      {
        "store_id": 1,
        "store_name": "QuickMart Hub - Koramangala",
        "address": "123 Service Road, Koramangala",
        "city": "Bangalore",
        "distance_km": 1.2,
        "delivery_time_mins": 7,
        "is_active": true,
        "operating_hours": {
          "monday": "08:00-22:00",
          "tuesday": "08:00-22:00"
        }
      }
    ]
  }
}
```

---

## 15. Admin APIs

### 15.1 Get All Orders (Admin)

**Endpoint:** `GET /api/admin/orders`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
status: string (optional)
store_id: integer (optional)
from_date: date (optional)
to_date: date (optional)
page: integer (default: 1)
limit: integer (default: 50)
search: string (order_number or phone)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order_id": 1001,
        "order_number": "QM1001202510",
        "customer_name": "John Doe",
        "customer_phone": "+919876543210",
        "status": "PENDING",
        "store_name": "Koramangala Hub",
        "items_count": 3,
        "total_amount": 275.00,
        "payment_status": "SUCCESS",
        "created_at": "2025-10-01T10:00:00Z"
      }
    ]
  },
  "pagination": {}
}
```

---

### 15.2 Update Order Status (Admin)

**Endpoint:** `PUT /api/admin/orders/{order_id}/status`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Order confirmed and ready for packing"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order status updated",
  "data": {
    "order_id": 1001,
    "status": "CONFIRMED",
    "updated_at": "2025-10-01T10:05:00Z"
  }
}
```

---

### 15.3 Assign Delivery Partner (Admin)

**Endpoint:** `PUT /api/admin/orders/{order_id}/assign-partner`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "partner_id": 1
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Delivery partner assigned",
  "data": {
    "order_id": 1001,
    "partner_id": 1,
    "partner_name": "Raj Kumar",
    "assigned_at": "2025-10-01T10:07:00Z"
  }
}
```

---

### 15.4 Get Dashboard Statistics (Admin)

**Endpoint:** `GET /api/admin/dashboard/stats`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
date: date (default: today)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "today": {
      "total_orders": 150,
      "pending_orders": 12,
      "confirmed_orders": 25,
      "dispatched_orders": 18,
      "delivered_orders": 85,
      "cancelled_orders": 10,
      "total_revenue": 45000.00,
      "average_order_value": 300.00,
      "average_delivery_time_mins": 6.5
    },
    "comparison": {
      "orders_growth": 15.5,
      "revenue_growth": 22.3
    },
    "realtime": {
      "active_orders": 35,
      "online_delivery_partners": 25,
      "average_prep_time_mins": 3.2
    }
  }
}
```

---

### 15.5 Manage Products (Admin)

#### Create Product
**Endpoint:** `POST /api/admin/products`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "Fresh Tomatoes",
  "slug": "fresh-tomatoes-500g",
  "description": "Farm fresh tomatoes",
  "category_id": 1,
  "subcategory_id": 11,
  "brand_id": 1,
  "sku": "FF-TOM-500",
  "barcode": "8901234567890",
  "mrp_price": 50.00,
  "offer_price": 45.00,
  "cost_price": 35.00,
  "tax_percentage": 0.00,
  "quantity_value": 500,
  "quantity_unit": "g",
  "weight_grams": 500,
  "is_returnable": false,
  "is_featured": true,
  "product_highlights": [
    "Farm fresh",
    "No pesticides"
  ],
  "manufacturer_name": "FreshFarm Pvt Ltd",
  "country_of_origin": "India",
  "best_before_days": 5
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "product_id": 1,
    "slug": "fresh-tomatoes-500g",
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

#### Update Product
**Endpoint:** `PUT /api/admin/products/{product_id}`  
**Authentication:** Required (Admin role)

**Request Body:** (Partial update supported)
```json
{
  "offer_price": 40.00,
  "is_available": true,
  "is_featured": true
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "product_id": 1,
    "updated_at": "2025-10-01T10:15:00Z"
  }
}
```

#### Delete Product
**Endpoint:** `DELETE /api/admin/products/{product_id}`  
**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

### 15.6 Manage Inventory (Admin)

#### Update Inventory
**Endpoint:** `PUT /api/admin/inventory`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "product_id": 1,
  "store_id": 1,
  "quantity_available": 100,
  "reorder_level": 20,
  "reorder_quantity": 50
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Inventory updated successfully",
  "data": {
    "product_id": 1,
    "store_id": 1,
    "quantity_available": 100,
    "updated_at": "2025-10-01T10:20:00Z"
  }
}
```

#### Get Low Stock Products
**Endpoint:** `GET /api/admin/inventory/low-stock`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
store_id: integer (optional)
limit: integer (default: 50)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "low_stock_products": [
      {
        "product_id": 1,
        "product_name": "Fresh Tomatoes",
        "store_id": 1,
        "store_name": "Koramangala Hub",
        "quantity_available": 5,
        "reorder_level": 20,
        "reorder_quantity": 50,
        "status": "CRITICAL"
      }
    ],
    "count": 15
  }
}
```

---

### 15.7 Manage Offers (Admin)

#### Create Offer
**Endpoint:** `POST /api/admin/offers`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "offer_code": "FLAT125",
  "title": "Flat ₹125 OFF",
  "description": "On orders above ₹499",
  "offer_type": "FLAT",
  "discount_value": 125.00,
  "min_order_value": 499.00,
  "max_discount": null,
  "valid_from": "2025-10-01T00:00:00Z",
  "valid_to": "2025-10-31T23:59:59Z",
  "usage_limit": 1000,
  "usage_per_user": 1,
  "applicable_categories": [1, 2, 3],
  "applicable_payment_methods": ["razorpay", "cred_pay"],
  "is_public": true,
  "terms_conditions": "Terms and conditions apply"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Offer created successfully",
  "data": {
    "offer_id": 1,
    "offer_code": "FLAT125",
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

#### Update Offer
**Endpoint:** `PUT /api/admin/offers/{offer_id}`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "is_active": false,
  "valid_to": "2025-10-15T23:59:59Z"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Offer updated successfully"
}
```

#### Delete Offer
**Endpoint:** `DELETE /api/admin/offers/{offer_id}`  
**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Offer deleted successfully"
}
```

---

### 15.8 Manage Categories (Admin)

#### Create Category
**Endpoint:** `POST /api/admin/categories`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "Fresh Vegetables",
  "slug": "fresh-vegetables",
  "parent_category_id": null,
  "icon_url": "https://...",
  "banner_url": "https://...",
  "display_order": 1,
  "description": "Fresh farm vegetables",
  "meta_title": "Fresh Vegetables - QuickMart",
  "meta_description": "Shop fresh vegetables online"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "category_id": 1,
    "slug": "fresh-vegetables",
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

---

### 15.9 Manage Users (Admin)

#### Get All Users
**Endpoint:** `GET /api/admin/users`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
page: integer (default: 1)
limit: integer (default: 50)
search: string (name, phone, email)
is_active: boolean (optional)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "user_id": 1,
        "name": "John Doe",
        "phone_number": "+919876543210",
        "email": "john@example.com",
        "total_orders": 25,
        "lifetime_value": 5500.00,
        "is_active": true,
        "created_at": "2025-01-15T10:30:00Z",
        "last_order_at": "2025-10-01T10:00:00Z"
      }
    ]
  },
  "pagination": {}
}
```

#### Get User Details
**Endpoint:** `GET /api/admin/users/{user_id}`  
**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "phone_number": "+919876543210",
    "email": "john@example.com",
    "free_cash_balance": 75.00,
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "statistics": {
      "total_orders": 25,
      "completed_orders": 23,
      "cancelled_orders": 2,
      "lifetime_value": 5500.00,
      "average_order_value": 220.00,
      "last_order_date": "2025-10-01T10:00:00Z"
    },
    "recent_orders": [
      // Array of recent order objects
    ]
  }
}
```

#### Block/Unblock User
**Endpoint:** `PUT /api/admin/users/{user_id}/block`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "is_active": false,
  "reason": "Suspicious activity"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User blocked successfully"
}
```

---

### 15.10 Manage Delivery Partners (Admin)

#### Get All Delivery Partners
**Endpoint:** `GET /api/admin/delivery-partners`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
status: string (optional: ONLINE, OFFLINE, BUSY)
page: integer (default: 1)
limit: integer (default: 50)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "partners": [
      {
        "partner_id": 1,
        "name": "Raj Kumar",
        "phone_number": "+919876543210",
        "vehicle_type": "Bike",
        "vehicle_number": "KA01AB1234",
        "status": "ONLINE",
        "rating": 4.8,
        "total_deliveries": 450,
        "successful_deliveries": 445,
        "success_rate": 98.89,
        "current_orders": 1,
        "is_active": true
      }
    ]
  },
  "pagination": {}
}
```

#### Create Delivery Partner
**Endpoint:** `POST /api/admin/delivery-partners`  
**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "phone_number": "+919876543210",
  "email": "raj@example.com",
  "vehicle_type": "Bike",
  "vehicle_number": "KA01AB1234",
  "driving_license": "DL123456789",
  "aadhar_number": "1234-5678-9012"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Delivery partner created successfully",
  "data": {
    "partner_id": 1,
    "name": "Raj Kumar",
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

---

### 15.11 Analytics & Reports (Admin)

#### Get Sales Report
**Endpoint:** `GET /api/admin/reports/sales`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
from_date: date (required)
to_date: date (required)
store_id: integer (optional)
group_by: string (day, week, month)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "period": {
      "from": "2025-10-01",
      "to": "2025-10-31"
    },
    "summary": {
      "total_orders": 450,
      "completed_orders": 420,
      "cancelled_orders": 30,
      "total_revenue": 135000.00,
      "average_order_value": 300.00,
      "total_discount_given": 15000.00,
      "total_delivery_charges": 5000.00
    },
    "daily_breakdown": [
      {
        "date": "2025-10-01",
        "orders": 15,
        "revenue": 4500.00,
        "average_order_value": 300.00
      }
    ],
    "top_products": [
      {
        "product_id": 1,
        "product_name": "Fresh Tomatoes",
        "quantity_sold": 250,
        "revenue": 11250.00
      }
    ],
    "top_categories": [
      {
        "category_id": 1,
        "category_name": "Fresh Vegetables",
        "orders": 120,
        "revenue": 36000.00
      }
    ]
  }
}
```

#### Get Customer Analytics
**Endpoint:** `GET /api/admin/reports/customers`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
from_date: date (required)
to_date: date (required)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "total_customers": 1500,
    "new_customers": 150,
    "active_customers": 800,
    "retention_rate": 65.5,
    "churn_rate": 5.2,
    "customer_segments": {
      "high_value": 150,
      "medium_value": 600,
      "low_value": 750
    },
    "top_customers": [
      {
        "user_id": 1,
        "name": "John Doe",
        "total_orders": 25,
        "lifetime_value": 5500.00
      }
    ]
  }
}
```

#### Get Inventory Report
**Endpoint:** `GET /api/admin/reports/inventory`  
**Authentication:** Required (Admin role)  
**Query Parameters:**
```
store_id: integer (optional)
status: string (optional: low_stock, out_of_stock, overstocked)
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "total_products": 5000,
      "in_stock": 4500,
      "low_stock": 350,
      "out_of_stock": 150,
      "total_inventory_value": 2500000.00
    },
    "products": [
      {
        "product_id": 1,
        "product_name": "Fresh Tomatoes",
        "store_name": "Koramangala Hub",
        "quantity_available": 5,
        "reorder_level": 20,
        "status": "LOW_STOCK",
        "days_until_stockout": 2
      }
    ]
  }
}
```

---

## 16. Webhook Endpoints

### 16.1 Razorpay Payment Webhook

**Endpoint:** `POST /api/webhooks/razorpay`  
**Authentication:** Razorpay signature verification

**Request Body:**
```json
{
  "entity": "event",
  "account_id": "acc_xxx",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxx",
        "amount": 27500,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_xxx",
        "method": "upi"
      }
    }
  },
  "created_at": 1696147200
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Webhook processed"
}
```

---

## 17. Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Authentication token missing or invalid |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `VALIDATION_ERROR` | 422 | Business validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `PRODUCT_NOT_AVAILABLE` | 400 | Product is not available |
| `OUT_OF_STOCK` | 400 | Product is out of stock |
| `INVALID_OTP` | 400 | OTP is invalid or expired |
| `CART_EMPTY` | 400 | Cart is empty |
| `MIN_ORDER_NOT_MET` | 400 | Minimum order value not met |
| `ADDRESS_NOT_SERVICEABLE` | 422 | Address is outside service area |
| `OFFER_INVALID` | 400 | Offer code is invalid or expired |
| `PAYMENT_FAILED` | 400 | Payment processing failed |
| `ORDER_CANNOT_CANCEL` | 400 | Order cannot be cancelled |

---

## 18. Rate Limiting

### Default Rate Limits

| Endpoint Category | Authenticated | Unauthenticated |
|------------------|---------------|-----------------|
| Authentication | 5 req/min | 3 req/hour (OTP) |
| Product Listing | 100 req/min | 20 req/min |
| Cart Operations | 60 req/min | N/A |
| Order Operations | 30 req/min | N/A |
| Payment | 10 req/min | N/A |
| Search | 60 req/min | 30 req/min |
| Admin APIs | 200 req/min | N/A |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696147200
Retry-After: 60
```

---

## 19. API Versioning

The API uses URI versioning:
- Current version: `/v1`
- All endpoints are prefixed with `/api/v1/`

When a new version is released:
- Previous version remains supported for minimum 6 months
- Deprecation warnings included in response headers
- Migration guide provided in documentation

---

## 20. Testing Endpoints

### Health Check
**Endpoint:** `GET /health`  
**Authentication:** None

**Success Response (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-10-01T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "elasticsearch": "connected"
  }
}
```

### API Info
**Endpoint:** `GET /api/v1/info`  
**Authentication:** None

**Success Response (200):**
```json
{
  "api_version": "1.0.0",
  "environment": "production",
  "documentation": "https://docs.quickmart.com",
  "support": "support@quickmart.com"
}
```

---

## 21. Best Practices for API Integration

### Authentication
- Always include `Authorization: Bearer <token>` header for authenticated requests
- Refresh tokens before they expire
- Store tokens securely (never in localStorage for web apps)
- Implement automatic token refresh logic

### Error Handling
- Always check the `status` field in response
- Display user-friendly error messages from `error.message`
- Log `error.code` for debugging
- Implement retry logic for `503` and `429` errors

### Performance
- Use pagination for list endpoints
- Implement caching for frequently accessed data
- Compress request/response using gzip
- Use conditional requests with ETags

### Security
- Always use HTTPS
- Validate all user inputs
- Never log sensitive information
- Implement CSRF protection for web apps
- Use appropriate CORS settings

---

## 22. SDKs and Client Libraries

### Official SDKs
- **JavaScript/TypeScript:** `@quickmart/js-sdk`
- **React:** `@quickmart/react-sdk`
- **React Native:** `@quickmart/react-native-sdk`
- **Java/Spring:** `com.quickmart:java-sdk`

### Installation
```bash
npm install @quickmart/js-sdk
```

### Usage Example
```javascript
import { QuickMartClient } from '@quickmart/js-sdk';

const client = new QuickMartClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Get products
const products = await client.products.list({
  category_id: 1,
  latitude: 12.9716,
  longitude: 77.5946
});

// Add to cart
await client.cart.add({
  product_id: 1,
  quantity: 2
});
```

---

## 23. Support & Resources

### Documentation
- API Documentation: https://docs.quickmart.com
- Developer Portal: https://developers.quickmart.com
- Changelog: https://docs.quickmart.com/changelog

### Support Channels
- Email: api-support@quickmart.com
- Developer Forum: https://community.quickmart.com
- Slack Community: https://slack.quickmart.com
- GitHub Issues: https://github.com/quickmart/api-issues

### SLA & Uptime
- API Uptime: 99.9%
- Support Response Time: 24 hours
- Critical Issue Response: 2 hours
- Status Page: https://status.quickmart.com

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** QuickMart Engineering Team

---
