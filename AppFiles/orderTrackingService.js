// orderTrackingService.js - Order Tracking Service
class OrderTrackingService {
  constructor() {
    this.activeOrders = new Map();
    this.deliveryPartners = [
      { name: 'Rahul Kumar', phone: '+91 98765 43210', vehicle: 'Bike - KA 01 AB 1234', rating: 4.8 },
      { name: 'Priya Singh', phone: '+91 98765 43211', vehicle: 'Scooter - KA 02 CD 5678', rating: 4.9 },
      { name: 'Amit Patel', phone: '+91 98765 43212', vehicle: 'Bike - KA 03 EF 9012', rating: 4.7 }
    ];
  }

  // Create order with tracking
  createOrder(orderData) {
    const order = {
      id: orderData.orderId,
      date: new Date().toISOString(),
      total: orderData.total,
      status: 'confirmed',
      items: orderData.items,
      address: orderData.address,
      estimatedDelivery: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes
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
          icon: 'CheckCircle',
          estimatedTime: null
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
  }

  // Assign random delivery partner
  assignDeliveryPartner() {
    const randomIndex = Math.floor(Math.random() * this.deliveryPartners.length);
    return this.deliveryPartners[randomIndex];
  }

  // Simulate order progress
  startOrderSimulation(orderId) {
    const progressSteps = [
      { 
        status: 'preparing', 
        delay: 3000, 
        message: 'Your order is being prepared',
        location: 'QuickMart Store - MG Road'
      },
      { 
        status: 'packed', 
        delay: 6000, 
        message: 'Order packed and waiting for pickup',
        location: 'QuickMart Store - MG Road'
      },
      { 
        status: 'out_for_delivery', 
        delay: 9000, 
        message: 'Delivery partner picked up your order',
        location: 'En route to delivery address'
      },
      { 
        status: 'delivered', 
        delay: 12000, 
        message: 'Order delivered successfully!',
        location: 'Delivered to customer'
      }
    ];

    progressSteps.forEach((step, index) => {
      setTimeout(() => {
        this.updateOrderStatus(orderId, step.status, step.message, step.location);
      }, step.delay);
    });

    // Add intermediate tracking updates for out_for_delivery
    setTimeout(() => {
      this.addTrackingUpdate(orderId, 'Delivery partner is 2 minutes away', 'Near your location');
    }, 10000);
  }

  // Update order status
  updateOrderStatus(orderId, status, message, location) {
    const order = this.activeOrders.get(orderId);
    if (!order) return;

    // Update main status
    order.status = status;

    // Update timeline
    const timelineIndex = order.timeline.findIndex(t => t.status === status);
    if (timelineIndex !== -1) {
      order.timeline[timelineIndex].timestamp = new Date().toISOString();
      order.timeline[timelineIndex].completed = true;
    }

    // Add tracking update
    order.trackingUpdates.push({
      timestamp: new Date().toISOString(),
      message: message,
      location: location
    });

    // Set actual delivery time if delivered
    if (status === 'delivered') {
      order.actualDelivery = new Date().toISOString();
    }

    // Dispatch update event
    this.dispatchOrderUpdate(orderId, order);
  }

  // Add tracking update
  addTrackingUpdate(orderId, message, location) {
    const order = this.activeOrders.get(orderId);
    if (!order) return;

    order.trackingUpdates.push({
      timestamp: new Date().toISOString(),
      message: message,
      location: location
    });

    this.dispatchOrderUpdate(orderId, order);
  }

  // Dispatch custom event for UI updates
  dispatchOrderUpdate(orderId, order) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orderStatusUpdate', { 
        detail: { orderId, status: order.status, order } 
      }));
    }
  }

  // Get order by ID
  getOrder(orderId) {
    return this.activeOrders.get(orderId) || null;
  }

  // Get all active orders
  getActiveOrders() {
    return Array.from(this.activeOrders.values())
      .filter(order => order.status !== 'delivered')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Get order progress percentage
  getOrderProgress(order) {
    if (!order) return 0;
    
    const completedSteps = order.timeline.filter(step => step.completed).length;
    const totalSteps = order.timeline.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Get estimated time remaining
  getEstimatedTimeRemaining(order) {
    if (!order || order.status === 'delivered') return null;

    const currentStep = order.timeline.find(step => !step.completed);
    if (!currentStep || !currentStep.estimatedTime) return null;

    return currentStep.estimatedTime;
  }

  // Get delivery time info
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
    } else {
      return {
        status: 'delayed',
        message: 'Delivery running slightly late',
        time: estimatedTime
      };
    }
  }

  // Cancel order (if not yet out for delivery)
  cancelOrder(orderId, reason) {
    const order = this.activeOrders.get(orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      return { success: false, message: 'Cannot cancel order - already out for delivery' };
    }

    order.status = 'cancelled';
    order.cancelReason = reason;
    order.cancelledAt = new Date().toISOString();

    order.trackingUpdates.push({
      timestamp: new Date().toISOString(),
      message: `Order cancelled - ${reason}`,
      location: 'QuickMart Store'
    });

    this.dispatchOrderUpdate(orderId, order);
    return { success: true, message: 'Order cancelled successfully' };
  }
}

// Export singleton instance
const orderTrackingService = new OrderTrackingService();
export default orderTrackingService;
