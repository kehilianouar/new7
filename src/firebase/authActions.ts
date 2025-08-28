
// Firebase Auth
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getAuth,
  sendEmailVerification,
  type User,
} from "firebase/auth"

// Firebase Firestore
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/firebase/firebaseConfig"

// Next.js
import { notFound } from "next/navigation"

// Types
import { User as StoreUser } from "@/types/store"

export const registerWithEmail = async (email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore immediately after registration
    if (res.user) {
      // Auto-detect admin accounts by email pattern
      const isAdmin = email.endsWith('@admin.dadagym.com') || email === 'admin@dadagym.com';
      
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        role: isAdmin ? 'admin' : 'customer',
        isEmailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        favoriteProducts: [],
        recentViews: [],
        addresses: [],
        orders: []
      });

      if (isAdmin) {
        console.log('✅ Admin account created automatically:', email);
      }
    }
    
    return res.user;
  } catch (err: any) {
    throw err; // Re-throw the error to be handled by the calling function
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { user: res.user };
  } catch (err: any) {
    throw err;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create one
    if (res.user) {
      const userDoc = await getDoc(doc(db, 'users', res.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          name: res.user.displayName || '',
          email: res.user.email,
          avatar: res.user.photoURL || '',
          role: 'customer',
          isEmailVerified: res.user.emailVerified,
          provider: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          favoriteProducts: [],
          recentViews: [],
          addresses: [],
          orders: []
        });
      }
    }
    
    return res.user;
  } catch (err: any) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch {
    // Silent catch for logout errors
  }
};

export const saveUserProfile = async (
  uid: string,
  data: Partial<StoreUser> & {
    name: string;
    email: string;
  }
) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const getUserProfile = async (uid: string): Promise<StoreUser | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as StoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
};

export const checkUserRole = async (uid: string): Promise<'customer' | 'admin' | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || 'customer';
    }
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

export const resetPassword = async (email: string) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code }; // ← مهم جدًا ترجع error.code
  }
};

export const redirectIfLoggedIn = () => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      notFound()
    }
  });
  return unsub;
};

export const updateUserProfile = async (uid: string, newData: Partial<{
  name: string;
  birthdate: string;
  avatar: string;
  phone: string;
  addresses: any[];
}>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...newData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const sendVerificationLink = async () => {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await sendEmailVerification(user, { url: "http://localhost:3000/profile" });
  }
};

export const checkEmailVerificationAndUpdate = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await user.reload(); 
  if (user.emailVerified) {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isEmailVerified: true,
        verifiedAt: new Date().toISOString(), 
      });
    } catch {
      // Silent catch for email verification update errors
    }
  }
};

// E-commerce specific user functions
export const addToFavorites = async (userId: string, productId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favoriteProducts: arrayUnion(productId)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const removeFromFavorites = async (userId: string, productId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData.favoriteProducts || [];
      const updatedFavorites = favorites.filter((id: string) => id !== productId);
      
      await updateDoc(userRef, {
        favoriteProducts: updatedFavorites
      });
      return { success: true };
    }
    return { success: false, error: 'user-not-found' };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const addToRecentViews = async (userId: string, productId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const recentViews = userData.recentViews || [];
      
      // Remove if already exists to avoid duplicates
      const filteredViews = recentViews.filter((id: string) => id !== productId);
      // Add to beginning and limit to last 20 views
      const updatedViews = [productId, ...filteredViews].slice(0, 20);
      
      await updateDoc(userRef, {
        recentViews: updatedViews
      });
      return { success: true };
    }
    return { success: false, error: 'user-not-found' };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.favoriteProducts || [];
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const getUserRecentViews = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.recentViews || [];
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const isProductInFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const favorites = await getUserFavorites(userId);
    return favorites.includes(productId);
  } catch (error) {
    return false;
  }
};

export const updateUserAddresses = async (userId: string, addresses: any[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      addresses: addresses
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

export const updateUserOrders = async (userId: string, orders: any[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      orders: orders
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code };
  }
};

