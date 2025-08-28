// Guide to create your first admin account
// This script will guide you through the process step by step

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 دليل إنشاء الحساب الإداري الأول');
console.log('==================================\n');

console.log('📋 الخطوة 1: الحصول على معلومات Firebase الخاصة بك');
console.log('افتح ملف src/firebase/firebaseConfig.ts وابحث عن هذه المعلومات:');
console.log('- apiKey');
console.log('- authDomain'); 
console.log('- projectId');
console.log('- storageBucket');
console.log('- messagingSenderId');
console.log('- appId');
console.log('- measurementId (اختياري)\n');

console.log('📋 الخطوة 2: تشغيل الأوامر التالية في الطرفية:');

console.log('\n🔧 الطريقة 1: استخدام وحدة التحكم في Firebase (الأسهل)');
console.log('1. انتقل إلى https://console.firebase.google.com/');
console.log('2. اختر مشروعك');
console.log('3. انتقل إلى Authentication → علامة التبويب Users');
console.log('4. انقر على "Add user"');
console.log('5. أدخل البريد الإلكتروني وكلمة المرور');
console.log('6. بعد إنشاء المستخدم، انتقل إلى Firestore Database');
console.log('7. ابحث عن مجموعة "users" وأنشئ مستندًا جديدًا بمعرف المستخدم');
console.log('8. أضف هذه البيانات:');
console.log('   {');
console.log('     uid: "معرف_المستخدم",');
console.log('     email: "البريد_الإلكتروني",');
console.log('     name: "اسم_المدير",');
console.log('     role: "admin",');
console.log('     isEmailVerified: false,');
console.log('     createdAt: new Date(),');
console.log('     updatedAt: new Date(),');
console.log('     favoriteProducts: [],');
console.log('     recentViews: [],');
console.log('     addresses: [],');
console.log('     orders: []');
console.log('   }');

console.log('\n🔧 الطريقة 2: استخدام سكريبت Node.js (يتطلب التثبيت)');
console.log('1. قم بتثبيت حزم Firebase:');
console.log('   npm install firebase');
console.log('2. عدل ملف scripts/create-first-admin.js بإضافة معلومات Firebase الخاصة بك');
console.log('3. قم بتشغيل:');
console.log('   node scripts/create-first-admin.js');

console.log('\n🔧 الطريقة 3: يدويًا عبر واجهة المستخدم');
console.log('1. سجل الدخول كعميل عادي عبر /auth/signup');
console.log('2. استخدم أدوات المطور (F12) للعثور على معرف المستخدم (UID)');
console.log('3. انتقل إلى Firebase Console → Firestore Database');
console.log('4. عدل مستند المستخدم وغير role من "customer" إلى "admin"');

console.log('\n📞 للحصول على المساعدة:');
console.log('- راجع ملف ADMIN_SETUP_GUIDE.md');
console.log('- تحقق من تكوين Firebase في src/firebase/firebaseConfig.ts');
console.log('- تأكد من أن مشروع Firebase نشط وتم تكوينه بشكل صحيح');

readline.question('\nاضغط Enter عند الانتهاء من إنشاء الحساب الإداري...', () => {
  console.log('\n✅ تم! يمكنك الآن:');
  console.log('1. تسجيل الدخول باستخدام حساب المدير في /auth/login');
  console.log('2. الوصول إلى لوحة التحكم في /admin');
  console.log('3. إدارة الحسابات الأخرى في /admin/manage-users');
  readline.close();
});
