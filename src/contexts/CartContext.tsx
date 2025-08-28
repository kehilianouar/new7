"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types/store';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, variants?: { [key: string]: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; variants?: { [key: string]: string } } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, variants } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemsCount: calculateItemsCount(updatedItems)
        };
      } else {
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          selectedVariants: variants,
          price: product.price
        };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemsCount: calculateItemsCount(updatedItems)
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.productId !== action.payload.productId);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemsCount: calculateItemsCount(updatedItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }
      
      const updatedItems = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemsCount: calculateItemsCount(updatedItems)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemsCount: 0
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemsCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemsCount: 0
  });

  // Load cart from localStorage on mount with validation
  useEffect(() => {
    const savedCart = localStorage.getItem('gym-dada-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Validate and sanitize the loaded cart data
        const validatedCart: Cart = {
          items: Array.isArray(parsedCart.items) 
            ? parsedCart.items.filter((item: any) => 
                item && 
                item.productId && 
                item.product && 
                typeof item.quantity === 'number' && 
                item.quantity > 0 &&
                typeof item.price === 'number'
              ).map((item: any) => ({
                productId: item.productId || '',
                product: {
                  id: item.product?.id || '',
                  name: item.product?.name || 'Product',
                  description: item.product?.description || '',
                  price: item.product?.price || 0,
                  images: Array.isArray(item.product?.images) ? item.product.images : [],
                  category: item.product?.category || '',
                  brand: item.product?.brand || '',
                  inStock: item.product?.inStock !== undefined ? item.product.inStock : true,
                  stockQuantity: item.product?.stockQuantity || 0,
                  createdAt: item.product?.createdAt ? new Date(item.product.createdAt) : new Date(),
                  updatedAt: item.product?.updatedAt ? new Date(item.product.updatedAt) : new Date()
                },
                quantity: Math.max(1, item.quantity || 1),
                selectedVariants: item.selectedVariants || {},
                price: typeof item.price === 'number' ? item.price : (item.product?.price || 0)
              }))
            : [],
          total: typeof parsedCart.total === 'number' ? parsedCart.total : 0,
          itemsCount: typeof parsedCart.itemsCount === 'number' ? parsedCart.itemsCount : 0
        };
        
        dispatch({ type: 'LOAD_CART', payload: validatedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear corrupted cart data
        localStorage.removeItem('gym-dada-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gym-dada-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, variants?: { [key: string]: string }) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, variants } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => cart.total;
  const getCartItemsCount = () => cart.itemsCount;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};