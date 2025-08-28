"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/title";
import { Banner } from "@/types/store";
import { toast } from "sonner";

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: "",
    description: "",
    image: "",
    link: "",
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const filtered = banners.filter(banner =>
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBanners(filtered);
  }, [banners, searchTerm]);

  const fetchBanners = async () => {
    try {
      // TODO: Implement actual banner fetching from Firebase
      const mockBanners: Banner[] = [
        {
          id: "1",
          title: "عرض خاص على المكملات",
          description: "خصم 20% على جميع المكملات الغذائية",
          image: "/images/banner1.jpg",
          link: "/categories/supplements",
          isActive: true,
          order: 1
        },
        {
          id: "2",
          title: "ملابس رياضية جديدة",
          description: "تشكيلة جديدة من الملابس الرياضية",
          image: "/images/banner2.jpg",
          link: "/categories/clothing",
          isActive: true,
          order: 2
        }
      ];
      setBanners(mockBanners);
      setFilteredBanners(mockBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('خطأ في تحميل البانرات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBanner) {
        // TODO: Implement update banner
        toast.success('تم تحديث البانر بنجاح');
        setEditingBanner(null);
      } else {
        // TODO: Implement add banner
        toast.success('تم إضافة البانر بنجاح');
      }
      
      setFormData({ title: "", description: "", image: "", link: "", isActive: true, order: 0 });
      setShowAddForm(false);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('خطأ في حفظ البانر');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowAddForm(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البانر؟')) return;

    try {
      // TODO: Implement delete banner
      toast.success('تم حذف البانر بنجاح');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('خطأ في حذف البانر');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingBanner(null);
    setFormData({ title: "", description: "", image: "", link: "", isActive: true, order: 0 });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>إدارة البانرات</Title>
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
      <div className="flex justify-between items-center">
        <Title>إدارة البانرات</Title>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-black hover:bg-primary/80"
        >
          <Plus size={20} />
          إضافة بانر جديد
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {editingBanner ? 'تحرير البانر' : 'إضافة بانر جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">عنوان البانر *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل عنوان البانر"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">الرابط</label>
                  <Input
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="رابط البانر (اختياري)"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">وصف البانر</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="أدخل وصف البانر"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">صورة البانر *</label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="رابط الصورة"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">الترتيب</label>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-white text-sm">بانر نشط</span>
              </div>

              {formData.image && (
                <div>
                  <label className="text-white text-sm mb-2 block">معاينة الصورة</label>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary text-black hover:bg-primary/80">
                  {editingBanner ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="البحث في البانرات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            البانرات ({filteredBanners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBanners.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              لا توجد بانرات
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-20 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-white">{banner.title}</h3>
                      <p className="text-sm text-white/60">{banner.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-white/60">الترتيب: {banner.order}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          banner.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {banner.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {banner.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(banner.link, '_blank')}
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
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
