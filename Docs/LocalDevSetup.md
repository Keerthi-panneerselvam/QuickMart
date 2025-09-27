# QuickMart - Local Development Setup Guide

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create Project Folder**
```bash
# Open terminal/command prompt
mkdir quickmart
cd quickmart
```

### **Step 2: Initialize React App**
```bash
# Create React app with Vite (faster) or Create React App
npx create-react-app . --template typescript
# OR for faster development:
npm create vite@latest . -- --template react

# Install dependencies
npm install lucide-react
```

### **Step 3: Copy the Complete Code**

**Replace `src/App.js` (or `src/App.jsx`) with the QuickMart code:**

1. **Open VS Code** in your project folder:
   ```bash
   code .
   ```

2. **Delete existing** `src/App.js` content

3. **Copy the complete QuickMart code** from the artifact above and paste it into `src/App.js`

4. **Update the import** (if using Create React App):
   ```javascript
   // Add this to src/App.js if needed
   import './App.css';
   ```

### **Step 4: Install Tailwind CSS**
```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add to `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Step 5: Start Development Server**
```bash
npm start
```

🎉 **Your QuickMart app should now be running at `http://localhost:3000`!**

---

## 📁 **Complete Project Setup (Full Structure)**

If you want the complete modular structure, follow these steps:

### **Step 1: Create Full Directory Structure**
```bash
mkdir quickmart
cd quickmart

# Create directory structure
mkdir -p src/{components/{auth,profile,shopping,cart,checkout,tracking,common},services,hooks,context,utils,data,styles}
mkdir -p backend/{controllers,models,routes,middleware,services,config,utils}
mkdir -p docs tests deployment/{docker,kubernetes,scripts}
```

### **Step 2: Initialize Both Frontend and Backend**

#### **Frontend Setup:**
```bash
# Initialize React app
npx create-react-app . --template typescript

# Install dependencies
npm install lucide-react axios socket.io-client react-query zustand framer-motion react-hot-toast date-fns

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @testing-library/react @testing-library/jest-dom eslint prettier concurrently
```

#### **Backend Setup:**
```bash
cd backend

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express mongoose bcrypt jsonwebtoken cors helmet express-rate-limit socket.io razorpay twilio redis winston joi multer cloudinary

# Install dev dependencies
npm install -D nodemon jest supertest
```

### **Step 3: Create Core Files**

#### **Create `src/App.jsx`:**
```jsx
// Copy the complete QuickMart code from the artifact
```

#### **Create `backend/server.js`:**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickMart API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`QuickMart Backend running on port ${PORT}`);
});
```

#### **Create `package.json` scripts:**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "dev": "concurrently \"npm start\" \"cd backend && npm run dev\"",
    "backend": "cd backend && npm run dev",
    "frontend": "npm start"
  }
}
```

### **Step 4: Configure Development Environment**

#### **Create `.env` file in root:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=rzp_test_1234567890
REACT_APP_ENVIRONMENT=development
```

#### **Create `backend/.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmart
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### **Step 5: Setup VS Code Extensions**

Install these **recommended VS Code extensions**:

```bash
# Open VS Code
code .

# Install extensions (or search in VS Code extensions)
# - ES7+ React/Redux/React-Native snippets
# - Tailwind CSS IntelliSense
# - Prettier - Code formatter
# - ESLint
# - Auto Rename Tag
# - Bracket Pair Colorizer
# - GitLens
# - Thunder Client (for API testing)
```

---

## 🛠️ **Development Workflow**

### **Start Development Servers:**

#### **Option 1: Both servers together**
```bash
npm run dev
```

#### **Option 2: Separate terminals**
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
npm run backend
```

### **Access Your App:**
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

---

## 🔧 **VS Code Configuration**

### **Create `.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  }
}
```

### **Create `.vscode/extensions.json`:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "rangav.vscode-thunder-client"
  ]
}
```

---

## 📂 **File Creation Checklist**

### **Essential Files to Create:**

#### **Frontend (`src/`):**
- ✅ `App.jsx` - Main QuickMart component (copy from artifact)
- ✅ `index.js` - App entry point
- ✅ `index.css` - Global styles with Tailwind
- ✅ `App.css` - Component styles (optional)

#### **Backend (`backend/`):**
- ✅ `server.js` - Express server
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env` - Environment variables

#### **Configuration:**
- ✅ `tailwind.config.js` - Tailwind configuration
- ✅ `package.json` - Root package with scripts
- ✅ `.gitignore` - Git ignore file
- ✅ `README.md` - Project documentation

---

## 🎯 **Quick Start Commands**

```bash
# 1. Create and setup project
mkdir quickmart && cd quickmart
npx create-react-app . 
npm install lucide-react

# 2. Setup Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Copy QuickMart code to src/App.js

# 4. Configure Tailwind in src/index.css
echo "@tailwind base; @tailwind components; @tailwind utilities;" > src/index.css

# 5. Start development
npm start
```

---

## 🚀 **Next Steps After Setup**

### **1. Test the Application:**
- Browse products and add to cart
- Test login flow with phone: `9876543210`
- Complete checkout and track order
- Test all profile features

### **2. Connect Real Backend:**
- Setup MongoDB database
- Implement real Razorpay integration
- Add SMS service for OTP
- Deploy to cloud platform

### **3. Add Advanced Features:**
- Push notifications
- Real GPS tracking
- Admin dashboard
- Analytics integration

### **4. Production Deployment:**
- Setup CI/CD pipeline
- Configure monitoring
- Setup error tracking
- Performance optimization

**Your QuickMart app will be ready for development in VS Code!** 🎉

Need help with any specific step or want me to create individual component files?
