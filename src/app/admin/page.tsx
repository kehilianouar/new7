"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { getAllProducts, getAllOrders, getUsers } from "@/firebase/ecommerceActions";
import { Product, Order, User } from "@/types/store";
import Title from "@/components/ui/title";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders, users] = await Promise.all([
          getAllProducts(),
          getAllOrders(),
          getUsers()
        ]);

        const totalRevenue = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.total, 0);

        const pendingOrders = orders.filter(order => 
          ['pending', 'confirmed', 'processing'].includes(order.status)
        ).length;

        const lowStockProducts = products.filter(product => 
          product.stockQuantity < 10
        ).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
          lowStockProducts
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-500"
    },
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-500"
    },
    {
      title: "إجمالي العملاء",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "إجمالي الإيرادات",
      value: `${stats.totalRevenue.toLocaleString()} دج`,
      icon: DollarSign,
      color: "text-yellow-500"
    },
    {
      title: "الطلبات المعلقة",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-orange-500"
    },
    {
      title: "منتجات قليلة المخزون",
      value: stats.lowStockProducts,
      icon: TrendingDown,
      color: "text-red-500"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>لوحة التحكم</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title>لوحة التحكم</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-[#ffffff1a] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">نظرة عامة سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">الطلبات اليوم</span>
              <span className="text-white font-bold">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">المبيعات اليوم</span>
              <span className="text-white font-bold">- دج</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">عملاء جدد</span>
              <span className="text-white font-bold">-</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-right p-3 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors">
              إضافة منتج جديد
            </button>
            <button className="w-full text-right p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              مراجعة الطلبات المعلقة
            </button>
            <button className="w-full text-right p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              إدارة المخزون
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}