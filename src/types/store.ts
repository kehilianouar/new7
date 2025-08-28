// أنواع البيانات الخاصة بالمتجر
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  variants?: ProductVariant[];
  specifications?: { [key: string]: string };
  usage?: string;
  ingredients?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  slug?: string; // Making slug optional
  variantPrices?: { [key: string]: number }; // Adding variantPrices property
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stockQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemsCount: number;
}

export interface Wilaya {
  id: string;
  name: string;
  shippingPrice: number;
}

export interface Baladiya {
  id: string;
  name: string;
  wilayaId: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerInfo: {
    name: string;
    phone: string;
    wilaya: string;
    baladiya: string;
    address: string;
    shippingType: 'home' | 'office';
  };
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod'; // Cash on delivery
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  birthdate?: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  orders?: Order[];
  createdAt?: Date | any;
  updatedAt?: Date | any;
  // New fields for e-commerce
  favoriteProducts?: string[]; // List of product IDs the user has favorited
  recentViews?: string[]; // List of product IDs the user has recently viewed
  isEmailVerified?: boolean; // Email verification status
  provider?: string; // Authentication provider (email, google, etc.)
  favoriteGenres?: number[]; // For movie preferences
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  baladiya: string;
  address: string;
  isDefault: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  shippingSettings: {
    freeShippingThreshold: number;
    defaultDeskPrice: number;
    defaultHomePrice: number;
  };
  paymentMethods: string[];
  excludedWilayas: string[];
}

export interface WilayaShipping {
  id: string;
  name: string;
  deskPrice: number;
  homePrice: number;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}