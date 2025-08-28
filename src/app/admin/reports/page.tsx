"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/ui/title";
import { getProducts, getOrders, getUsers } from "@/firebase/storeActions";
import { Product, Order, User } from "@/types/store";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Calendar,
  Target
} from "lucide-react";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    topSellingProducts: [] as Product[],
    recentOrders: [] as Order[],
    salesByCategory: {} as { [key: string]: number }
  });

  useEffect(() => {
    fetchReportsData();
  }, [timeRange]);

  const fetchReportsData = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        getProducts(),
        getOrders(),
        getUsers()
      ]);

      // Calculate date range
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Filter orders by date range
      const filteredOrders = orders.filter(order => 
        new Date(order.createdAt) >= startDate
      );

      // Calculate revenue
      const totalRevenue = filteredOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);

      // Calculate average order value
      const averageOrderValue = filteredOrders.length > 0 
        ? totalRevenue / filteredOrders.length 
        : 0;

      // Calculate sales by category
      const salesByCategory: { [key: string]: number } = {};
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          const category = item.product.category;
          salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity);
        });
      });

      // Get top selling products
      const productSales: { [key: string]: number } = {};
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
      });

      const topSellingProducts = products
        .map(product => ({
          ...product,
          totalSold: productSales[product.id] || 0
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: filteredOrders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        averageOrderValue,
        topSellingProducts,
        recentOrders: orders.slice(0, 5),
        salesByCategory
      });

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} دج`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>التقارير والإحصائيات</Title>
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>التقارير والإحصائيات</Title>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">آخر 7 أيام</SelectItem>
            <SelectItem value="30">آخر 30 يوم</SelectItem>
            <SelectItem value="90">آخر 3 أشهر</SelectItem>
            <SelectItem value="365">آخر سنة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">عدد الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">متوسط قيمة الطلب</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.averageOrderValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp size={20} />
              المنتجات الأكثر مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-white font-medium text-sm">{product.name}</p>
                      <p className="text-white/60 text-xs">{product.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{(product as any).totalSold} مبيع</p>
                    <p className="text-white/60 text-xs">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 size={20} />
              المبيعات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.salesByCategory).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white capitalize">{category}</span>
                  <span className="text-primary font-bold">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar size={20} />
            الطلبات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">الطلب #{order.id.slice(-6)}</p>
                  <p className="text-white/60 text-sm">{order.customerInfo.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{formatCurrency(order.total)}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}