import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Search, MapPin, Clock, Star, X, CreditCard, Home, Building, CheckCircle, User, Phone, ArrowRight, Mail, Edit2, Trash2, Package, Heart, Truck, CheckCircle2, MessageCircle, ArrowLeft, HomeIcon } from 'lucide-react';

// Order Tracking Service
const orderTrackingService = {
  activeOrders: new Map(),
  deliveryPartners: [
    { name: 'Rahul Kumar', phone: '+91 98765 43210', vehicle: 'Bike - KA 01 AB 1234', rating: 4.8 },
    { name: 'Priya Singh', phone: '+91 98765 43211', vehicle: 'Scooter - KA 02 CD 5678', rating: 4.9 },
    { name: 'Amit Patel', phone: '+91 98765 43212', vehicle: 'Bike - KA 03 EF 9012', rating: 4.7 }
  ],

  createOrder(orderData) {
    const order = {
      id: orderData.orderId,
      date: new Date().toISOString(),
      total: orderData.total,
      status: 'confirmed',
      items: orderData.items,
      address: orderData.address,
      estimatedDelivery: new Date(Date.now() + 10 * 60000).toISOString(),
      actualDelivery: null,
      deliveryPartner: this.assignDeliveryPartner(),
      timeline: [
        {
          status: 'confirmed',
          message: 'Order confirmed and payment received',
          timestamp: new Date().toISOString(),
          completed: true,
          icon: 'CheckCircle'
        },
        {
          status: 'preparing',
          message: 'Store is preparing your order',
          timestamp: null,
          completed: false,
          icon: 'Package',
          estimatedTime: '2-3 minutes'
        },
        {
          status: 'packed',
          message: 'Order packed and ready for pickup',
          timestamp: null,
          completed: false,
          icon: 'CheckCircle2',
          estimatedTime: '1-2 minutes'
        },
        {
          status: 'out_for_delivery',
          message: 'Delivery partner is on the way',
          timestamp: null,
          completed: false,
          icon: 'Truck',
          estimatedTime: '5-7 minutes'
        },
        {
          status: 'delivered',
          message: 'Order delivered successfully',
          timestamp: null,
          completed: false,
          icon: 'CheckCircle'
        }
      ],
      trackingUpdates: [
        {
          timestamp: new Date().toISOString(),
          message: 'Order placed successfully',
          location: 'QuickMart Store - MG Road'
        }
      ]
    };

    this.activeOrders.set(order.id, order);
    this.startOrderSimulation(order.id);
    return order;
  },

  assignDeliveryPartner() {
    const randomIndex = Math.floor(Math.random() * this.deliveryPartners.length);
    return this.deliveryPartners[randomIndex];
  },

  startOrderSimulation(orderId) {
    const progressSteps = [
      { status: 'preparing', delay: 3000, message: 'Your order is being prepared', location: 'QuickMart Store - MG Road' },
      { status: 'packed', delay: 6000, message: 'Order packed and waiting for pickup', location: 'QuickMart Store - MG Road' },
      { status: 'out_for_delivery', delay: 9000, message: 'Delivery partner picked up your order', location: 'En route to delivery address' },
      { status: 'delivered', delay: 12000, message: 'Order delivered successfully!', location: 'Delivered to customer' }
    ];

    progressSteps.forEach((step) => {
      setTimeout(() => {
        this.updateOrderStatus(orderId, step.status, step.message, step.location);
      }, step.delay);
    });

    setTimeout(() => {
      this.addTrackingUpdate(orderId, 'Delivery partner is 2 minutes away', 'Near your location');
    }, 10000);
  },

  updateOrderStatus(orderId, status, message, location) {
    const order = this.activeOrders.get(orderId);
    if (!order) return;

    order.status = status;
    const timelineIndex = order.timeline.findIndex(t => t.status === status);
    if (timelineIndex !== -1) {
      order.timeline[timelineIndex].timestamp = new Date().toISOString();
      order.timeline[timelineIndex].completed = true;
    }

    order.trackingUpdates.push({
      timestamp: new Date().toISOString(),
      message: message,
      location: location
    });

    if (status === 'delivered') {
      order.actualDelivery = new Date().toISOString();
    }

    this.dispatchOrderUpdate(orderId, order);
  },

  addTrackingUpdate(orderId, message, location) {
    const order = this.activeOrders.get(orderId);
    if (!order) return;

    order.trackingUpdates.push({
      timestamp: new Date().toISOString(),
      message: message,
      location: location
    });

    this.dispatchOrderUpdate(orderId, order);
  },

  dispatchOrderUpdate(orderId, order) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orderStatusUpdate', { 
        detail: { orderId, status: order.status, order } 
      }));
    }
  },

  getOrder(orderId) {
    return this.activeOrders.get(orderId) || null;
  },

  getOrderProgress(order) {
    if (!order) return 0;
    const completedSteps = order.timeline.filter(step => step.completed).length;
    const totalSteps = order.timeline.length;
    return Math.round((completedSteps / totalSteps) * 100);
  },

  getDeliveryTimeInfo(order) {
    if (!order) return null;
    const estimatedTime = new Date(order.estimatedDelivery);
    const currentTime = new Date();
    const timeDiff = estimatedTime - currentTime;

    if (order.status === 'delivered') {
      const actualTime = new Date(order.actualDelivery);
      const orderTime = new Date(order.date);
      const deliveryDuration = Math.round((actualTime - orderTime) / (1000 * 60));
      return {
        status: 'delivered',
        message: `Delivered in ${deliveryDuration} minutes`,
        time: actualTime
      };
    }

    if (timeDiff > 0) {
      const minutesRemaining = Math.ceil(timeDiff / (1000 * 60));
      return {
        status: 'estimated',
        message: `Estimated delivery in ${minutesRemaining} minutes`,
        time: estimatedTime
      };
    }

    return {
      status: 'delayed',
      message: 'Delivery running slightly late',
      time: estimatedTime
    };
  }
};

// Authentication Service
const authService = {
  users: [
    {
      id: '1',
      phone: '9876543210',
      name: 'John Doe',
      email: 'john@example.com',
      addresses: [
        {
          id: '1',
          type: 'Home',
          address: '123 MG Road, Bangalore',
          landmark: 'Near Coffee Day',
          isDefault: true,
          pincode: '560001',
          city: 'Bangalore',
          state: 'Karnataka'
        }
      ],
      orderHistory: [],
      favorites: [1, 4, 7],
      createdAt: '2024-01-01'
    }
  ],
  currentUser: null,

  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },

  async sendOTP(phoneNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const otp = this.generateOTP();
        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        resolve({ success: true, otp, message: 'OTP sent successfully' });
      }, 1000);
    });
  },

  async verifyOTP(phoneNumber, enteredOTP, actualOTP) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (enteredOTP === actualOTP) {
          let user = this.users.find(u => u.phone === phoneNumber);
          
          if (!user) {
            user = {
              id: Date.now().toString(),
              phone: phoneNumber,
              name: '',
              email: '',
              addresses: [],
              orderHistory: [],
              favorites: [],
              createdAt: new Date().toISOString()
            };
            this.users.push(user);
          }
          
          this.currentUser = user;
          resolve({ success: true, user, isNewUser: !user.name });
        } else {
          resolve({ success: false, message: 'Invalid OTP' });
        }
      }, 500);
    });
  },

  async updateProfile(profileData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, ...profileData };
          resolve({ success: true, user: this.currentUser });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  },

  async addAddress(addressData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const newAddress = {
            id: Date.now().toString(),
            ...addressData,
            isDefault: this.currentUser.addresses.length === 0
          };
          this.currentUser.addresses.push(newAddress);
          resolve({ success: true, address: newAddress });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  },

  async updateAddress(addressId, addressData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const addressIndex = this.currentUser.addresses.findIndex(a => a.id === addressId);
          if (addressIndex !== -1) {
            this.currentUser.addresses[addressIndex] = { 
              ...this.currentUser.addresses[addressIndex], 
              ...addressData 
            };
            resolve({ success: true, address: this.currentUser.addresses[addressIndex] });
          } else {
            resolve({ success: false, message: 'Address not found' });
          }
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  },

  async deleteAddress(addressId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          this.currentUser.addresses = this.currentUser.addresses.filter(a => a.id !== addressId);
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  },

  async setDefaultAddress(addressId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          this.currentUser.addresses = this.currentUser.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
          }));
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  },

  async addOrderToHistory(orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const trackingOrder = orderTrackingService.createOrder(orderData);
          this.currentUser.orderHistory.unshift(trackingOrder);
          resolve({ success: true, order: trackingOrder });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 300);
    });
  },

  logout() {
    this.currentUser = null;
  },

  getCurrentUser() {
    return this.currentUser;
  },

  isLoggedIn() {
    return this.currentUser !== null;
  }
};

// Order Tracking Modal
const OrderTrackingModal = ({ isOpen, onClose, order }) => {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  useEffect(() => {
    const handleOrderUpdate = (event) => {
      if (event.detail.orderId === currentOrder?.id) {
        setCurrentOrder(event.detail.order);
      }
    };

    window.addEventListener('orderStatusUpdate', handleOrderUpdate);
    return () => window.removeEventListener('orderStatusUpdate', handleOrderUpdate);
  }, [currentOrder?.id]);

  const getStatusIcon = (iconName, completed) => {
    const iconMap = {
      CheckCircle: CheckCircle,
      Package: Package,
      CheckCircle2: CheckCircle2,
      Truck: Truck
    };
    
    const IconComponent = iconMap[iconName] || CheckCircle;
    return <IconComponent className={`w-5 h-5 ${completed ? 'text-green-600' : 'text-gray-400'}`} />;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-blue-600 bg-blue-50',
      preparing: 'text-yellow-600 bg-yellow-50',
      packed: 'text-purple-600 bg-purple-50',
      out_for_delivery: 'text-orange-600 bg-orange-50',
      delivered: 'text-green-600 bg-green-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  if (!isOpen || !currentOrder) return null;

  const progress = orderTrackingService.getOrderProgress(currentOrder);
  const deliveryInfo = orderTrackingService.getDeliveryTimeInfo(currentOrder);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-green-50">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Track Order</h2>
              <p className="text-sm text-gray-600">{currentOrder.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh]">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {deliveryInfo && (
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-medium text-gray-700">{deliveryInfo.message}</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {currentOrder.timeline.map((step, index) => (
                <div key={step.status} className="flex items-start relative">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(step.icon, step.completed)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.message}
                      </h4>
                      {step.timestamp && (
                        <span className="text-sm text-gray-500">
                          {formatTime(step.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    {!step.completed && step.estimatedTime && (
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated: {step.estimatedTime}
                      </p>
                    )}
                  </div>
                  
                  {index < currentOrder.timeline.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-8 ${
                      step.completed ? 'bg-green-300' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {currentOrder.status === 'out_for_delivery' && (
            <div className="p-4 border-t bg-blue-50">
              <h3 className="font-medium text-gray-900 mb-3">Delivery Partner</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{currentOrder.deliveryPartner.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{currentOrder.deliveryPartner.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{currentOrder.deliveryPartner.vehicle}</p>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <h3 className="font-medium text-gray-900 mb-3">Live Updates</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {currentOrder.trackingUpdates.slice().reverse().map((update, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{update.message}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{update.location}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(update.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex items-center justify-between font-medium">
                <span>Total</span>
                <span>₹{currentOrder.total}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50 space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Modal
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    const response = await authService.sendOTP(phoneNumber);
    if (response.success) {
      setGeneratedOTP(response.otp);
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const response = await authService.verifyOTP(phoneNumber, otp, generatedOTP);
    if (response.success) {
      onLoginSuccess(response.user, response.isNewUser);
      onClose();
    } else {
      setError('Invalid OTP');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Login / Sign Up</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 border rounded-lg"
            />
            <button
              onClick={handleSendOTP}
              disabled={phoneNumber.length !== 10}
              className="w-full bg-green-600 text-white py-3 rounded-lg disabled:bg-gray-300"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-green-600">Demo OTP: {generatedOTP}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-lg text-center"
              maxLength={4}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Modal
const ProfileModal = ({ isOpen, onClose, user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    const response = await authService.updateProfile(profileForm);
    if (response.success) {
      onUpdateUser(response.user);
      setEditing(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Orders', icon: Package }
  ];

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-sm font-medium flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">{user.name || 'Complete your profile'}</h3>
                <p className="text-gray-500 text-sm">+91 {user.phone}</p>
              </div>

              {!editing ? (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-gray-600">{user.name || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-gray-600">{user.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order History</h3>
              
              {user.orderHistory && user.orderHistory.length > 0 ? (
                user.orderHistory.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">₹{order.total}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main QuickMart App
const QuickMart = () => {
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' }
  ];

  const products = [
    { id: 1, name: 'Fresh Bananas', price: 40, image: '🍌', category: 'fruits', rating: 4.5, discount: 10 },
    { id: 2, name: 'Red Apples', price: 120, image: '🍎', category: 'fruits', rating: 4.3 },
    { id: 3, name: 'Fresh Carrots', price: 60, image: '🥕', category: 'vegetables', rating: 4.2 },
    { id: 4, name: 'Milk 1L', price: 65, image: '🥛', category: 'dairy', rating: 4.6 },
    { id: 5, name: 'Potato Chips', price: 30, image: '🍿', category: 'snacks', rating: 4.1, discount: 15 },
    { id: 6, name: 'Cola 500ml', price: 45, image: '🥤', category: 'beverages', rating: 4.0 },
    { id: 7, name: 'Fresh Tomatoes', price: 50, image: '🍅', category: 'vegetables', rating: 4.4 },
    { id: 8, name: 'Bread Loaf', price: 35, image: '🍞', category: 'snacks', rating: 4.2 },
    { id: 9, name: 'Orange Juice', price: 85, image: '🍊', category: 'beverages', rating: 4.3 },
    { id: 10, name: 'Greek Yogurt', price: 95, image: '🍯', category: 'dairy', rating: 4.5, discount: 20 }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === parseInt(productId));
      const discountedPrice = product.discount ? 
        product.price * (1 - product.discount / 100) : product.price;
      return total + (discountedPrice * count);
    }, 0);
  };

  const processPayment = async () => {
    const orderData = {
      orderId: '#QM' + Date.now().toString().slice(-6),
      total: getTotalPrice(),
      items: Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
          name: product.name,
          quantity: quantity,
          price: product.discount ? 
            product.price * (1 - product.discount / 100) : product.price
        };
      }),
      address: { address: '123 MG Road, Bangalore', landmark: 'Near Coffee Day' }
    };

    if (currentUser) {
      const response = await authService.addOrderToHistory(orderData);
      if (response.success) {
        setCurrentUser({
          ...currentUser,
          orderHistory: [response.order, ...(currentUser.orderHistory || [])]
        });
        setTrackingOrder(response.order);
      }
    } else {
      const trackingOrderDemo = orderTrackingService.createOrder(orderData);
      setTrackingOrder(trackingOrderDemo);
    }
    
    setPaymentStatus('success');
    setOrderId(orderData.orderId);
    setShowCheckout(false);
    setShowCart(false);
    setCart({});
  };

  const handleTrackOrder = () => {
    if (trackingOrder) {
      setPaymentStatus(null);
      setShowOrderTracking(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart({});
    authService.logout();
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleGoHome = () => {
    setShowOrderTracking(false);
    setPaymentStatus(null);
    setShowCart(false);
    setShowCheckout(false);
    setShowLogin(false);
  };

  useEffect(() => {
    const handleOrderUpdate = (event) => {
      const { orderId, order } = event.detail;
      
      if (currentUser) {
        const updatedHistory = currentUser.orderHistory.map(o => 
          o.id === orderId ? order : o
        );
        setCurrentUser({
          ...currentUser,
          orderHistory: updatedHistory
        });
      }
      
      if (trackingOrder && trackingOrder.id === orderId) {
        setTrackingOrder(order);
      }
    };

    window.addEventListener('orderStatusUpdate', handleOrderUpdate);
    return () => window.removeEventListener('orderStatusUpdate', handleOrderUpdate);
  }, [currentUser, trackingOrder]);

  const ProductCard = ({ product }) => {
    const quantity = cart[product.id] || 0;
    const discountedPrice = product.discount ? 
      product.price * (1 - product.discount / 100) : product.price;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          <div className="text-6xl flex justify-center py-4 bg-gray-50">
            {product.image}
          </div>
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">₹{Math.round(discountedPrice)}</span>
              {product.discount && (
                <span className="text-xs text-gray-500 line-through ml-1">₹{product.price}</span>
              )}
            </div>
            
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product.id)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="bg-green-600 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-700"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-medium text-sm w-6 text-center">{quantity}</span>
                <button
                  onClick={() => addToCart(product.id)}
                  className="bg-green-600 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-700"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-green-600 text-white p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">QuickMart</h1>
            <div className="flex items-center text-green-100 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>10 min delivery</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-green-100 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Home</span>
            </div>
            
            {trackingOrder && (
              <button
                onClick={() => setShowOrderTracking(true)}
                className="bg-orange-500 hover:bg-orange-400 rounded-full p-2 transition-colors"
              >
                <Package className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => {
                if (currentUser) {
                  setShowProfile(true);
                } else {
                  setShowLogin(true);
                }
              }}
              className={`rounded-full p-2 transition-colors relative ${
                currentUser 
                  ? 'bg-green-500 hover:bg-green-400' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      <div className="bg-white p-4 sticky top-24 z-30 border-b">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center min-w-16 p-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {getTotalItems() > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md mx-auto"
        >
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-medium">{getTotalItems()} items</span>
          </div>
          <span className="font-bold">₹{Math.round(getTotalPrice())}</span>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {Object.entries(cart).map(([productId, quantity]) => {
                const product = products.find(p => p.id === parseInt(productId));
                return (
                  <div key={productId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{product.image}</span>
                      <div>
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-green-600 font-medium">₹{product.price}</p>
                      </div>
                    </div>
                    <span className="font-medium">{quantity}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total: ₹{Math.round(getTotalPrice())}</span>
              </div>
              <button 
                onClick={() => {
                  if (!currentUser) {
                    setShowLogin(true);
                  } else {
                    setShowCart(false);
                    setShowCheckout(true);
                  }
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium"
              >
                {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-4">
            <h2 className="text-lg font-bold mb-4">Checkout</h2>
            <div className="mb-4">
              <p className="font-medium">Total: ₹{Math.round(getTotalPrice())}</p>
            </div>
            <button
              onClick={processPayment}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Order {orderId} placed successfully.</p>
            
            <div className="space-y-3">
              <button
                onClick={handleTrackOrder}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </button>
              
              <button
                onClick={() => setPaymentStatus(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
      />

      <OrderTrackingModal 
        isOpen={showOrderTracking}
        onClose={handleGoHome}
        order={trackingOrder}
      />
    </div>
  );
};

export default QuickMart;
