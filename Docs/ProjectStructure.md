# QuickMart - Complete Project Structure

## 📁 **Root Directory Structure**

```
quickmart/
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginModal.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   └── AuthGuard.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── ProfileTab.jsx
│   │   │   ├── AddressTab.jsx
│   │   │   ├── OrdersTab.jsx
│   │   │   ├── FavoritesTab.jsx
│   │   │   └── AddressForm.jsx
│   │   │
│   │   ├── shopping/
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ProductModal.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartModal.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── FloatingCartButton.jsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── AddressSelector.jsx
│   │   │   ├── PaymentSection.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   └── PaymentSuccess.jsx
│   │   │
│   │   └── tracking/
│   │       ├── OrderTrackingModal.jsx
│   │       ├── OrderTimeline.jsx
│   │       ├── DeliveryPartnerInfo.jsx
│   │       ├── LiveUpdates.jsx
│   │       ├── OrderProgress.jsx
│   │       └── ActiveOrdersWidget.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── orderTrackingService.js
│   │   ├── paymentService.js
│   │   ├── productService.js
│   │   ├── addressService.js
│   │   └── notificationService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useOrderTracking.js
│   │   ├── useLocalStorage.js
│   │   └── useNotifications.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── OrderContext.jsx
│   │   └── AppContext.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── api.js
│   │
│   ├── data/
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── mockUsers.js
│   │   └── deliveryPartners.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   ├── App.jsx
│   ├── index.js
│   └── reportWebVitals.js
│
├── backend/ (Node.js/Express)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── paymentController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Address.js
│   │   └── Payment.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── payments.js
│   │   └── users.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   │
│   ├── services/
│   │   ├── smsService.js
│   │   ├── paymentService.js
│   │   ├── deliveryService.js
│   │   └── notificationService.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── razorpay.js
│   │   ├── sms.js
│   │   └── env.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── mobile/ (React Native - Future)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── services/
│   │
│   ├── android/
│   ├── ios/
│   ├── package.json
│   └── metro.config.js
│
├── admin/ (Admin Dashboard)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
├── deployment/
│   ├── docker/
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── nginx.conf
│   │
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   │
│   └── scripts/
│       ├── deploy.sh
│       ├── backup.sh
│       └── migrate.sh
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
├── README.md
└── LICENSE
```

## 📋 **Detailed File Breakdown**

### **🔐 Authentication Components**

#### **`src/components/auth/LoginModal.jsx`**
```jsx
import React, { useState } from 'react';
import { Phone, ArrowRight, X } from 'lucide-react';
import { authService } from '../../services/authService';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // Phone number input and OTP verification logic
  // Form validation and error handling
  // Loading states and user feedback
};

export default LoginModal;
```

#### **`src/components/auth/OTPVerification.jsx`**
```jsx
import React, { useState, useEffect } from 'react';

const OTPVerification = ({ phoneNumber, onVerify, onResend }) => {
  // OTP input handling
  // Timer for resend functionality
  // Auto-focus and validation
};

export default OTPVerification;
```

### **👤 Profile Management Components**

#### **`src/components/profile/ProfileModal.jsx`**
```jsx
import React, { useState } from 'react';
import ProfileTab from './ProfileTab';
import AddressTab from './AddressTab';
import OrdersTab from './OrdersTab';
import FavoritesTab from './FavoritesTab';

const ProfileModal = ({ isOpen, onClose, user, onUpdateUser, onLogout }) => {
  // Tab navigation logic
  // Modal state management
  // User data propagation to tabs
};

export default ProfileModal;
```

#### **`src/components/profile/AddressTab.jsx`**
```jsx
import React, { useState } from 'react';
import AddressForm from './AddressForm';
import { addressService } from '../../services/addressService';

const AddressTab = ({ user, onUpdateUser }) => {
  // Address CRUD operations
  // Default address management
  // Address validation
};

export default AddressTab;
```

### **📦 Order Tracking Components**

#### **`src/components/tracking/OrderTrackingModal.jsx`**
```jsx
import React, { useState, useEffect } from 'react';
import OrderTimeline from './OrderTimeline';
import DeliveryPartnerInfo from './DeliveryPartnerInfo';
import LiveUpdates from './LiveUpdates';

const OrderTrackingModal = ({ isOpen, onClose, order }) => {
  // Real-time order updates
  // WebSocket integration
  // Status progression logic
};

export default OrderTrackingModal;
```

#### **`src/components/tracking/OrderTimeline.jsx`**
```jsx
import React from 'react';
import { CheckCircle, Package, Truck } from 'lucide-react';

const OrderTimeline = ({ timeline, currentStatus }) => {
  // Visual timeline representation
  // Status icons and colors
  // Progress indicators
};

export default OrderTimeline;
```

### **🛍️ Shopping Components**

#### **`src/components/shopping/ProductGrid.jsx`**
```jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart, userFavorites }) => {
  // Product layout and rendering
  // Infinite scroll implementation
  // Filter and sort integration
};

export default ProductGrid;
```

### **🛒 Cart Components**

#### **`src/components/cart/CartModal.jsx`**
```jsx
import React from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartModal = ({ isOpen, onClose, cart, onUpdateCart, onCheckout }) => {
  // Cart item management
  // Price calculations
  // Checkout navigation
};

export default CartModal;
```

## 🔧 **Services Layer**

### **`src/services/authService.js`**
```javascript
class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL;
    this.currentUser = this.loadUserFromStorage();
  }

  // OTP generation and verification
  // User authentication
  // Session management
  // Profile updates
}

export const authService = new AuthService();
```

### **`src/services/orderTrackingService.js`**
```javascript
class OrderTrackingService {
  constructor() {
    this.wsConnection = null;
    this.activeOrders = new Map();
  }

  // Order creation and tracking
  // Real-time updates via WebSocket
  // Delivery partner assignment
  // Status progression simulation
  // Notification triggers
}

export const orderTrackingService = new OrderTrackingService();
```

### **`src/services/paymentService.js`**
```javascript
class PaymentService {
  constructor() {
    this.razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
  }

  // Razorpay integration
  // Payment processing
  // Order creation
  // Refund handling
}

export const paymentService = new PaymentService();
```

## 🎯 **Context Providers**

### **`src/context/AuthContext.jsx`**
```jsx
import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Global authentication state
  // User session management
  // Login/logout actions
};
```

### **`src/context/CartContext.jsx`**
```jsx
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Cart state management
  // Add/remove items
  // Price calculations
  // Persistence logic
};
```

## 🔗 **Custom Hooks**

### **`src/hooks/useAuth.js`**
```javascript
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication state management
  // Login/logout functions
  // User data updates
  
  return { user, loading, login, logout, updateUser };
};
```

### **`src/hooks/useOrderTracking.js`**
```javascript
import { useState, useEffect } from 'react';
import { orderTrackingService } from '../services/orderTrackingService';

export const useOrderTracking = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time order updates
  // WebSocket connection management
  // Order status changes
  
  return { order, loading, progress, estimatedTime };
};
```

## 🛠️ **Utility Functions**

### **`src/utils/constants.js`**
```javascript
export const ORDER_STATUS = {
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  PACKED: 'packed',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ADDRESS_TYPES = {
  HOME: 'Home',
  OFFICE: 'Office',
  OTHER: 'Other'
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  ORDERS: '/api/orders',
  PRODUCTS: '/api/products',
  PAYMENTS: '/api/payments'
};
```

### **`src/utils/validators.js`**
```javascript
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### **`src/utils/formatters.js`**
```javascript
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
```

## 📊 **Data Layer**

### **`src/data/products.js`**
```javascript
export const products = [
  {
    id: 1,
    name: 'Fresh Bananas',
    price: 40,
    image: '/images/banana.jpg',
    category: 'fruits',
    rating: 4.5,
    discount: 10,
    description: 'Fresh, ripe bananas from local farms',
    nutritionalInfo: {
      calories: 89,
      carbs: 23,
      fiber: 2.6
    },
    inStock: true,
    stockQuantity: 150
  },
  // ... more products
];

export const categories = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
  // ... more categories
];
```

## 🔧 **Backend Structure**

### **`backend/server.js`**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **`backend/controllers/authController.js`**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const smsService = require('../services/smsService');

const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Generate and send OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    await smsService.sendOTP(phoneNumber, otp);
    
    // Store OTP temporarily (Redis recommended)
    // Return success response
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const verifyOTP = async (req, res) => {
  // OTP verification logic
  // User creation/login
  // JWT token generation
};

module.exports = { sendOTP, verifyOTP };
```

## 📱 **Package Dependencies**

### **`package.json`**
```json
{
  "name": "quickmart",
  "version": "1.0.0",
  "description": "Quick grocery delivery app like Zepto",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "concurrently \"npm start\" \"cd backend && npm run dev\"",
    "build:prod": "npm run build && cd backend && npm run build",
    "deploy": "npm run build:prod && ./deployment/scripts/deploy.sh"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1",
    "axios": "^1.3.0",
    "socket.io-client": "^4.6.0",
    "react-query": "^3.39.0",
    "zustand": "^4.3.0",
    "framer-motion": "^10.0.0",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.29.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "concurrently": "^7.6.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0"
  }
}
```

### **`backend/package.json`**
```json
{
  "name": "quickmart-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "express-rate-limit": "^6.7.0",
    "socket.io": "^4.6.0",
    "razorpay": "^2.8.0",
    "twilio": "^4.7.0",
    "redis": "^4.6.0",
    "winston": "^3.8.0",
    "joi": "^17.7.0",
    "multer": "^1.4.5",
    "cloudinary": "^1.35.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.3.0",
    "supertest": "^6.3.0"
  }
}
```

## 🚀 **Deployment Configuration**

### **`deployment/docker/Dockerfile`**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### **`deployment/docker/docker-compose.yml`**
```yaml
version: '3.8'

services:
  quickmart-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - quickmart-backend
      - redis
      - mongodb

  quickmart-backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/quickmart
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
```

## 📚 **Documentation Files**

### **`docs/API_DOCUMENTATION.md`**
```markdown
# QuickMart API Documentation

## Authentication Endpoints

### POST /api/auth/send-otp
Send OTP to phone number

### POST /api/auth/verify-otp
Verify OTP and login/register user

## Order Endpoints

### POST /api/orders
Create new order

### GET /api/orders/:id/track
Get order tracking information

### PUT /api/orders/:id/status
Update order status (Admin only)
```

### **`README.md`**
```markdown
# QuickMart - Quick Grocery Delivery App

A modern, mobile-first grocery delivery application built with React.js, similar to Zepto.

## Features

- 🛒 **Shopping Experience** - Browse products, categories, search
- 🔐 **Authentication** - Phone OTP login system
- 👤 **Profile Management** - User profiles and address management
- 📦 **Order Tracking** - Real-time order status updates
- 💳 **Payment Integration** - Razorpay payment gateway
- 📱 **Mobile Optimized** - Responsive design for all devices

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/quickmart.git
cd quickmart

# Install dependencies
npm install
cd backend && npm install

# Start development servers
npm run dev
```

## Environment Variables

Create `.env` file in root directory:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

## Deployment

```bash
# Build for production
npm run build:prod

# Deploy to cloud
npm run deploy
```
```

## 🔒 **Environment Configuration**

### **`.env.example`**
```env
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxx
REACT_APP_ENVIRONMENT=development
REACT_APP_SENTRY_DSN=your_sentry_dsn

# Backend Environment Variables (backend/.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🎯 **Key Implementation Notes**

### **1. Modular Architecture:**
- **Separation of concerns** - Each feature in its own module
- **Reusable components** - Common UI components shared across features
- **Service layer** - Business logic separated from UI
- **Context providers** - Global state management

### **2. Scalability:**
- **Component composition** - Small, focused components
- **Custom hooks** - Reusable logic extraction
- **State management** - Centralized with Context API/Zustand
- **API abstraction** - Service layer for all backend calls

### **3. Production Ready:**
- **Error boundaries** - Graceful error handling
- **Loading states** - Smooth user experience
- **Input validation** - Client and server-side validation
- **Security** - JWT authentication, rate limiting, CORS

### **4. Development Workflow:**
- **Hot reloading** - Fast development cycle
- **Testing setup** - Unit, integration, and E2E tests
- **Linting** - Code quality enforcement
- **Documentation** - Comprehensive API and setup docs

This structure provides a **professional, scalable foundation** for building a production-ready grocery delivery app like Zepto! 🚀
