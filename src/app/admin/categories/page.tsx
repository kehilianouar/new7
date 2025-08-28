"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/title";
import { Category } from "@/types/store";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/firebase/storeActions";
import { toast } from "sonner";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: "",
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('خطأ في تحميل الفئات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const success = await updateCategory(editingCategory.id, formData as Category);
        if (success) {
          toast.success('تم تحديث الفئة بنجاح');
          setEditingCategory(null);
        } else {
          toast.error('فشل في تحديث الفئة');
        }
      } else {
        const categoryId = await createCategory(formData as Omit<Category, 'id'>);
        if (categoryId) {
          toast.success('تم إضافة الفئة بنجاح');
        } else {
          toast.error('فشل في إضافة الفئة');
        }
      }
      
      setFormData({ name: "", description: "", image: "", isActive: true });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('خطأ في حفظ الفئة');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const success = await deleteCategory(categoryId);
      if (success) {
        toast.success('تم حذف الفئة بنجاح');
        fetchCategories();
      } else {
        toast.error('فشل في حذف الفئة');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('خطأ في حذف الفئة');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "", isActive: true });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>إدارة الفئات</Title>
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
        <Title>إدارة الفئات</Title>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-black hover:bg-primary/80"
        >
          <Plus size={20} />
          إضافة فئة جديدة
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {editingCategory ? 'تحرير الفئة' : 'إضافة فئة جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">اسم الفئة *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل اسم الفئة"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">صورة الفئة</label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="رابط الصورة"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">وصف الفئة</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="أدخل وصف الفئة"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-white text-sm">فئة نشطة</span>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary text-black hover:bg-primary/80">
                  {editingCategory ? 'تحديث' : 'إضافة'}
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
            placeholder="البحث في الفئات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card className="bg-[#ffffff1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            الفئات ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              لا توجد فئات
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-sm text-white/60">{category.description}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        category.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {category.isActive ? 'نشطة' : 'غير نشطة'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
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
