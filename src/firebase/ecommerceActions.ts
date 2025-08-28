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
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Product, Order, User, StoreSettings, WilayaShipping } from "@/types/store";

// Product Management Functions
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
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
      return { id: productDoc.id, ...productDoc.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category));
    const productsSnapshot = await getDocs(q);
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('isFeatured', '==', true),
      limit(8)
    );
    const productsSnapshot = await getDocs(q);
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() } as Product;
      if (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        products.push(product);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const updateStoreSettings = async (settings: StoreSettings & { wilayaShippingPrices: WilayaShipping[] }): Promise<boolean> => {
  try {
    const settingsRef = doc(db, 'storeSettings', 'store_config'); 
    await updateDoc(settingsRef, settings as any);
    return true;
  } catch (error) {
    console.error('Error updating store settings:', error);
    return false;
  }
};

// New function to get store settings and shipping prices
export const getStoreSettingsAndShippingPrices = async (): Promise<(StoreSettings & { wilayaShippingPrices: WilayaShipping[] }) | null> => {
  try {
    const settingsRef = doc(db, 'storeSettings', 'store_config');
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return settingsDoc.data() as (StoreSettings & { wilayaShippingPrices: WilayaShipping[] });
    }
    return null;
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }
};


export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string | null> => {
  try {
    const ordersRef = collection(db, 'orders');
    const orderDoc = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return orderDoc.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    
    ordersSnapshot.forEach((doc) => {
      const order = { id: doc.id, ...doc.data() } as Order;
      if (order.userId === userId) {
        orders.push(order);
      }
    });
    
    return orders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const ordersSnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Admin Functions
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const productsRef = collection(db, 'products');
    const productDoc = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return productDoc.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
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

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users: User[] = [];
    
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserRole = async (userId: string, role: User['role']): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: role,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};