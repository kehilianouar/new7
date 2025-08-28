import { Wilaya, Baladiya } from "@/types/store";

export const wilayas: Wilaya[] = [
  { id: "01", name: "أدرار", shippingPrice: 800 },
  { id: "02", name: "الشلف", shippingPrice: 600 },
  { id: "03", name: "الأغواط", shippingPrice: 700 },
  { id: "04", name: "أم البواقي", shippingPrice: 650 },
  { id: "05", name: "باتنة", shippingPrice: 650 },
  { id: "06", name: "بجاية", shippingPrice: 600 },
  { id: "07", name: "بسكرة", shippingPrice: 700 },
  { id: "08", name: "بشار", shippingPrice: 800 },
  { id: "09", name: "البليدة", shippingPrice: 400 },
  { id: "10", name: "البويرة", shippingPrice: 500 },
  { id: "11", name: "تمنراست", shippingPrice: 1000 },
  { id: "12", name: "تبسة", shippingPrice: 750 },
  { id: "13", name: "تلمسان", shippingPrice: 650 },
  { id: "14", name: "تيارت", shippingPrice: 600 },
  { id: "15", name: "تيزي وزو", shippingPrice: 500 },
  { id: "16", name: "الجزائر", shippingPrice: 300 },
  { id: "17", name: "الجلفة", shippingPrice: 700 },
  { id: "18", name: "جيجل", shippingPrice: 650 },
  { id: "19", name: "سطيف", shippingPrice: 600 },
  { id: "20", name: "سعيدة", shippingPrice: 650 },
  { id: "21", name: "سكيكدة", shippingPrice: 650 },
  { id: "22", name: "سيدي بلعباس", shippingPrice: 650 },
  { id: "23", name: "عنابة", shippingPrice: 700 },
  { id: "24", name: "قالمة", shippingPrice: 700 },
  { id: "25", name: "قسنطينة", shippingPrice: 650 },
  { id: "26", name: "المدية", shippingPrice: 500 },
  { id: "27", name: "مستغانم", shippingPrice: 600 },
  { id: "28", name: "المسيلة", shippingPrice: 650 },
  { id: "29", name: "معسكر", shippingPrice: 600 },
  { id: "30", name: "ورقلة", shippingPrice: 800 },
  { id: "31", name: "وهران", shippingPrice: 500 },
  { id: "32", name: "البيض", shippingPrice: 700 },
  { id: "33", name: "إليزي", shippingPrice: 1000 },
  { id: "34", name: "برج بوعريريج", shippingPrice: 600 },
  { id: "35", name: "بومرداس", shippingPrice: 400 },
  { id: "36", name: "الطارف", shippingPrice: 750 },
  { id: "37", name: "تندوف", shippingPrice: 900 },
  { id: "38", name: "تيسمسيلت", shippingPrice: 650 },
  { id: "39", name: "الوادي", shippingPrice: 800 },
  { id: "40", name: "خنشلة", shippingPrice: 700 },
  { id: "41", name: "سوق أهراس", shippingPrice: 750 },
  { id: "42", name: "تيبازة", shippingPrice: 400 },
  { id: "43", name: "ميلة", shippingPrice: 650 },
  { id: "44", name: "عين الدفلى", shippingPrice: 550 },
  { id: "45", name: "النعامة", shippingPrice: 750 },
  { id: "46", name: "عين تموشنت", shippingPrice: 600 },
  { id: "47", name: "غرداية", shippingPrice: 750 },
  { id: "48", name: "غليزان", shippingPrice: 600 },
  { id: "49", name: "تيميمون", shippingPrice: 850 },
  { id: "50", name: "برج باجي مختار", shippingPrice: 900 },
  { id: "51", name: "أولاد جلال", shippingPrice: 750 },
  { id: "52", name: "بني عباس", shippingPrice: 850 },
  { id: "53", name: "عين صالح", shippingPrice: 900 },
  { id: "54", name: "عين قزام", shippingPrice: 950 },
  { id: "55", name: "تقرت", shippingPrice: 800 },
  { id: "56", name: "جانت", shippingPrice: 1000 },
  { id: "57", name: "المقرية", shippingPrice: 800 },
  { id: "58", name: "المنيعة", shippingPrice: 850 }
];

// بيانات وهمية لبعض البلديات (يمكن إضافة المزيد)
export const baladiyat: Baladiya[] = [
  // الجزائر العاصمة
  { id: "1601", name: "الجزائر الوسطى", wilayaId: "16" },
  { id: "1602", name: "سيدي امحمد", wilayaId: "16" },
  { id: "1603", name: "المدنية", wilayaId: "16" },
  { id: "1604", name: "حسين داي", wilayaId: "16" },
  { id: "1605", name: "باب الوادي", wilayaId: "16" },
  { id: "1606", name: "القصبة", wilayaId: "16" },
  { id: "1607", name: "الحراش", wilayaId: "16" },
  { id: "1608", name: "برج الكيفان", wilayaId: "16" },
  { id: "1609", name: "الأبيار", wilayaId: "16" },
  { id: "1610", name: "بئر مراد رايس", wilayaId: "16" },
  
  // وهران
  { id: "3101", name: "وهران", wilayaId: "31" },
  { id: "3102", name: "السانيا", wilayaId: "31" },
  { id: "3103", name: "أرزيو", wilayaId: "31" },
  { id: "3104", name: "بئر الجير", wilayaId: "31" },
  { id: "3105", name: "حاسي بونيف", wilayaId: "31" },
  
  // قسنطينة
  { id: "2501", name: "قسنطينة", wilayaId: "25" },
  { id: "2502", name: "الخروب", wilayaId: "25" },
  { id: "2503", name: "حامة بوزيان", wilayaId: "25" },
  { id: "2504", name: "عين عبيد", wilayaId: "25" },
  
  // عنابة
  { id: "2301", name: "عنابة", wilayaId: "23" },
  { id: "2302", name: "الحجار", wilayaId: "23" },
  { id: "2303", name: "سيدي عمار", wilayaId: "23" },
  { id: "2304", name: "البوني", wilayaId: "23" }
];

export const getBaladiyas = (wilayaId: string): Baladiya[] => {
  return baladiyat.filter(b => b.wilayaId === wilayaId);
};

export const getWilayaById = (id: string): Wilaya | undefined => {
  return wilayas.find(w => w.id === id);
};

export const getBaladiayById = (id: string): Baladiya | undefined => {
  return baladiyat.find(b => b.id === id);
};