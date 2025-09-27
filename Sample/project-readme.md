# 🛒 QuickMart - Quick Grocery Delivery App

A modern, mobile-first grocery delivery application built with React.js and Node.js, similar to Zepto, Blinkit, and other quick commerce platforms.

![QuickMart Demo](https://img.shields.io/badge/Demo-Live-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## ✨ **Features**

### 🛍️ **Shopping Experience**
- **Product Browsing** - Browse by categories with search functionality
- **Smart Cart** - Add/remove items with quantity controls and price calculations
- **Discounts & Offers** - Product discounts and promotional pricing
- **Mobile-First Design** - Optimized for mobile devices

### 🔐 **Authentication & Profile**
- **Phone OTP Login** - Secure authentication with SMS verification
- **User Profiles** - Complete profile management with personal information
- **Address Management** - Full CRUD operations for delivery addresses
- **Session Management** - Persistent login sessions

### 📦 **Order Management & Tracking**
- **Real-Time Order Tracking** - Live order status updates with timeline
- **Delivery Partner Info** - Partner details with contact options
- **Order History** - Complete order history with status tracking
- **Payment Integration** - Razorpay payment gateway integration

### 🚚 **Delivery Features**
- **Live Tracking** - Real-time order progression
- **Delivery Partner Assignment** - Automatic partner allocation
- **ETA Calculations** - Smart delivery time estimates
- **Status Notifications** - Order status change notifications

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ installed
- npm or yarn package manager
- MongoDB running locally (optional for development)
- VS Code or preferred IDE

### **1. Clone/Download Project**
```bash
# Method 1: Create new project
mkdir quickmart && cd quickmart

# Method 2: If you have git repository
git clone https://github.com/your-username/quickmart.git
cd quickmart
```

### **2. Setup Frontend**
```bash
# Create React app
npx create-react-app . --template typescript

# Install dependencies
npm install lucide-react axios socket.io-client react-query zustand framer-motion react-hot-toast date-fns

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer concurrently
npx tailwindcss init -p
```

### **3. Setup Backend**
```bash
# Create backend directory
mkdir backend && cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcrypt jsonwebtoken cors helmet express-rate-limit socket.io razorpay twilio redis winston joi

# Install dev dependencies
npm install -D nodemon jest supertest

cd ..
```

### **4. Configure Environment**

**Create `.env` in root:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=rzp_test_1234567890
```

**Create `backend/.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmart
JWT_SECRET=your_jwt_secret_here
```

### **5. Copy QuickMart Code**
- **Replace `src/App.js`** with the QuickMart component code
- **Replace `src/index.css`** with Tailwind configuration
- **Add `backend/server.js`** with the backend code

### **6. Start Development**
```bash
# Start both frontend and backend
npm run dev

# OR start separately
npm start                    # Frontend: http://localhost:3000
npm run backend             # Backend: http://localhost:5000
```

## 📱 **Usage**

### **Demo Credentials**
- **Phone Number:** `9876543210`
- **OTP:** Will be displayed on screen during login

### **Testing Flow**
1. **Browse Products** - Add items to cart
2. **Login** - Use demo phone number and OTP
3. **Checkout** - Complete payment flow
4. **Track Order** - Watch real-time status updates
5. **Profile** - Manage addresses and view order history

## 🏗️ **Project Structure**

```
quickmart/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── profile/        # Profile management
│   │   ├── shopping/       # Product browsing
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   └── tracking/       # Order tracking
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions
│   └── data/               # Mock data and constants
├── backend/
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic services
│   └── config/            # Configuration files
└── deployment/            # Docker and deployment configs
```

## 🔧 **Technology Stack**

### **Frontend**
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Query** - Server state management
- **Zustand** - Client state management

### **Backend**
- **Node.js + Express** - Web application framework
- **MongoDB + Mongoose** - Database and ODM
- **Redis** - Caching and session storage
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication tokens
- **Razorpay** - Payment processing
- **Twilio** - SMS/OTP service

### **DevOps & Deployment**
- **Docker** - Containerization
- **Docker Compose** - Multi-container applications
- **Kubernetes** - Container orchestration
- **Nginx** - Reverse proxy and load balancing

## 📊 **Features Roadmap**

### **✅ Completed**
- [x] Product browsing and search
- [x] Shopping cart functionality
- [x] User authentication (Phone OTP)
- [x] Profile and address management
- [x] Order placement and payment
- [x] Real-time order tracking
- [x] Delivery partner integration

### **🚧 In Progress**
- [ ] Push notifications
- [ ] Advanced search and filters
- [ ] Loyalty program
- [ ] Admin dashboard

### **📋 Planned**
- [ ] Mobile app (React Native)
- [ ] Delivery partner app
- [ ] Analytics dashboard
- [ ] Multi-vendor support
- [ ] Subscription orders
- [ ] Live chat support

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 **Support**

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-username/quickmart/issues)
- **Email:** support@quickmart.com
- **Discord:** [QuickMart Community](https://discord.gg/quickmart)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Inspired by Zepto, Blinkit, and other quick commerce platforms
- Built with modern web technologies and best practices
- Designed for scalability and maintainability

---

**Made with ❤️ for the future of quick commerce**