"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/ui/title";
import { getUsers, updateUserRole } from "@/firebase/ecommerceActions";
import { User } from "@/types/store";
import { User as UserIcon, Shield, Crown } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('خطأ في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: User['role']) => {
    try {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        toast.success('تم تحديث دور المستخدم بنجاح');
      } else {
        toast.error('فشل في تحديث دور المستخدم');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('خطأ في تحديث دور المستخدم');
    }
  };

  const getRoleIcon = (role: User['role']) => {
    return role === 'admin' ? <Crown size={16} className="text-yellow-400" /> : <UserIcon size={16} className="text-blue-400" />;
  };

  const getRoleText = (role: User['role']) => {
    return role === 'admin' ? 'مدير' : 'عميل';
  };

  const getRoleColor = (role: User['role']) => {
    return role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>إدارة المستخدمين</Title>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title>إدارة المستخدمين</Title>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="فلترة حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="customer">عملاء</SelectItem>
                <SelectItem value="admin">مديرين</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            المستخدمين ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              لا توجد مستخدمين
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <UserIcon size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-white/60">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-white/60">{user.phone}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getRoleColor(user.role)} border-0 flex items-center gap-1`}>
                      {getRoleIcon(user.role)}
                      {getRoleText(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleUpdate(user.id!, value as User['role'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">عميل</SelectItem>
                        <SelectItem value="admin">مدير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}