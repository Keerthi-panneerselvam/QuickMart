// HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// Types
interface Product {
  product_id: number;
  name: string;
  image_url: string;
  offer_price: number;
  mrp_price: number;
  quantity_unit: string;
  delivery_time_mins: number;
  discount_percentage: number;
  is_available: boolean;
  cartQuantity?: number;
}

interface Category {
  category_id: number;
  name: string;
  icon_url: string;
  slug: string;
}

interface Banner {
  id: number;
  image_url: string;
  title: string;
  link: string;
}

const HomeScreen = ({ navigation }: any) => {
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(3);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  // Mock data
  const mockCategories: Category[] = [
    { category_id: 0, name: 'All', icon_url: '', slug: 'all' },
    { category_id: 1, name: 'Grocery', icon_url: '🛒', slug: 'grocery-kitchen' },
    { category_id: 2, name: 'Snacks', icon_url: '🍿', slug: 'snacks-drinks' },
    { category_id: 3, name: 'Beauty', icon_url: '💄', slug: 'beauty-personal-care' },
    { category_id: 4, name: 'Household', icon_url: '🏠', slug: 'household-essentials' },
    { category_id: 5, name: 'Fresh', icon_url: '🥬', slug: 'fresh-vegetables' },
    { category_id: 6, name: 'Dairy', icon_url: '🥛', slug: 'dairy-eggs' },
    { category_id: 7, name: 'Electronics', icon_url: '📱', slug: 'electronics' },
    { category_id: 8, name: 'Kitchen', icon_url: '🍳', slug: 'home-kitchen' },
    { category_id: 9, name: 'Fashion', icon_url: '👕', slug: 'fashion' },
    { category_id: 10, name: 'Pharmacy', icon_url: '💊', slug: 'pharmacy' },
    { category_id: 11, name: 'Baby Care', icon_url: '👶', slug: 'baby-care' },
    { category_id: 12, name: 'Pet Care', icon_url: '🐾', slug: 'pet-care' },
  ];

  const mockBanners: Banner[] = [
    {
      id: 1,
      image_url: 'https://via.placeholder.com/400x180/4CAF50/FFFFFF?text=Rs+75+Free+Cash',
      title: '₹75 Free Cash',
      link: '/offers',
    },
    {
      id: 2,
      image_url: 'https://via.placeholder.com/400x180/2196F3/FFFFFF?text=Lower+Prices',
      title: 'Lower Prices',
      link: '/deals',
    },
  ];

  const mockProducts: Product[] = [
    {
      product_id: 1,
      name: 'Fresh Tomatoes',
      image_url: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Tomato',
      offer_price: 45,
      mrp_price: 50,
      quantity_unit: '500g',
      delivery_time_mins: 7,
      discount_percentage: 10,
      is_available: true,
    },
    {
      product_id: 2,
      name: 'Fresh Onions',
      image_url: 'https://via.placeholder.com/150/FFD93D/FFFFFF?text=Onion',
      offer_price: 35,
      mrp_price: 40,
      quantity_unit: '1kg',
      delivery_time_mins: 7,
      discount_percentage: 12.5,
      is_available: true,
    },
    {
      product_id: 3,
      name: 'Green Capsicum',
      image_url: 'https://via.placeholder.com/150/6BCB77/FFFFFF?text=Capsicum',
      offer_price: 55,
      mrp_price: 65,
      quantity_unit: '500g',
      delivery_time_mins: 7,
      discount_percentage: 15,
      is_available: true,
    },
    {
      product_id: 4,
      name: 'Fresh Potatoes',
      image_url: 'https://via.placeholder.com/150/A0826D/FFFFFF?text=Potato',
      offer_price: 25,
      mrp_price: 30,
      quantity_unit: '1kg',
      delivery_time_mins: 7,
      discount_percentage: 16,
      is_available: true,
    },
  ];

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setCategories(mockCategories);
      setBanners(mockBanners);
      setFreshProducts(mockProducts);
      setTrendingProducts(mockProducts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  // Handlers
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
    setCartCount(cartCount + 1);
  };

  const handleUpdateQuantity = (product: Product, quantity: number) => {
    console.log('Update quantity:', product, quantity);
    if (quantity === 0) {
      setCartCount(Math.max(0, cartCount - 1));
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.product_id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleLocationPress = () => {
    navigation.navigate('SelectLocation');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  // Render Components
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.deliveryInfo}>
          <Icon name="clock-outline" size={16} color="#4CAF50" />
          <Text style={styles.deliveryText}>Delivery in 7 mins</Text>
        </View>
        <TouchableOpacity onPress={handleProfilePress}>
          <Icon name="account-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.locationBar} onPress={handleLocationPress}>
        <Icon name="map-marker" size={20} color="#4CAF50" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Home</Text>
          <Text style={styles.locationAddress}>Casagrand Royale</Text>
        </View>
        <Icon name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Icon name="magnify" size={20} color="#999" />
        <Text style={styles.searchPlaceholder}>Search for products...</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryChips = () => (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.category_id}
            style={[
              styles.categoryChip,
              selectedCategory === category.name && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            {category.icon_url && (
              <Text style={styles.categoryIcon}>{category.icon_url}</Text>
            )}
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBannerCarousel = () => (
    <View style={styles.bannerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerScroll}
      >
        {banners.map((banner) => (
          <TouchableOpacity key={banner.id} style={styles.banner}>
            <Image
              source={{ uri: banner.image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductCard = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.discount_percentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount_percentage}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <View style={styles.deliveryTimeBadge}>
          <Icon name="clock-outline" size={12} color="#4CAF50" />
          <Text style={styles.deliveryTimeText}>{product.delivery_time_mins} mins</Text>
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productQuantity}>{product.quantity_unit}</Text>

        <View style={styles.productFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.offerPrice}>₹{product.offer_price}</Text>
            {product.mrp_price > product.offer_price && (
              <Text style={styles.mrpPrice}>₹{product.mrp_price}</Text>
            )}
          </View>

          {product.cartQuantity ? (
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(product, product.cartQuantity! - 1)}
              >
                <Icon name="minus" size={16} color="#4CAF50" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.cartQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(product, product.cartQuantity! + 1)}
              >
                <Icon name="plus" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(product)}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, subtitle?: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFreshProducts = () => (
    <View style={styles.section}>
      {renderSectionHeader(
        'Fresh Veggies at just ₹9',
        'Offer valid till stock lasts',
        () => console.log('See all fresh products')
      )}
      <FlatList
        data={freshProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.product_id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.productRow}
      />
    </View>
  );

  const renderTrendingProducts = () => (
    <View style={styles.section}>
      {renderSectionHeader(
        'Trending in your location',
        undefined,
        () => console.log('See all trending')
      )}
      <FlatList
        data={trendingProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => `trending-${item.product_id}`}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.productRow}
      />
    </View>
  );

  const renderOfferMarquee = () => (
    <View style={styles.marqueeContainer}>
      <Icon name="credit-card-outline" size={16} color="#FF9800" />
      <Text style={styles.marqueeText}>
        Get extra 10% off on HDFC Credit Cards | Use code HDFC10
      </Text>
    </View>
  );

  const renderFloatingCartButton = () => {
    if (cartCount === 0) return null;

    return (
      <TouchableOpacity style={styles.floatingCart} onPress={handleCartPress}>
        <View style={styles.floatingCartContent}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{cartCount} items</Text>
            <Text style={styles.cartTotal}>₹450</Text>
          </View>
          <View style={styles.viewCartButton}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Icon name="chevron-right" size={20} color="#FFF" />
          </View>
        </View>
        <View style={styles.floatingCartOffer}>
          <Icon name="tag" size={12} color="#4CAF50" />
          <Text style={styles.floatingCartOfferText}>
            Flat ₹125 off plus ₹50 cashback with CRED Pay
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
        }
      >
        {renderCategoryChips()}
        {renderBannerCarousel()}
        {renderOfferMarquee()}
        {renderFreshProducts()}
        {renderTrendingProducts()}

        <View style={styles.footer}>
          <Text style={styles.footerText}>The place that fits all your needs</Text>
          <Text style={styles.footerSubtext}>Crafted with love from QuickMart team</Text>
        </View>
      </ScrollView>

      {renderFloatingCartButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliveryText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    color: '#999',
  },

  // Categories
  categoryContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryScroll: {
    paddingHorizontal: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },

  // Banner
  bannerContainer: {
    marginVertical: 12,
  },
  bannerScroll: {
    paddingHorizontal: 16,
  },
  banner: {
    width: SCREEN_WIDTH - 32,
    height: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // Marquee
  marqueeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  marqueeText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#F57C00',
    flex: 1,
  },

  // Section
  section: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // Product Card
  productRow: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: PRODUCT_CARD_WIDTH * 0.8,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  productInfo: {
    padding: 12,
  },
  deliveryTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  deliveryTimeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginRight: 4,
  },
  mrpPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },

  // Floating Cart
  floatingCart: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 4,
  },
  floatingCartOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  floatingCartOfferText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 6,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
