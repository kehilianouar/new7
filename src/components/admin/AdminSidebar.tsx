"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  Tags,
  Image as ImageIcon
} from "lucide-react";

const sidebarItems = [
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "المنتجات",
    href: "/admin/products",
    icon: Package
  },
  {
    title: "الطلبات",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    title: "العملاء",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "إدارة الصلاحيات",
    href: "/admin/manage-users",
    icon: Users
  },
  {
    title: "الفئات",
    href: "/admin/categories",
    icon: Tags
  },
  {
    title: "البانرات",
    href: "/admin/banners",
    icon: ImageIcon
  },
  {
    title: "التقارير",
    href: "/admin/reports",
    icon: BarChart3
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-[#ffffff1a] border-l border-white/10 backdrop-blur-xl z-40">
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-6">لوحة التحكم</h2>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-black font-medium"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}