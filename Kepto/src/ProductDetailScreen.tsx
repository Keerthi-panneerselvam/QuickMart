import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Search, 
  Clock, 
  Star, 
  ChevronRight, 
  Plus, 
  Minus, 
  ShoppingCart,
  Package,
  Zap,
  Tag,
  Heart
} from 'lucide-react';

const ProductDetailsScreen = () => {
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('highlights');

  const product = {
    id: 1,
    name: 'Fresh Tomatoes',
    images: ['🍅', '🍅', '🍅'],
    rating: 4.5,
    totalRatings: 120,
    offerPrice: 45,
    mrpPrice: 50,
    discount: 10,
    unit: '500g',
    deliveryMins: 8,
    highlights: [
      'Farm fresh tomatoes',
      'No pesticides used',
      'Organically grown',
      'Rich in vitamins A and C',
      'Perfect for salads and cooking'
    ],
    description: 'Premium quality farm fresh tomatoes, carefully selected for freshness and taste. These tomatoes are perfect for salads, curries, and all your cooking needs.',
    nutritionalInfo: {
      calories: '18 kcal',
      protein: '0.9g',
      carbs: '3.9g',
      fat: '0.2g',
      fiber: '1.2g'
    },
    storageInfo: 'Store in a cool, dry place. Best consumed within 3-4 days.',
    manufacturer: 'FreshFarm Pvt Ltd',
    countryOfOrigin: 'India',
    bestBefore: '5 days from delivery'
  };

  const offers = [
    {
      id: 1,
      code: 'FRESH10',
      title: '10% off on Fresh Vegetables',
      description: 'Use code FRESH10 at checkout'
    },
    {
      id: 2,
      code: 'FLAT125',
      title: 'Flat ₹125 OFF',
      description: 'On orders above ₹499'
    }
  ];

  const similarProducts = [
    { id: 2, name: 'Fresh Onions', image: '🧅', price: 35, unit: '1kg' },
    { id: 3, name: 'Green Capsicum', image: '🫑', price: 55, unit: '500g' },
    { id: 4, name: 'Fresh Potatoes', image: '🥔', price: 25, unit: '1kg' },
    { id: 5, name: 'Fresh Carrots', image: '🥕', price: 40, unit: '500g' },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={22} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={22} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {/* Product Images */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 relative">
          <button 
            onClick={toggleFavorite}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart 
              size={20} 
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
            />
          </button>
          
          <div className="h-80 flex items-center justify-center">
            <span className="text-9xl">{product.images[selectedImage]}</span>
          </div>

          {/* Image Thumbnails */}
          <div className="flex justify-center gap-2 pb-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-3xl ${
                  selectedImage === idx 
                    ? 'border-green-500 bg-white' 
                    : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 py-4">
          {/* Delivery Time */}
          <div className="flex items-center gap-1 bg-green-50 text-green-600 text-sm font-semibold px-3 py-1.5 rounded-lg w-fit mb-3">
            <Clock size={14} />
            <span>Estimated delivery: {product.deliveryMins} mins</span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded">
              <Star size={14} fill="white" />
              <span className="text-sm font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.totalRatings} ratings)</span>
          </div>

          {/* Weight */}
          <p className="text-gray-600 mb-4">{product.unit}</p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-800">₹{product.offerPrice}</span>
            <span className="text-lg text-gray-400 line-through">₹{product.mrpPrice}</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Incl. of all taxes</p>

          {/* Offers */}
          <div className="mb-4">
            <button className="flex items-center justify-between w-full text-green-600 font-semibold py-2">
              <div className="flex items-center gap-2">
                <Tag size={18} />
                <span>View all offers</span>
              </div>
              <ChevronRight size={18} />
            </button>
            <div className="space-y-2 mt-2">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Tag size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{offer.title}</p>
                      <p className="text-xs text-gray-600">{offer.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Link */}
          <button className="text-green-600 font-semibold text-sm mb-4 hover:underline">
            View all FreshFarm products →
          </button>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Package size={12} />
              <span>No return/exchange</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Zap size={12} />
              <span>Fast delivery</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('highlights')}
                className={`pb-2 font-semibold text-sm ${
                  activeTab === 'highlights'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500'
                }`}
              >
                Product Highlights
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2 font-semibold text-sm ${
                  activeTab === 'info'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500'
                }`}
              >
                Information
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'highlights' && (
            <div className="space-y-3 mb-6">
              {product.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Nutritional Information (per 100g)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                      <p className="font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Storage Instructions</h3>
                <p className="text-sm text-gray-600">{product.storageInfo}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Manufacturer</span>
                  <span className="font-semibold text-gray-800">{product.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country of Origin</span>
                  <span className="font-semibold text-gray-800">{product.countryOfOrigin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Before</span>
                  <span className="font-semibold text-gray-800">{product.bestBefore}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Similar Products */}
        <div className="bg-white px-4 py-6 mt-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 gap-3">
            {similarProducts.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 h-32 flex items-center justify-center">
                  <span className="text-5xl">{item.image}</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-gray-800 mb-1">{item.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{item.unit}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">₹{item.price}</span>
                    <button className="border-2 border-green-500 text-green-600 text-xs font-bold px-3 py-1 rounded-lg hover:bg-green-50">
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="bg-white px-4 py-6 mt-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">You might also like</h2>
          <div className="space-y-3">
            {similarProducts.slice(0, 2).map((item) => (
              <div key={`like-${item.id}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">{item.image}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{item.unit}</p>
                  <span className="font-bold text-gray-800">₹{item.price}</span>
                </div>
                <button className="border-2 border-green-500 text-green-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-50">
                  ADD
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <ShoppingCart size={24} className="text-gray-700" />
          </button>
          
          {quantity > 0 ? (
            <div className="flex-1 flex items-center justify-between bg-green-500 text-white rounded-xl p-3">
              <button 
                onClick={decrementQuantity}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsScreen;
