"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { promoteToAdmin, createAdminUser } from "@/utils/addAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Crown, UserPlus } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  name?: string;
  role: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData: UserData[] = [];
      
      usersSnapshot.forEach((doc) => {
        usersData.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('خطأ في جلب بيانات المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string, userEmail: string) => {
    const result = await promoteToAdmin(userId);
    if (result.success) {
      setMessage(`تم ترقية ${userEmail} إلى مدير بنجاح`);
      fetchUsers(); // Refresh the list
    } else {
      setMessage(result.message);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword || !newAdminName) {
      setMessage('يرجى ملء جميع الحقول');
      return;
    }

    const result = await createAdminUser(newAdminEmail, newAdminPassword, newAdminName);
    setMessage(result.message);
    
    if (result.success) {
      setNewAdminEmail("");
      setNewAdminPassword("");
      setNewAdminName("");
      fetchUsers(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">إدارة المستخدمين</h1>
        <p className="text-gray-600">إدارة صلاحيات المستخدمين وإنشاء حسابات إدارية</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Create New Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} />
              إنشاء مدير جديد
            </CardTitle>
            <CardDescription>إنشاء حساب إداري جديد مع صلاحيات كاملة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="الاسم الكامل"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
            />
            <Button onClick={handleCreateAdmin} className="w-full">
              إنشاء حساب مدير
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              إحصائيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {users.length}
                </div>
                <div className="text-sm text-blue-600">إجمالي المستخدمين</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-yellow-600">المديرين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            قائمة المستخدمين
          </CardTitle>
          <CardDescription>إدارة صلاحيات المستخدمين الحاليين</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">البريد الإلكتروني</th>
                  <th className="text-right p-3">الدور</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name || 'بدون اسم'}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'مدير' : 'عميل'}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.role === 'customer' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromoteToAdmin(user.uid, user.email)}
                          className="flex items-center gap-1"
                        >
                          <Crown size={14} />
                          ترقية إلى مدير
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
