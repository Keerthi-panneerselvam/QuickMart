// CategoriesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CATEGORY_CARD_WIDTH = (SCREEN_WIDTH - 48) / 3;

interface Category {
  category_id: number;
  name: string;
  icon: string;
  slug: string;
  product_count: number;
  image_url?: string;
}

interface SubCategory {
  category_id: number;
  name: string;
  icon: string;
  parent_id: number;
}

const CategoriesScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Main Categories Data
  const mainCategories: Category[] = [
    {
      category_id: 1,
      name: 'Grocery & Kitchen',
      icon: '🛒',
      slug: 'grocery-kitchen',
      product_count: 450,
    },
    {
      category_id: 2,
      name: 'Snacks & Drinks',
      icon: '🍿',
      slug: 'snacks-drinks',
      product_count: 320,
    },
    {
      category_id: 3,
      name: 'Beauty & Personal Care',
      icon: '💄',
      slug: 'beauty-personal-care',
      product_count: 280,
    },
    {
      category_id: 4,
      name: 'Household Essentials',
      icon: '🏠',
      slug: 'household-essentials',
      product_count: 210,
    },
    {
      category_id: 5,
      name: 'Fresh Vegetables',
      icon: '🥬',
      slug: 'fresh-vegetables',
      product_count: 85,
    },
    {
      category_id: 6,
      name: 'Dairy & Eggs',
      icon: '🥛',
      slug: 'dairy-eggs',
      product_count: 65,
    },
    {
      category_id: 7,
      name: 'Electronics',
      icon: '📱',
      slug: 'electronics',
      product_count: 150,
    },
    {
      category_id: 8,
      name: 'Home & Kitchen',
      icon: '🍳',
      slug: 'home-kitchen',
      product_count: 190,
    },
    {
      category_id: 9,
      name: 'Fashion',
      icon: '👕',
      slug: 'fashion',
      product_count: 120,
    },
    {
      category_id: 10,
      name: 'Pharmacy',
      icon: '💊',
      slug: 'pharmacy',
      product_count: 95,
    },
    {
      category_id: 11,
      name: 'Baby Care',
      icon: '👶',
      slug: 'baby-care',
      product_count: 140,
    },
    {
      category_id: 12,
      name: 'Pet Care',
      icon: '🐾',
      slug: 'pet-care',
      product_count: 75,
    },
  ];

  // Subcategories for Grocery & Kitchen
  const grocerySubCategories: SubCategory[] = [
    { category_id: 101, name: 'Fresh Vegetables', icon: '🥕', parent_id: 1 },
    { category_id: 102, name: 'Daily Bread & Eggs', icon: '🍞', parent_id: 1 },
    { category_id: 103, name: 'Atta, Rice, Oil, Dals', icon: '🌾', parent_id: 1 },
    { category_id: 104, name: 'Meat, Fish, Eggs', icon: '🍖', parent_id: 1 },
    { category_id: 105, name: 'Masala & Dry Fruits', icon: '🌶️', parent_id: 1 },
    { category_id: 106, name: 'Breakfast & Sauces', icon: '🥞', parent_id: 1 },
    { category_id: 107, name: 'Packaged Foods', icon: '📦', parent_id: 1 },
  ];

  // Subcategories for Snacks & Drinks
  const snacksSubCategories: SubCategory[] = [
    { category_id: 201, name: 'Tea, Coffee and More', icon: '☕', parent_id: 2 },
    { category_id: 202, name: 'Ice Cream and More', icon: '🍦', parent_id: 2 },
    { category_id: 203, name: 'Frozen Foods', icon: '🧊', parent_id: 2 },
    { category_id: 204, name: 'Sweet Cravings', icon: '🍬', parent_id: 2 },
    { category_id: 205, name: 'Cold Drinks & Juices', icon: '🥤', parent_id: 2 },
    { category_id: 206, name: 'Munchies', icon: '🍿', parent_id: 2 },
    { category_id: 207, name: 'Biscuits & Cookies', icon: '🍪', parent_id: 2 },
  ];

  // Subcategories for Beauty & Personal Care
  const beautySubCategories: SubCategory[] = [
    { category_id: 301, name: 'Makeup & Beauty', icon: '💄', parent_id: 3 },
    { category_id: 302, name: 'Skin Care', icon: '✨', parent_id: 3 },
    { category_id: 303, name: 'Protein & Nutrition', icon: '💪', parent_id: 3 },
    { category_id: 304, name: 'Baby Care', icon: '👶', parent_id: 3 },
    { category_id: 305, name: 'Bath & Body', icon: '🧴', parent_id: 3 },
    { category_id: 306, name: 'Hair Care', icon: '💇', parent_id: 3 },
    { category_id: 307, name: 'Jewelry & Accessories', icon: '💍', parent_id: 3 },
    { category_id: 308, name: 'Apparel & Lifestyle', icon: '👗', parent_id: 3 },
    { category_id: 309, name: 'Fragrances & Grooming', icon: '🧴', parent_id: 3 },
    { category_id: 310, name: 'Pharmacy & Wellness', icon: '💊', parent_id: 3 },
    { category_id: 311, name: 'Feminine Hygiene', icon: '🌸', parent_id: 3 },
  ];

  // Subcategories for Household Essentials
  const householdSubCategories: SubCategory[] = [
    { category_id: 401, name: 'Home Needs', icon: '🏠', parent_id: 4 },
    { category_id: 402, name: 'Kitchen & Dining', icon: '🍽️', parent_id: 4 },
    { category_id: 403, name: 'Cleaning Essentials', icon: '🧹', parent_id: 4 },
    { category_id: 404, name: 'Electronic Appliances', icon: '⚡', parent_id: 4 },
    { category_id: 405, name: 'Pet Care', icon: '🐕', parent_id: 4 },
    { category_id: 406, name: 'Toys & Sports', icon: '⚽', parent_id: 4 },
    { category_id: 407, name: 'Stationary & Books', icon: '📚', parent_id: 4 },
    { category_id: 408, name: 'Paan Corner', icon: '🌿', parent_id: 4 },
  ];

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryProducts', {
      categoryId: category.category_id,
      categoryName: category.name,
    });
  };

  const handleSubCategoryPress = (subCategory: SubCategory) => {
    navigation.navigate('CategoryProducts', {
      categoryId: subCategory.category_id,
      categoryName: subCategory.name,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  // Render Components
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>All Categories</Text>
      <TouchableOpacity onPress={handleSearchPress} style={styles.searchButton}>
        <Icon name="magnify" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderMainCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productCount}>{item.product_count} items</Text>
    </TouchableOpacity>
  );

  const renderSubCategorySection = (
    title: string,
    subCategories: SubCategory[],
    bgColor: string
  ) => (
    <View style={styles.subCategorySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subCategoryGrid}>
        {subCategories.map((item) => (
          <TouchableOpacity
            key={item.category_id}
            style={[styles.subCategoryCard, { backgroundColor: bgColor }]}
            onPress={() => handleSubCategoryPress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.subCategoryIcon}>{item.icon}</Text>
            <Text style={styles.subCategoryName} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Categories */}
        <View style={styles.mainCategoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={mainCategories}
            renderItem={renderMainCategoryCard}
            keyExtractor={(item) => item.category_id.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.mainCategoriesContainer}
          />
        </View>

        {/* Grocery & Kitchen Subcategories */}
        {renderSubCategorySection(
          'Grocery & Kitchen',
          grocerySubCategories,
          '#E8F5E9'
        )}

        {/* Snacks & Drinks Subcategories */}
        {renderSubCategorySection(
          'Snacks & Drinks',
          snacksSubCategories,
          '#FFF3E0'
        )}

        {/* Beauty & Personal Care Subcategories */}
        {renderSubCategorySection(
          'Beauty & Personal Care',
          beautySubCategories,
          '#FCE4EC'
        )}

        {/* Household Essentials Subcategories */}
        {renderSubCategorySection(
          'Household Essentials',
          householdSubCategories,
          '#E3F2FD'
        )}

        {/* Shop by Store */}
        <View style={styles.subCategorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Store</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subCategoryGrid}>
            {[
              { id: 1, name: 'Pooja Store', icon: '🕉️' },
              { id: 2, name: 'Gift Card Store', icon: '🎁' },
              { id: 3, name: 'Monsoon Store', icon: '☔' },
              { id: 4, name: 'Decor Store', icon: '🏮' },
              { id: 5, name: 'Fitness Store', icon: '💪' },
              { id: 6, name: 'Birthday Store', icon: '🎂' },
              { id: 7, name: 'Gift Store', icon: '🎀' },
              { id: 8, name: 'Premium Store', icon: '⭐' },
            ].map((store) => (
              <TouchableOpacity
                key={store.id}
                style={[styles.subCategoryCard, { backgroundColor: '#F3E5F5' }]}
                activeOpacity={0.7}
              >
                <Text style={styles.subCategoryIcon}>{store.icon}</Text>
                <Text style={styles.subCategoryName} numberOfLines={2}>
                  {store.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },

  // Main Categories
  mainCategoriesSection: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  mainCategoriesContainer: {
    paddingHorizontal: 8,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: CATEGORY_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  productCount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Subcategories
  subCategorySection: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  subCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  subCategoryCard: {
    width: (SCREEN_WIDTH - 48) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCategoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subCategoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  bottomSpacing: {
    height: 80,
  },
});

export default CategoriesScreen;
