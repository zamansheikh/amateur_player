'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Clock, Tag, Filter, ShoppingCart, Users, Package, Zap, Shirt, Target, Wrench, Trophy, DollarSign, User, Shield } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  category: 'balls' | 'shoes' | 'bags' | 'accessories' | 'apparel' | 'lane-equipment';
  sellerType: 'amateur' | 'pro' | 'manufacturer';
  sellerName: string;
  sellerRating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  description: string;
  image: string;
  location: string;
  postedDate: string;
  tags: string[];
  brand: string;
  specifications?: { [key: string]: string };
  inStock: boolean;
  isFeatured?: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Storm Phaze II Bowling Ball",
    category: 'balls',
    sellerType: 'pro',
    sellerName: "Mike Jensen",
    sellerRating: 4.9,
    reviewCount: 87,
    price: 180,
    originalPrice: 220,
    condition: 'like-new',
    description: "Professional grade reactive resin ball, barely used. Perfect for intermediate to advanced players. Drilled for right-handed player, finger holes can be plugged and re-drilled.",
    image: "/api/placeholder/300/300",
    location: "Brooklyn, NY",
    postedDate: "2 days ago",
    tags: ["Reactive Resin", "15 lbs", "Pro Used"],
    brand: "Storm",
    specifications: {
      "Weight": "15 lbs",
      "Coverstock": "R2S Pearl Reactive",
      "Core": "Velocity",
      "RG": "2.49",
      "Differential": "0.052"
    },
    inStock: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Dexter SST 8 Pro Bowling Shoes",
    category: 'shoes',
    sellerType: 'amateur',
    sellerName: "Sarah Williams",
    sellerRating: 4.6,
    reviewCount: 23,
    price: 85,
    originalPrice: 140,
    condition: 'good',
    description: "Comfortable professional bowling shoes in excellent condition. Size 8.5 women's. Interchangeable soles and heels included. Perfect for league play.",
    image: "/api/placeholder/300/300",
    location: "Queens, NY",
    postedDate: "5 days ago",
    tags: ["Size 8.5", "Women's", "Interchangeable"],
    brand: "Dexter",
    specifications: {
      "Size": "8.5 (Women's)",
      "Type": "Performance",
      "Sole": "Interchangeable",
      "Heel": "Interchangeable"
    },
    inStock: true
  },
  {
    id: 3,
    name: "Brunswick Edge 4-Ball Roller Bag",
    category: 'bags',
    sellerType: 'manufacturer',
    sellerName: "Brunswick Official",
    sellerRating: 4.8,
    reviewCount: 156,
    price: 320,
    condition: 'new',
    description: "Brand new 4-ball roller bag with premium wheels and durable construction. Perfect for tournament players who need to transport multiple balls.",
    image: "/api/placeholder/300/300",
    location: "Manufacturer Direct",
    postedDate: "1 week ago",
    tags: ["4-Ball", "Roller", "Tournament", "New"],
    brand: "Brunswick",
    specifications: {
      "Capacity": "4 Balls",
      "Type": "Rolling",
      "Material": "600D Polyester",
      "Wheels": "Premium Inline"
    },
    inStock: true,
    isFeatured: true
  },
  {
    id: 4,
    name: "Motiv Venom Shock Bowling Ball",
    category: 'balls',
    sellerType: 'amateur',
    sellerName: "Tony Rodriguez",
    sellerRating: 4.7,
    reviewCount: 34,
    price: 95,
    originalPrice: 150,
    condition: 'good',
    description: "Great entry-level reactive ball. Has been my go-to ball for 2 years. Some lane shine but still hooks well. 14 lb ball, fingertip grip.",
    image: "/api/placeholder/300/300",
    location: "Manhattan, NY",
    postedDate: "3 days ago",
    tags: ["14 lbs", "Reactive", "Entry Level"],
    brand: "Motiv",
    specifications: {
      "Weight": "14 lbs",
      "Coverstock": "Turmoil MFS Reactive",
      "Core": "Gear Weight Block",
      "RG": "2.53",
      "Differential": "0.030"
    },
    inStock: true
  },
  {
    id: 5,
    name: "Professional Bowling Shirt - Team USA",
    category: 'apparel',
    sellerType: 'pro',
    sellerName: "Jason Belmonte Store",
    sellerRating: 5.0,
    reviewCount: 78,
    price: 65,
    condition: 'new',
    description: "Official Team USA bowling shirt. Moisture-wicking fabric with professional cut. Perfect for league or tournament play.",
    image: "/api/placeholder/300/300",
    location: "Pro Shop Direct",
    postedDate: "4 days ago",
    tags: ["Team USA", "Moisture Wicking", "Professional"],
    brand: "Team USA",
    specifications: {
      "Size": "L",
      "Material": "Polyester Blend",
      "Fit": "Athletic",
      "Care": "Machine Washable"
    },
    inStock: true
  },
  {
    id: 6,
    name: "Lane Conditioning Oil - House Shot",
    category: 'lane-equipment',
    sellerType: 'manufacturer',
    sellerName: "Kegel Training Center",
    sellerRating: 4.9,
    reviewCount: 92,
    price: 45,
    condition: 'new',
    description: "Professional lane conditioning oil for house shot patterns. 5-gallon container, perfect for bowling centers or serious practice facilities.",
    image: "/api/placeholder/300/300",
    location: "Lake Wales, FL",
    postedDate: "1 week ago",
    tags: ["House Shot", "5 Gallon", "Professional"],
    brand: "Kegel",
    specifications: {
      "Volume": "5 Gallons",
      "Type": "House Shot Pattern",
      "Viscosity": "Medium",
      "Application": "Lane Machine"
    },
    inStock: true,
    isFeatured: true
  },
  {
    id: 7,
    name: "Wrist Support - Robby's RevMax",
    category: 'accessories',
    sellerType: 'amateur',
    sellerName: "Lisa Chen",
    sellerRating: 4.5,
    reviewCount: 19,
    price: 35,
    originalPrice: 55,
    condition: 'like-new',
    description: "Barely used wrist support. Helps maintain proper wrist position during release. Adjustable fit, very comfortable.",
    image: "/api/placeholder/300/300",
    location: "Staten Island, NY",
    postedDate: "6 days ago",
    tags: ["Wrist Support", "Adjustable", "Like New"],
    brand: "Robby's",
    specifications: {
      "Size": "One Size",
      "Material": "Neoprene",
      "Adjustability": "Full",
      "Hand": "Right"
    },
    inStock: true
  },
  {
    id: 8,
    name: "Hammer Black Widow 2.0",
    category: 'balls',
    sellerType: 'pro',
    sellerName: "Tournament Pro Shop",
    sellerRating: 4.8,
    reviewCount: 143,
    price: 210,
    condition: 'new',
    description: "Brand new Hammer Black Widow 2.0. Aggressive hook potential for heavy oil conditions. Undrilled, can be custom fitted.",
    image: "/api/placeholder/300/300",
    location: "Professional Shop",
    postedDate: "2 days ago",
    tags: ["16 lbs", "Heavy Oil", "Undrilled", "New"],
    brand: "Hammer",
    specifications: {
      "Weight": "16 lbs",
      "Coverstock": "Aggression CFI",
      "Core": "Gas Mask",
      "RG": "2.48",
      "Differential": "0.058"
    },
    inStock: true,
    isFeatured: true
  }
];

export default function LaneXchangePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedSellerType, setSelectedSellerType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const categories = [
    { id: 'all', name: 'All Products', icon: Package, count: mockProducts.length },
    { id: 'balls', name: 'Bowling Balls', icon: Target, count: mockProducts.filter(p => p.category === 'balls').length },
    { id: 'shoes', name: 'Bowling Shoes', icon: Zap, count: mockProducts.filter(p => p.category === 'shoes').length },
    { id: 'bags', name: 'Bags & Cases', icon: ShoppingCart, count: mockProducts.filter(p => p.category === 'bags').length },
    { id: 'accessories', name: 'Accessories', icon: Wrench, count: mockProducts.filter(p => p.category === 'accessories').length },
    { id: 'apparel', name: 'Apparel', icon: Shirt, count: mockProducts.filter(p => p.category === 'apparel').length },
    { id: 'lane-equipment', name: 'Lane Equipment', icon: Trophy, count: mockProducts.filter(p => p.category === 'lane-equipment').length },
  ];

  const sellerTypes = [
    { id: 'all', name: 'All Sellers', count: mockProducts.length },
    { id: 'amateur', name: 'Amateur Players', count: mockProducts.filter(p => p.sellerType === 'amateur').length },
    { id: 'pro', name: 'Pro Players', count: mockProducts.filter(p => p.sellerType === 'pro').length },
    { id: 'manufacturer', name: 'Manufacturers', count: mockProducts.filter(p => p.sellerType === 'manufacturer').length },
  ];

  const conditions = [
    { id: 'all', name: 'All Conditions' },
    { id: 'new', name: 'New' },
    { id: 'like-new', name: 'Like New' },
    { id: 'good', name: 'Good' },
    { id: 'fair', name: 'Fair' },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || product.condition === selectedCondition;
    const matchesSellerType = selectedSellerType === 'all' || product.sellerType === selectedSellerType;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesCondition && matchesSellerType && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.sellerRating - a.sellerRating;
      case 'newest':
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSellerTypeIcon = (sellerType: string) => {
    switch (sellerType) {
      case 'pro': return <Trophy className="w-4 h-4" />;
      case 'manufacturer': return <Shield className="w-4 h-4" />;
      case 'amateur': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getSellerTypeColor = (sellerType: string) => {
    switch (sellerType) {
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'manufacturer': return 'bg-indigo-100 text-indigo-800';
      case 'amateur': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold mb-2">Lane Xchange</h1>
                <p className="text-xl text-white/90">Buy & Sell Bowling Equipment within the Community</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed">
                Connect with amateur players, pros, and manufacturers to buy and sell quality bowling equipment. 
                From beginner gear to professional tournament equipment - find everything you need to improve your game!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Top Row: Search + Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex-1 relative min-w-0 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
            type="text"
            placeholder="Search bowling balls, shoes, accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4 flex-shrink-0 w-full md:w-auto">
              <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[160px]"
              >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated Sellers</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {conditions.map((condition) => (
            <option key={condition.id} value={condition.id}>{condition.name}</option>
              ))}
            </select>

            <select
              value={selectedSellerType}
              onChange={(e) => setSelectedSellerType(e.target.value)}
              className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sellerTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name} ({type.count})</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex flex-1 gap-2 items-center min-w-0">
              <span className="text-sm text-gray-600 whitespace-nowrap">Price:</span>
              <input
            type="number"
            placeholder="Min"
            value={priceRange.min || ''}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
            className="w-20 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            min={0}
              />
              <span className="text-gray-400">-</span>
              <input
            type="number"
            placeholder="Max"
            value={priceRange.max || ''}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
            className="w-20 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            min={0}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex md:justify-end w-full md:w-auto">
              <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCondition('all');
              setSelectedSellerType('all');
              setSearchTerm('');
              setPriceRange({ min: 0, max: 1000 });
            }}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
            Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <IconComponent className="w-7 h-7 mb-2" />
                  <span className="font-medium text-sm leading-tight">{category.name}</span>
                  <span className="text-xs text-gray-500 mt-1">({category.count})</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Products Banner */}
        {sortedProducts.some(p => p.isFeatured) && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900">Featured Products</h3>
            </div>
            <p className="text-gray-700 text-sm">Check out these specially curated items from top sellers!</p>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${product.isFeatured ? 'ring-2 ring-yellow-400' : ''}`}>
              {product.isFeatured && (
                <div className="bg-yellow-400 text-yellow-900 text-center py-2 text-xs font-bold">
                  ⭐ FEATURED
                </div>
              )}
              
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Package className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{product.brand}</p>
                  </div>
                </div>
                
                {/* Condition Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
                  {product.condition.toUpperCase()}
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ${product.price}
                </div>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SOLD OUT</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSellerTypeColor(product.sellerType)}`}>
                    {getSellerTypeIcon(product.sellerType)}
                    {product.sellerType.charAt(0).toUpperCase() + product.sellerType.slice(1)}
                  </div>
                  <span className="text-sm text-gray-600">{product.sellerName}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{product.sellerRating}</span>
                  <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{product.location}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{product.postedDate}</span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{product.description}</p>

                {/* Specifications */}
                {product.specifications && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Specs:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900 ml-1 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-green-600 font-medium">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      product.inStock 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'View Details' : 'Sold Out'}
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Seller Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Lane Xchange Community</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Whether you're looking to upgrade your equipment or sell items you no longer need, 
              Lane Xchange connects you with passionate bowlers, professionals, and trusted manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Amateur Players</h3>
              <p className="text-gray-600 text-sm">Buy and sell equipment as you progress in your bowling journey</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Players</h3>
              <p className="text-gray-600 text-sm">Access to pro-used equipment and exclusive gear from tournament players</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manufacturers</h3>
              <p className="text-gray-600 text-sm">Direct sales from trusted bowling equipment manufacturers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Start Selling
            </button>
            <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
