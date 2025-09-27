// OrderTrackingComponents.js - Order Tracking UI Components
import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Clock, MapPin, Truck, Package, CheckCircle, CheckCircle2, Navigation, Star } from 'lucide-react';

// Order Tracking Modal - Main tracking interface
const OrderTrackingModal = ({ isOpen, onClose, order, orderTrackingService }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [showDeliveryPartner, setShowDeliveryPartner] = useState(false);

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
      delivered: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  if (!isOpen || !currentOrder) return null;

  const progress = orderTrackingService.getOrderProgress(currentOrder);
  const deliveryInfo = orderTrackingService.getDeliveryTimeInfo(currentOrder);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Track Order</h2>
            <p className="text-sm text-gray-600">{currentOrder.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh]">
          {/* Status Overview */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Delivery Time Info */}
            {deliveryInfo && (
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-medium text-gray-700">{deliveryInfo.message}</span>
              </div>
            )}
          </div>

          {/* Order Timeline */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {currentOrder.timeline.map((step, index) => (
                <div key={step.status} className="flex items-start">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(step.icon, step.completed)}
                  </div>
                  
                  {/* Content */}
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
                  
                  {/* Connector Line */}
                  {index < currentOrder.timeline.length - 1 && (
                    <div className={`absolute left-9 mt-10 w-0.5 h-8 ${
                      step.completed ? 'bg-green-300' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner Info */}
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

          {/* Live Updates */}
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

          {/* Order Details */}
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

          {/* Delivery Address */}
          <div className="p-4 border-t">
            <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
              <div className="text-sm text-gray-600">
                <p>{currentOrder.address.address}</p>
                {currentOrder.address.landmark && (
                  <p>Near: {currentOrder.address.landmark}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Card - For order history list
const OrderSummaryCard = ({ order, onClick, orderTrackingService }) => {
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-blue-600 bg-blue-50',
      preparing: 'text-yellow-600 bg-yellow-50',
      packed: 'text-purple-600 bg-purple-50',
      out_for_delivery: 'text-orange-600 bg-orange-50',
      delivered: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const progress = orderTrackingService.getOrderProgress(order);

  return (
    <div 
      onClick={onClick}
      className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{order.id}</h4>
          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm text-gray-600">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index}>
              {item.name} x {item.quantity}
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-gray-500">
              +{order.items.length - 2} more items
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">₹{order.total}</span>
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
            <div 
              className="bg-green-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

// Active Orders Widget - For dashboard/home
const ActiveOrdersWidget = ({ orders, onOrderClick, orderTrackingService }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium text-gray-900 mb-2">Active Orders</h3>
        <div className="text-center py-6">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No active orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium text-gray-900 mb-4">Active Orders</h3>
      <div className="space-y-3">
        {orders.slice(0, 3).map((order) => (
          <div key={order.id} className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50" onClick={() => onOrderClick(order)}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{order.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">₹{order.total}</span>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {orderTrackingService.getEstimatedTimeRemaining(order) || 'Processing'}
              </div>
            </div>
          </div>
        ))}
        
        {orders.length > 3 && (
          <button className="w-full text-center text-green-600 text-sm font-medium py-2">
            View All Orders
          </button>
        )}
      </div>
    </div>
  );
};

export { OrderTrackingModal, OrderSummaryCard, ActiveOrdersWidget };
