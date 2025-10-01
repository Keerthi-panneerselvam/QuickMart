// CartScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CartItem {
  cart_id: number;
  product_id: number;
  name: string;
  image_url: string;
  offer_price: number;
  mrp_price: number;
  quantity_unit: string;
  quantity: number;
  is_available: boolean;
}

interface Address {
  address_id: number;
  address_type: string;
  address_line1: string;
  city: string;
  pincode: string;
}

interface Offer {
  offer_code: string;
  title: string;
  discount: number;
  min_order_value: number;
  can_apply: boolean;
}

const CartScreen = ({ navigation }: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cart_id: 1,
      product_id: 1,
      name: 'Fresh Tomatoes',
      image_url: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Tomato',
      offer_price: 45,
      mrp_price: 50,
      quantity_unit: '500g',
      quantity: 2,
      is_available: true,
    },
    {
      cart_id: 2,
      product_id: 2,
      name: 'Fresh Onions',
      image_url: 'https://via.placeholder.com/100/FFD93D/FFFFFF?text=Onion',
      offer_price: 35,
      mrp_price: 40,
      quantity_unit: '1kg',
      quantity: 1,
      is_available: true,
    },
    {
      cart_id: 3,
      product_id: 3,
      name: 'Green Capsicum',
      image_url: 'https://via.placeholder.com/100/6BCB77/FFFFFF?text=Capsicum',
      offer_price: 55,
      mrp_price: 65,
      quantity_unit: '500g',
      quantity: 1,
      is_available: true,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState<Address>({
    address_id: 1,
    address_type: 'Home',
    address_line1: 'Casagrand Royale, 123 Main Street',
    city: 'Bangalore',
    pincode: '560001',
  });

  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');

  const offers: Offer[] = [
    {
      offer_code: 'FLAT125',
      title: 'Flat ₹125 OFF',
      discount: 125,
      min_order_value: 499,
      can_apply: false,
    },
    {
      offer_code: 'FIRST50',
      title: 'First Order - ₹50 OFF',
      discount: 50,
      min_order_value: 200,
      can_apply: true,
    },
  ];

  const suggestedProducts = [
    {
      product_id: 4,
      name: 'Fresh Potatoes',
      image_url: 'https://via.placeholder.com/80/A0826D/FFFFFF?text=Potato',
      offer_price: 25,
      quantity_unit: '1kg',
    },
    {
      product_id: 5,
      name: 'Fresh Carrots',
      image_url: 'https://via.placeholder.com/80/FF9F43/FFFFFF?text=Carrot',
      offer_price: 40,
      quantity_unit: '500g',
    },
  ];

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.offer_price * item.quantity, 0);
  const deliveryCharges = subtotal >= 199 ? 0 : 20;
  const handlingCharges = 2;
  const discount = appliedOffer ? 50 : 0;
  const freeCashUsed = 0;
  const total = subtotal + deliveryCharges + handlingCharges - discount - freeCashUsed;
  const savings = cartItems.reduce(
    (sum, item) => sum + (item.mrp_price - item.offer_price) * item.quantity,
    0
  ) + discount;

  // Handlers
  const updateQuantity = (cartId: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.cart_id === cartId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartId: number) => {
    setCartItems((items) => items.filter((item) => item.cart_id !== cartId));
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedOffer(couponCode);
      setCouponCode('');
    }
  };

  const handlePlaceOrder = () => {
    console.log('Place order');
    navigation.navigate('OrderConfirmation');
  };

  // Render Components
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Icon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Cart ({cartItems.length} items)</Text>
      <View style={styles.headerButton} />
    </View>
  );

  const renderCartItem = (item: CartItem) => (
    <View key={item.cart_id} style={styles.cartItem}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemUnit}>{item.quantity_unit}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>₹{item.offer_price}</Text>
          {item.mrp_price > item.offer_price && (
            <Text style={styles.itemMrp}>₹{item.mrp_price}</Text>
          )}
        </View>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.cart_id, -1)}
            style={styles.quantityButton}
          >
            <Icon name="minus" size={16} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.cart_id, 1)}
            style={styles.quantityButton}
          >
            <Icon name="plus" size={16} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeItem(item.cart_id)} style={styles.removeButton}>
          <Icon name="delete-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCouponSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="tag-outline" size={20} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Apply Coupon</Text>
      </View>
      
      {appliedOffer ? (
        <View style={styles.appliedCoupon}>
          <View style={styles.appliedCouponLeft}>
            <Icon name="tag" size={18} color="#4CAF50" />
            <Text style={styles.appliedCouponText}>{appliedOffer} applied</Text>
          </View>
          <TouchableOpacity onPress={() => setAppliedOffer(null)}>
            <Text style={styles.removeCouponText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity onPress={applyCoupon} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.offersList}>
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.offer_code}
            onPress={() => offer.can_apply && setAppliedOffer(offer.offer_code)}
            style={[styles.offerCard, !offer.can_apply && styles.offerCardDisabled]}
            disabled={!offer.can_apply}
          >
            <View style={styles.offerLeft}>
              <Icon name="tag" size={16} color={offer.can_apply ? '#4CAF50' : '#999'} />
              <View style={styles.offerContent}>
                <Text style={[styles.offerTitle, !offer.can_apply && styles.offerTitleDisabled]}>
                  {offer.title}
                </Text>
                <Text style={styles.offerDescription}>
                  Min order: ₹{offer.min_order_value}
                </Text>
              </View>
            </View>
            {offer.can_apply ? (
              <Text style={styles.offerApplyText}>Apply</Text>
            ) : (
              <Text style={styles.offerNotApplicable}>
                Add ₹{offer.min_order_value - subtotal}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="map-marker" size={20} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Deliver to</Text>
      </View>
      <TouchableOpacity style={styles.addressCard}>
        <View style={styles.addressContent}>
          <View style={styles.addressBadge}>
            <Text style={styles.addressBadgeText}>{selectedAddress.address_type}</Text>
          </View>
          <Text style={styles.addressText}>{selectedAddress.address_line1}</Text>
          <Text style={styles.addressCity}>
            {selectedAddress.city} - {selectedAddress.pincode}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="credit-card-outline" size={20} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Payment Method</Text>
      </View>
      <View style={styles.paymentMethods}>
        {[
          { id: 'razorpay', name: 'Razorpay (UPI, Cards, Net Banking)', icon: 'wallet' },
          { id: 'cred', name: 'CRED Pay', icon: 'credit-card', badge: '₹50 Cashback' },
          { id: 'cod', name: 'Cash on Delivery', icon: 'cash' },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedPaymentMethod(method.id)}
            style={styles.paymentMethod}
          >
            <View style={styles.paymentMethodLeft}>
              <View
                style={[
                  styles.radio,
                  selectedPaymentMethod === method.id && styles.radioSelected,
                ]}
              >
                {selectedPaymentMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Icon name={method.icon} size={20} color="#666" />
              <View>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                {method.badge && (
                  <Text style={styles.paymentMethodBadge}>{method.badge}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBillSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bill Summary</Text>
      <View style={styles.billRows}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Item total</Text>
          <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery charges</Text>
          <Text style={[styles.billValue, deliveryCharges === 0 && styles.freeText]}>
            {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Handling charges</Text>
          <Text style={styles.billValue}>₹{handlingCharges.toFixed(2)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={[styles.billValue, styles.discountText]}>
              -₹{discount.toFixed(2)}
            </Text>
          </View>
        )}
        {freeCashUsed > 0 && (
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Free cash used</Text>
            <Text style={[styles.billValue, styles.discountText]}>
              -₹{freeCashUsed.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.billRow}>
          <Text style={styles.billTotalLabel}>To Pay</Text>
          <Text style={styles.billTotalValue}>₹{total.toFixed(2)}</Text>
        </View>
        {savings > 0 && (
          <View style={styles.savingsBox}>
            <Icon name="tag" size={14} color="#4CAF50" />
            <Text style={styles.savingsText}>You're saving ₹{savings.toFixed(2)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSuggestedProducts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>You might want to add</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.suggestedList}>
          {suggestedProducts.map((product) => (
            <View key={product.product_id} style={styles.suggestedCard}>
              <Image
                source={{ uri: product.image_url }}
                style={styles.suggestedImage}
                resizeMode="cover"
              />
              <Text style={styles.suggestedName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.suggestedUnit}>{product.quantity_unit}</Text>
              <View style={styles.suggestedFooter}>
                <Text style={styles.suggestedPrice}>₹{product.offer_price}</Text>
                <TouchableOpacity style={styles.suggestedAddButton}>
                  <Icon name="plus" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarLeft}>
        <Text style={styles.bottomTotalLabel}>₹{total.toFixed(2)}</Text>
        <Text style={styles.bottomSavings}>Savings: ₹{savings.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>Place Order</Text>
        <Icon name="arrow-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items to get started</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.startShoppingButton}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item) => renderCartItem(item))}
        </View>

        {renderCouponSection()}
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderBillSummary()}
        {renderSuggestedProducts()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderBottomBar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  // Cart Items
  cartItemsContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemUnit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  itemMrp: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },

  // Section
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  // Coupon
  couponInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  appliedCouponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedCouponText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  removeCouponText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5252',
  },
  offersList: {
    gap: 8,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  offerCardDisabled: {
    opacity: 0.6,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  offerTitleDisabled: {
    color: '#999',
  },
  offerDescription: {
    fontSize: 11,
    color: '#666',
  },
  offerApplyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  offerNotApplicable: {
    fontSize: 11,
    color: '#FF5252',
  },

  // Address
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addressBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  addressCity: {
    fontSize: 12,
    color: '#666',
  },

  // Payment
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  paymentMethodName: {
    fontSize: 14,
    color: '#333',
  },
  paymentMethodBadge: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Bill Summary
  billRows: {
    gap: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  freeText: {
    color: '#4CAF50',
  },
  discountText: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  savingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // Suggested Products
  suggestedList: {
    flexDirection: 'row',
    gap: 12,
  },
  suggestedCard: {
    width: 120,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  suggestedImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  suggestedName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    padding: 8,
    paddingBottom: 4,
  },
  suggestedUnit: {
    fontSize: 10,
    color: '#666',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  suggestedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  suggestedPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  suggestedAddButton: {
    backgroundColor: '#E8F5E9',
    padding: 6,
    borderRadius: 6,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  startShoppingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomBarLeft: {},
  bottomTotalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  bottomSavings: {
    fontSize: 12,
    color: '#4CAF50',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpacing: {
    height: 100,
  },
});

export default CartScreen;
