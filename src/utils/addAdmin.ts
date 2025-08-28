"use client";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

/**
 * Utility function to promote a user to admin role
 * @param userId The Firebase UID of the user to promote to admin
 */
export async function promoteToAdmin(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, message: 'تم ترقية المستخدم إلى مدير بنجاح' };
  } catch (error: any) {
    console.error('Error promoting user to admin:', error);
    return { success: false, message: `خطأ: ${error.message}` };
  }
}

/**
 * Utility function to create a new admin user
 * @param email Email for the admin account
 * @param password Password for the admin account
 * @param name Name of the admin user
 */
export async function createAdminUser(email: string, password: string, name: string): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    // First create the user with Firebase Auth
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('@/firebase/firebaseConfig');
    
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Then create the user profile with admin role
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('@/firebase/firebaseConfig');
    
    await setDoc(doc(db, 'users', res.user.uid), {
      uid: res.user.uid,
      email: res.user.email,
      name: name,
      role: 'admin',
      isEmailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      favoriteProducts: [],
      recentViews: [],
      addresses: [],
      orders: []
    });
    
    return { success: true, message: 'تم إنشاء حساب المدير بنجاح', userId: res.user.uid };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { success: false, message: `خطأ: ${error.message}` };
  }
}
