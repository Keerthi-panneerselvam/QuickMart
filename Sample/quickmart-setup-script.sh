#!/bin/bash

# QuickMart - Complete Project Setup Script
# Run this script to create the complete project structure

echo "🚀 Setting up QuickMart project..."

# Create main project directory
mkdir quickmart
cd quickmart

# Initialize React app
echo "📦 Creating React app..."
npx create-react-app . --template typescript

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install lucide-react axios socket.io-client react-query zustand framer-motion react-hot-toast date-fns

# Install Tailwind CSS
echo "🎨 Setting up Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer @testing-library/react @testing-library/jest-dom eslint prettier concurrently
npx tailwindcss init -p

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p src/components/{auth,profile,shopping,cart,checkout,tracking,common}
mkdir -p src/{services,hooks,context,utils,data,styles}
mkdir -p backend/{controllers,models,routes,middleware,services,config,utils}
mkdir -p docs tests deployment/{docker,kubernetes,scripts}

# Create backend package.json
echo "📦 Setting up backend..."
mkdir -p backend
cd backend
npm init -y

# Install backend dependencies
npm install express mongoose bcrypt jsonwebtoken cors helmet express-rate-limit socket.io razorpay twilio redis winston joi multer cloudinary

# Install backend dev dependencies
npm install -D nodemon jest supertest

cd ..

echo "✅ QuickMart project structure created successfully!"
echo "📝 Next steps:"
echo "1. Copy the QuickMart code to src/App.js"
echo "2. Configure Tailwind CSS in src/index.css"
echo "3. Run 'npm start' to start development"
echo "🎯 Your QuickMart app will be ready!"