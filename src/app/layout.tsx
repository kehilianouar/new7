// Next Types & Fonts
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";

// Global Styles
import "./globals.css";
import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";
import { CartProvider } from "@/contexts/CartContext";


const alexandria = Alexandria({
  variable: "--font-geist-alexandria",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "GYM DADA STORE - متجر المكملات الرياضية",

  description: "متجر GYM DADA STORE - أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر. منتجات أصلية، توصيل مجاني، دفع عند الاستلام.",

  keywords: [
    // GYM DADA STORE
    "GYM DADA STORE",
    "متجر المكملات الرياضية",
    "مكملات غذائية الجزائر",
    "بروتين الجزائر",
    "كرياتين الجزائر",
    "ملابس رياضية الجزائر",
    "متجر رياضي",
    "مكملات كمال الأجسام",
    "واي بروتين",
    "كرياتين مونوهيدرات",
    "تيشيرت رياضي",
    "شورت رياضي",
    "توصيل مجاني",
    "دفع عند الاستلام",
    "منتجات أصلية",
    "متجر إلكتروني الجزائر",
    "تسوق رياضي",
    "مكملات طبيعية",
    "لياقة بدنية",
    "كمال أجسام",
    "رياضة الجزائر"
  ],

  creator: "Mahmoud Ragab",
  publisher: "Mahmoud Ragab",

  metadataBase: new URL("https://gym-dada-store.vercel.app"),

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: "GYM DADA STORE",
  openGraph: {
    title: "GYM DADA STORE - متجر المكملات الرياضية",
    description: "متجر GYM DADA STORE - أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر. منتجات أصلية، توصيل مجاني، دفع عند الاستلام.",
    url: "https://gym-dada-store.vercel.app",
    siteName: "GYM DADA STORE",
    images: [
      {
        url: "/images/gym-logo.png",
        width: 780,
        height: 780,
        alt: "GYM DADA STORE - متجر المكملات الرياضية"
      }
    ],
    locale: "ar_AR",
    type: "website",
  },

  icons: {
    icon: "/images/gym-logo.png"
  },

  twitter: {
    card: "summary_large_image",
    title: "GYM DADA STORE - متجر المكملات الرياضية",
    description: "متجر GYM DADA STORE - أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر. منتجات أصلية، توصيل مجاني، دفع عند الاستلام.",
    images: ["https://gym-dada-store.vercel.app/images/gym-logo.png"],
    creator: "@maahmoudragab",
  },

  verification: {
    google: "IpDXTz417F3ZazMOu8KkliIfuwbw3wIFmNmPTG3LfI4",
  },

  other: {
    "google-site-verification": "HJcQ06N13ZmafDcTz4ph34ghIvb37tCX9mqz9-zUcEk"
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" >
      <body className={`${alexandria.className} antialiased overflow-x-hidden`}>
        <CartProvider>
          <ScrollSmoothWrapper>
            {children}
          </ScrollSmoothWrapper>
        </CartProvider>
      </body>
    </html>
  );
}