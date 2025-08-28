import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Product, Order, User, StoreSettings, WilayaShipping, Banner, Category } from "@/types/store";

// Product Functions
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const data = productDoc.data();
      return {
        id: productDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Order Functions
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string | null> => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Store Settings Functions
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  try {
    const settingsRef = doc(db, 'settings', 'store');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return settingsDoc.data() as StoreSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }
};

export const updateStoreSettings = async (settings: StoreSettings): Promise<boolean> => {
  try {
    const settingsRef = doc(db, 'settings', 'store');
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating store settings:', error);
    return false;
  }
};

export const getShippingPrices = async (): Promise<WilayaShipping[]> => {
  try {
    const shippingRef = collection(db, 'shipping');
    const snapshot = await getDocs(shippingRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WilayaShipping[];
  } catch (error) {
    console.error('Error fetching shipping prices:', error);
    return [];
  }
};

export const updateShippingPrices = async (shippingData: WilayaShipping[]): Promise<boolean> => {
  try {
    const batch = writeBatch(db);
    
    shippingData.forEach(wilaya => {
      const shippingRef = doc(db, 'shipping', wilaya.id);
      batch.set(shippingRef, wilaya);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error updating shipping prices:', error);
    return false;
  }
};

// Category Functions
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<string | null> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<boolean> => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// Banner Functions
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const bannersRef = collection(db, 'banners');
    const q = query(bannersRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

export const createBanner = async (bannerData: Omit<Banner, 'id'>): Promise<string | null> => {
  try {
    const bannersRef = collection(db, 'banners');
    const docRef = await addDoc(bannersRef, bannerData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating banner:', error);
    return null;
  }
};

export const updateBanner = async (bannerId: string, updates: Partial<Banner>): Promise<boolean> => {
  try {
    const bannerRef = doc(db, 'banners', bannerId);
    await updateDoc(bannerRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating banner:', error);
    return false;
  }
};

export const deleteBanner = async (bannerId: string): Promise<boolean> => {
  try {
    const bannerRef = doc(db, 'banners', bannerId);
    await deleteDoc(bannerRef);
    return true;
  } catch (error) {
    console.error('Error deleting banner:', error);
    return false;
  }
};

// User Functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserRole = async (userId: string, role: User['role']): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

// Product Reviews Functions
export const addProductReview = async (productId: string, userId: string, review: {
  rating: number;
  comment: string;
  userName: string;
}): Promise<boolean> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      productId,
      userId,
      ...review,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error adding review:', error);
    return false;
  }
};

export const getProductReviews = async (productId: string): Promise<any[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};