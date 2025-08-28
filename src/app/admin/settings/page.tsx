"use client";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/title";
import { toast } from "sonner";

interface WilayaShipping {
  id: string;
  name: string;
  deskPrice: number;
  homePrice: number;
}

interface CityData {
  id: string;
  name: string;
  commune: string;
  daira: string;
  wilaya_code: string;
  wilaya_name: string;
}

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  shippingSettings: {
    freeShippingThreshold: number;
    defaultDeskPrice: number;
    defaultHomePrice: number;
  };
  paymentMethods: string[];
  excludedWilayas: string[];
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wilayas, setWilayas] = useState<WilayaShipping[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "GymDada",
    storeDescription: "متجر المكملات الغذائية والملابس الرياضية",
    contactInfo: {
      phone: "+213123456789",
      email: "info@gymdada.com",
      address: "الجزائر العاصمة",
    },
    shippingSettings: {
      freeShippingThreshold: 10000,
      defaultDeskPrice: 500,
      defaultHomePrice: 800,
    },
    paymentMethods: ["cod"],
    excludedWilayas: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const citiesData = await import("@/data/algerian-cities.json");
      const allCities = citiesData.default || citiesData;

      const uniqueWilayas = Array.from(
        new Map(
          allCities.map((city: any) => [
            city.wilaya_code,
            {
              id: city.wilaya_code,
              name: city.wilaya_name,
              deskPrice: storeSettings.shippingSettings.defaultDeskPrice,
              homePrice: storeSettings.shippingSettings.defaultHomePrice,
            },
          ])
        ).values()
      ).sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Sort by wilaya code
      setWilayas(uniqueWilayas);

      const formattedCities: CityData[] = allCities.map((city: any) => ({
        id: city.id.toString(),
        name: city.commune_name,
        commune: city.commune_name,
        daira: city.daira_name,
        wilaya_code: city.wilaya_code,
        wilaya_name: city.wilaya_name,
      }));

      setCities(formattedCities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطأ في تحميل البيانات");
      setLoading(false);
    }
  };

  const handleWilayaPriceChange = (
    id: string,
    field: "deskPrice" | "homePrice",
    price: number
  ) => {
    setWilayas((prev) =>
      prev.map((wilaya) =>
        wilaya.id === id ? { ...wilaya, [field]: price } : wilaya
      )
    );
  };

  const handleStoreSettingsChange = (field: string, value: any) => {
    setStoreSettings((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentObj = prev[parent as keyof StoreSettings];
        if (typeof parentObj === "object" && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value,
            },
          };
        }
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      console.log("Saving settings:", { storeSettings, wilayas });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("خطأ في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Title>إعدادات المتجر</Title>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title>إعدادات المتجر</Title>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">معلومات المتجر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">
                  اسم المتجر *
                </label>
                <Input
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    handleStoreSettingsChange("storeName", e.target.value)
                  }
                  required
                  placeholder="اسم المتجر"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">
                  وصف المتجر
                </label>
                <Input
                  value={storeSettings.storeDescription}
                  onChange={(e) =>
                    handleStoreSettingsChange("storeDescription", e.target.value)
                  }
                  placeholder="وصف المتجر"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">
                  رقم الهاتف *
                </label>
                <Input
                  value={storeSettings.contactInfo.phone}
                  onChange={(e) =>
                    handleStoreSettingsChange("contactInfo.phone", e.target.value)
                  }
                  required
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">
                  البريد الإلكتروني *
                </label>
                <Input
                  type="email"
                  value={storeSettings.contactInfo.email}
                  onChange={(e) =>
                    handleStoreSettingsChange("contactInfo.email", e.target.value)
                  }
                  required
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">
                  العنوان *
                </label>
                <Input
                  value={storeSettings.contactInfo.address}
                  onChange={(e) =>
                    handleStoreSettingsChange("contactInfo.address", e.target.value)
                  }
                  required
                  placeholder="العنوان"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">إعدادات الشحن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">
                  حد الشحن المجاني (دج)
                </label>
                <Input
                  type="number"
                  value={storeSettings.shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    handleStoreSettingsChange(
                      "shippingSettings.freeShippingThreshold",
                      Number(e.target.value)
                    )
                  }
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">
                  سعر الشحن الافتراضي للمكتب (دج)
                </label>
                <Input
                  type="number"
                  value={storeSettings.shippingSettings.defaultDeskPrice}
                  onChange={(e) =>
                    handleStoreSettingsChange(
                      "shippingSettings.defaultDeskPrice",
                      Number(e.target.value)
                    )
                  }
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">
                  سعر الشحن الافتراضي للمنزل (دج)
                </label>
                <Input
                  type="number"
                  value={storeSettings.shippingSettings.defaultHomePrice}
                  onChange={(e) =>
                    handleStoreSettingsChange(
                      "shippingSettings.defaultHomePrice",
                      Number(e.target.value)
                    )
                  }
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              أسعار الشحن حسب الولاية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wilayas.map((wilaya) => (
                <div
                  key={wilaya.id}
                  className="space-y-2 p-3 bg-white/5 rounded"
                >
                  <span className="text-white text-sm font-semibold">
                    {wilaya.name} ({wilaya.id})
                  </span>
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-xs">
                      سعر المكتب:
                    </label>
                    <Input
                      type="number"
                      value={wilaya.deskPrice}
                      onChange={(e) =>
                        handleWilayaPriceChange(
                          wilaya.id,
                          "deskPrice",
                          Number(e.target.value)
                        )
                      }
                      className="w-20"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-xs">
                      سعر المنزل:
                    </label>
                    <Input
                      type="number"
                      value={wilaya.homePrice}
                      onChange={(e) =>
                        handleWilayaPriceChange(
                          wilaya.id,
                          "homePrice",
                          Number(e.target.value)
                        )
                      }
                      className="w-20"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              الولايات غير المتاحة للشحن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                حدد الولايات التي لا تتوفر فيها خدمة الشحن:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {wilayas.map((wilaya) => (
                  <label
                    key={wilaya.id}
                    className="flex items-center space-x-2 p-2 bg-white/5 rounded hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={storeSettings.excludedWilayas.includes(wilaya.id)}
                      onChange={(e) => {
                        const updatedWilayas = e.target.checked
                          ? [...storeSettings.excludedWilayas, wilaya.id]
                          : storeSettings.excludedWilayas.filter(
                              (id) => id !== wilaya.id
                            );
                        handleStoreSettingsChange("excludedWilayas", updatedWilayas);
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-white text-sm">
                      {wilaya.name} ({wilaya.id})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">طرق الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={storeSettings.paymentMethods.includes("cod")}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...storeSettings.paymentMethods, "cod"]
                      : storeSettings.paymentMethods.filter((m) => m !== "cod");
                    handleStoreSettingsChange("paymentMethods", methods);
                  }}
                  className="mr-2"
                />
                <span className="text-white text-sm">الدفع عند الاستلام</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={saving}
          className="bg-primary text-black hover:bg-primary/80"
        >
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          {!saving && <Save size={16} className="mr-2" />}
        </Button>
      </form>
    </div>
  );
}