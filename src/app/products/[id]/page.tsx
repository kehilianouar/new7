import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/firebase/storeActions";
import ProductDetails from "@/components/store/ProductDetails";
import Footer from "@/components/shared/footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: "المنتج غير موجود - GYM DADA STORE"
    };
  }

  return {
    title: `${product.name} - GYM DADA STORE`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16 md:pt-24">
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}