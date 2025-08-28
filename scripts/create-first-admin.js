// Script to create the first admin account
// Run this with: node scripts/create-first-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Your Firebase configuration from src/firebase/firebaseConfig.ts
const firebaseConfig = {
  apiKey: "AIzaSyAFjDW0o2fClPk-GC2orBteasVCUHO6V5c",
  authDomain: "dadagym-store.firebaseapp.com",
  projectId: "dadagym-store",
  storageBucket: "dadagym-store.firebasestorage.app",
  messagingSenderId: "123456789", // You'll need to update this
  appId: "1:123456789:web:abcdef123456" // You'll need to update this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createFirstAdmin() {
  try {
    console.log('🚀 Creating first admin account...');
    
    // Replace these with your desired admin credentials
    const email = 'admin@dadagym.com';
    const password = 'Admin123!'; // Change this to a strong password
    const name = 'مدير النظام';
    
    // Create the user in Firebase Auth
    console.log('Creating user in Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User created successfully:', user.uid);
    
    // Create the user profile in Firestore with admin role
    console.log('Creating admin profile in Firestore...');
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
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
    
    console.log('✅ Admin profile created successfully!');
    console.log('\n📋 Admin Account Details:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Name:', name);
    console.log('User ID:', user.uid);
    console.log('\n🔑 You can now login with these credentials at /auth/login');
    console.log('🚪 Then access the admin panel at /admin');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    console.log('\n💡 If you get a "project not found" error:');
    console.log('1. Check your Firebase project ID in firebaseConfig.ts');
    console.log('2. Make sure Firebase is properly configured');
    console.log('3. Check if the email is already registered');
  }
}

// Run the function
createFirstAdmin();
