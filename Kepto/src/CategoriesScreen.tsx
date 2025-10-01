import React, { useState } from 'react';
import { Search } from 'lucide-react';

const CategoriesScreen = () => {
  const mainCategories = [
    { id: 1, name: 'Grocery & Kitchen', icon: '🛒', count: 450 },
    { id: 2, name: 'Snacks & Drinks', icon: '🍿', count: 320 },
    { id: 3, name: 'Beauty & Personal Care', icon: '💄', count: 280 },
    { id: 4, name: 'Household Essentials', icon: '🏠', count: 210 },
    { id: 5, name: 'Fresh Vegetables', icon: '🥬', count: 85 },
    { id: 6, name: 'Dairy & Eggs', icon: '🥛', count: 65 },
    { id: 7, name: 'Electronics', icon: '📱', count: 150 },
    { id: 8, name: 'Home & Kitchen', icon: '🍳', count: 190 },
    { id: 9, name: 'Fashion', icon: '👕', count: 120 },
    { id: 10, name: 'Pharmacy', icon: '💊', count: 95 },
    { id: 11, name: 'Baby Care', icon: '👶', count: 140 },
    { id: 12, name: 'Pet Care', icon: '🐾', count: 75 },
  ];

  const grocerySubCategories = [
    { id: 101, name: 'Fresh Vegetables', icon: '🥕' },
    { id: 102, name: 'Daily Bread & Eggs', icon: '🍞' },
    { id: 103, name: 'Atta, Rice, Oil, Dals', icon: '🌾' },
    { id: 104, name: 'Meat, Fish, Eggs', icon: '🍖' },
    { id: 105, name: 'Masala & Dry Fruits', icon: '🌶️' },
    { id: 106, name: 'Breakfast & Sauces', icon: '🥞' },
    { id: 107, name: 'Packaged Foods', icon: '📦' },
  ];

  const snacksSubCategories = [
    { id: 201, name: 'Tea, Coffee and More', icon: '☕' },
    { id: 202, name: 'Ice Cream and More', icon: '🍦' },
    { id: 203, name: 'Frozen Foods', icon: '🧊' },
    { id: 204, name: 'Sweet Cravings', icon: '🍬' },
    { id: 205, name: 'Cold Drinks & Juices', icon: '🥤' },
    { id: 206, name: 'Munchies', icon: '🍿' },
    { id: 207, name: 'Biscuits & Cookies', icon: '🍪' },
  ];

  const beautySubCategories = [
    { id: 301, name: 'Makeup & Beauty', icon: '💄' },
    { id: 302, name: 'Skin Care', icon: '✨' },
    { id: 303, name: 'Protein & Nutrition', icon: '💪' },
    { id: 304, name: 'Baby Care', icon: '👶' },
    { id: 305, name: 'Bath & Body', icon: '🧴' },
    { id: 306, name: 'Hair Care', icon: '💇' },
    { id: 307, name: 'Jewelry & Accessories', icon: '💍' },
    { id: 308, name: 'Apparel & Lifestyle', icon: '👗' },
    { id: 309, name: 'Fragrances & Grooming', icon: '🧴' },
    { id: 310, name: 'Pharmacy & Wellness', icon: '💊' },
    { id: 311, name: 'Feminine Hygiene', icon: '🌸' },
  ];

  const householdSubCategories = [
    { id: 401, name: 'Home Needs', icon: '🏠' },
    { id: 402, name: 'Kitchen & Dining', icon: '🍽️' },
    { id: 403, name: 'Cleaning Essentials', icon: '🧹' },
    { id: 404, name: 'Electronic Appliances', icon: '⚡' },
    { id: 405, name: 'Pet Care', icon: '🐕' },
    { id: 406, name: 'Toys & Sports', icon: '⚽' },
    { id: 407, name: 'Stationary & Books', icon: '📚' },
    { id: 408, name: 'Paan Corner', icon: '🌿' },
  ];

  const shopByStore = [
    { id: 1, name: 'Pooja Store', icon: '🕉️' },
    { id: 2, name: 'Gift Card Store', icon: '🎁' },
    { id: 3, name: 'Monsoon Store', icon: '☔' },
    { id: 4, name: 'Decor Store', icon: '🏮' },
    { id: 5, name: 'Fitness Store', icon: '💪' },
    { id: 6, name: 'Birthday Store', icon: '🎂' },
    { id: 7, name: 'Gift Store', icon: '🎀' },
    { id: 8, name: 'Premium Store', icon: '⭐' },
  ];

  const CategoryCard = ({ category }) => (
    <button className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:border-green-300">
      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center mb-3 mx-auto">
        <span className="text-3xl">{category.icon}</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-800 text-center mb-1 min-h-[32px]">
        {category.name}
      </h3>
      <p className="text-xs text-gray-500 text-center">{category.count} items</p>
    </button>
  );

  const SubCategoryCard = ({ item, bgColor }) => (
    <button
      className={`${bgColor} rounded-xl p-4 hover:shadow-md transition-all aspect-square flex flex-col items-center justify-center`}
    >
      <span className="text-3xl mb-2">{item.icon}</span>
      <p className="text-xs font-semibold text-gray-800 text-center">
        {item.name}
      </p>
    </button>
  );

  const SubCategorySection = ({ title, items, bgColor }) => (
    <div className="bg-white p-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button className="text-sm font-semibold text-green-600 hover:text-green-700">
          See All
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <SubCategoryCard key={item.id} item={item} bgColor={bgColor} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">All Categories</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {/* Main Categories */}
        <div className="bg-white p-4 mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {mainCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Grocery & Kitchen */}
        <SubCategorySection
          title="Grocery & Kitchen"
          items={grocerySubCategories}
          bgColor="bg-green-50"
        />

        {/* Snacks & Drinks */}
        <SubCategorySection
          title="Snacks & Drinks"
          items={snacksSubCategories}
          bgColor="bg-orange-50"
        />

        {/* Beauty & Personal Care */}
        <SubCategorySection
          title="Beauty & Personal Care"
          items={beautySubCategories}
          bgColor="bg-pink-50"
        />

        {/* Household Essentials */}
        <SubCategorySection
          title="Household Essentials"
          items={householdSubCategories}
          bgColor="bg-blue-50"
        />

        {/* Shop by Store */}
        <SubCategorySection
          title="Shop by Store"
          items={shopByStore}
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
};

export default CategoriesScreen;
