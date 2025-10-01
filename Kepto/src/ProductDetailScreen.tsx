// ProductDetailsScreen.tsx
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Product {
  product_id: number;
  name: string;
  images: string[];
  rating: number;
  total_ratings: number;
  offer_price: number;
  mrp_price: number;
  discount_percentage: number;
  quantity_unit: string;
  delivery_time_mins: number;
  highlights: string[];
  description: string;
  nutritional_info: Record<string, string>;
  storage_instructions: string;
  manufacturer_name: string;
  country_of_origin: string;
  best_before: string;
}

interface Offer {
  offer_id: number;
  offer_code: string;
  title: string;
  description: string;
}

interface SimilarProduct {
  product_id: number;
  name: string;
  image_url: string;
  offer_price: number;
  quantity_unit: string;
}

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'highlights' | 'info'>('highlights');

  // Mock data - Replace with API call
  const product: Product = {
    product_id: 1,
    name: 'Fresh Tomatoes',
    images: [
      'https://via.placeholder.com/400/FF6B6B/FFFFFF?text=Tomato+1',
      'https://via.placeholder.com/400/FF6B6B/FFFFFF?text=Tomato+2',
      'https://via.placeholder.com/400/FF6B6B/FFFFFF?text=Tomato+3',
    ],
    rating: 4.5,
    total_ratings: 120,
    offer_price: 45,
    mrp_price: 50,
    discount_percentage: 10,
    quantity_unit: '500g',
    delivery_time_mins: 8,
    highlights: [
      'Farm fresh tomatoes',
      'No pesticides used',
      'Organically grown',
      'Rich in vitamins A and C',
      'Perfect for salads and cooking',
    ],
    description:
      'Premium quality farm fresh tomatoes, carefully selected for freshness and taste. These tomatoes are perfect for salads, curries, and all your cooking needs.',
    nutritional_info: {
      Calories: '18 kcal',
      Protein: '0.9g',
      Carbs: '3.9g',
      Fat: '0.2g',
      Fiber: '1.2g',
    },
    storage_instructions: 'Store in a cool, dry place. Best consumed within 3-4 days.',
    manufacturer_name: 'FreshFarm Pvt Ltd',
    country_of_origin: 'India',
    best_before: '5 days from delivery',
  };

  const offers: Offer[] = [
    {
      offer_id: 1,
      offer_code: 'FRESH10',
      title: '10% off on Fresh Vegetables',
      description: 'Use code FRESH10 at checkout',
    },
    {
      offer_id: 2,
      offer_code: 'FLAT125',
      title: 'Flat ₹125 OFF',
      description: 'On orders above ₹499',
    },
  ];

  const similarProducts: SimilarProduct[] = [
    {
      product_id: 2,
      name: 'Fresh Onions',
      image_url: 'https://via.placeholder.com/150/FFD93D/FFFFFF?text=Onion',
      offer_price: 35,
      quantity_unit: '1kg',
    },
    {
      product_id: 3,
      name: 'Green Capsicum',
      image_url: 'https://via.placeholder.com/150/6BCB77/FFFFFF?text=Capsicum',
      offer_price: 55,
      quantity_unit: '500g',
    },
    {
      product_id: 4,
      name: 'Fresh Potatoes',
      image_url: 'https://via.placeholder.com/150/A0826D/FFFFFF?text=Potato',
      offer_price: 25,
      quantity_unit: '1kg',
    },
    {
      product_id: 5,
      name: 'Fresh Carrots',
      image_url: 'https://via.placeholder.com/150/FF9F43/FFFFFF?text=Carrot',
      offer_price: 40,
      quantity_unit: '500g',
    },
  ];

  // Handlers
  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log('Share product');
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  // Render Components
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
        <Icon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={handleSearch} style={styles.headerButton}>
          <Icon name="magnify" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Icon name="share-variant" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? '#FF5252' : '#666'}
        />
      </TouchableOpacity>

      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: product.images[selectedImageIndex] }}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.thumbnailContainer}>
        {product.images.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedImageIndex(idx)}
            style={[
              styles.thumbnail,
              selectedImageIndex === idx && styles.thumbnailActive,
            ]}
          >
            <Image source={{ uri: img }} style={styles.thumbnailImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <View style={styles.deliveryBadge}>
        <Icon name="clock-outline" size={14} color="#4CAF50" />
        <Text style={styles.deliveryText}>
          Estimated delivery: {product.delivery_time_mins} mins
        </Text>
      </View>

      <Text style={styles.productName}>{product.name}</Text>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={14} color="#FFF" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>
        <Text style={styles.ratingCount}>({product.total_ratings} ratings)</Text>
      </View>

      <Text style={styles.productUnit}>{product.quantity_unit}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.offerPrice}>₹{product.offer_price}</Text>
        <Text style={styles.mrpPrice}>₹{product.mrp_price}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{product.discount_percentage}% OFF</Text>
        </View>
      </View>

      <Text style={styles.taxText}>Incl. of all taxes</Text>
    </View>
  );

  const renderOffers = () => (
    <View style={styles.offersSection}>
      <TouchableOpacity style={styles.offersHeader}>
        <View style={styles.offersHeaderLeft}>
          <Icon name="tag-outline" size={18} color="#4CAF50" />
          <Text style={styles.offersHeaderText}>View all offers</Text>
        </View>
        <Icon name="chevron-right" size={18} color="#666" />
      </TouchableOpacity>

      <View style={styles.offersList}>
        {offers.map((offer) => (
          <View key={offer.offer_id} style={styles.offerCard}>
            <Icon name="tag" size={16} color="#4CAF50" />
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTags = () => (
    <View style={styles.tagsContainer}>
      <TouchableOpacity style={styles.brandLink}>
        <Text style={styles.brandLinkText}>View all FreshFarm products →</Text>
      </TouchableOpacity>

      <View style={styles.tags}>
        <View style={[styles.tag, styles.tagOrange]}>
          <Icon name="package-variant" size={12} color="#F57C00" />
          <Text style={styles.tagTextOrange}>No return/exchange</Text>
        </View>
        <View style={[styles.tag, styles.tagBlue]}>
          <Icon name="flash" size={12} color="#2196F3" />
          <Text style={styles.tagTextBlue}>Fast delivery</Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          onPress={() => setActiveTab('highlights')}
          style={[styles.tab, activeTab === 'highlights' && styles.tabActive]}
        >
          <Text
            style={[styles.tabText, activeTab === 'highlights' && styles.tabTextActive]}
          >
            Product Highlights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('info')}
          style={[styles.tab, activeTab === 'info' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
            Information
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'highlights' ? renderHighlights() : renderInformation()}
      </View>
    </View>
  );

  const renderHighlights = () => (
    <View style={styles.highlightsContainer}>
      {product.highlights.map((highlight, idx) => (
        <View key={idx} style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>
      ))}
    </View>
  );

  const renderInformation = () => (
    <View style={styles.informationContainer}>
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Description</Text>
        <Text style={styles.infoText}>{product.description}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Nutritional Information (per 100g)</Text>
        <View style={styles.nutritionGrid}>
          {Object.entries(product.nutritional_info).map(([key, value]) => (
            <View key={key} style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>{key}</Text>
              <Text style={styles.nutritionValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Storage Instructions</Text>
        <Text style={styles.infoText}>{product.storage_instructions}</Text>
      </View>

      <View style={styles.manufacturerInfo}>
        <View style={styles.manufacturerRow}>
          <Text style={styles.manufacturerLabel}>Manufacturer</Text>
          <Text style={styles.manufacturerValue}>{product.manufacturer_name}</Text>
        </View>
        <View style={styles.manufacturerRow}>
          <Text style={styles.manufacturerLabel}>Country of Origin</Text>
          <Text style={styles.manufacturerValue}>{product.country_of_origin}</Text>
        </View>
        <View style={styles.manufacturerRow}>
          <Text style={styles.manufacturerLabel}>Best Before</Text>
          <Text style={styles.manufacturerValue}>{product.best_before}</Text>
        </View>
      </View>
    </View>
  );

  const renderSimilarProducts = () => (
    <View style={styles.similarSection}>
      <Text style={styles.sectionTitle}>Similar Products</Text>
      <View style={styles.similarGrid}>
        {similarProducts.map((item) => (
          <View key={item.product_id} style={styles.similarCard}>
            <View style={styles.similarImageContainer}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.similarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.similarInfo}>
              <Text style={styles.similarName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.similarUnit}>{item.quantity_unit}</Text>
              <View style={styles.similarFooter}>
                <Text style={styles.similarPrice}>₹{item.offer_price}</Text>
                <TouchableOpacity style={styles.similarAddButton}>
                  <Text style={styles.similarAddText}>ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={handleCartPress} style={styles.cartIconButton}>
        <Icon name="cart-outline" size={24} color="#333" />
      </TouchableOpacity>

      {quantity > 0 ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
            <Icon name="minus" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
            <Icon name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        {renderProductInfo()}
        {renderOffers()}
        {renderTags()}
        {renderTabs()}
        {renderSimilarProducts()}

        <View style={styles.footer}>
          <Text style={styles.footerText}>You might also like</Text>
        </View>
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
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },

  // Image Gallery
  imageGallery: {
    backgroundColor: '#F0F9F0',
    paddingVertical: 20,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainImageContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 320,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  thumbnailActive: {
    borderColor: '#4CAF50',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  // Product Info
  productInfo: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  deliveryText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
  },
  productUnit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  offerPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  mrpPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
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
  taxText: {
    fontSize: 11,
    color: '#999',
  },

  // Offers
  offersSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  offersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offersHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offersHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  offersList: {
    gap: 8,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
  },
  offerContent: {
    marginLeft: 8,
    flex: 1,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  offerDescription: {
    fontSize: 11,
    color: '#666',
  },

  // Tags
  tagsContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 8,
  },
  brandLink: {
    marginBottom: 12,
  },
  brandLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagOrange: {
    backgroundColor: '#FFF3E0',
  },
  tagBlue: {
    backgroundColor: '#E3F2FD',
  },
  tagTextOrange: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57C00',
  },
  tagTextBlue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2196F3',
  },

  // Tabs
  tabsContainer: {
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#4CAF50',
  },
  tabContent: {
    padding: 16,
  },

  // Highlights
  highlightsContainer: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  highlightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 6,
    marginRight: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },

  // Information
  informationContainer: {
    gap: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    width: (SCREEN_WIDTH - 64) / 2,
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  manufacturerInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  manufacturerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manufacturerLabel: {
    fontSize: 12,
    color: '#666',
  },
  manufacturerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Similar Products
  similarSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  similarCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  similarImageContainer: {
    height: 128,
    backgroundColor: '#F5F5F5',
  },
  similarImage: {
    width: '100%',
    height: '100%',
  },
  similarInfo: {
    padding: 12,
  },
  similarName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  similarUnit: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  similarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  similarAddButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  similarAddText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF50',
  },

  // Footer
  footer: {
    padding: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  cartIconButton: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default ProductDetailsScreen;
