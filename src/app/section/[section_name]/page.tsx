// Next
import Head from "next/head";
import { notFound } from "next/navigation";

// UI Components
import SectionList from "@/components/shared/sectionList";
import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";

const validTypes = [
  "kr_movies", "popular_movies", "arabic_movies", "turkish_movies", "anime_movies",
  "kr_series", "popular_series", "arabic_series", "turkish_series", "anime_series",
  "latest"
];

const sectionTitles: Record<string, string> = {
  latest: "الأحدث",
  popular_movies: "الأفلام الرائجة",
  arabic_movies: "أفلام عربية",
  turkish_movies: "أفلام تركية",
  anime_movies: "أفلام أنمي",
  kr_movies: "أفلام كورية",
  popular_series: "المسلسلات الرائجة",
  arabic_series: "مسلسلات عربية",
  turkish_series: "مسلسلات تركية",
  anime_series: "مسلسلات أنمي",
  kr_series: "مسلسلات كورية"
};

export default async function SectionPage({ params }: { params: Promise<{ section_name: string }> }) {
  const { section_name } = await params;

  if (!validTypes.includes(section_name)) return notFound();

  return (
    <>
      <Head>
        <title>{`GYM DADA STORE | ${sectionTitles[section_name]}`}</title>
        <meta
          name="description"
          content={`استعرض ${sectionTitles[section_name]} في متجر GYM DADA STORE، أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر.`}
        />
        <meta
          name="keywords"
          content={`GYM DADA STORE, ${sectionTitles[section_name]}, متجر المكملات الرياضية, مكملات غذائية الجزائر, بروتين الجزائر, كرياتين الجزائر, ملابس رياضية الجزائر, متجر رياضي, مكملات كمال الأجسام, واي بروتين, كرياتين مونوهيدرات, تيشيرت رياضي, شورت رياضي`}
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={`GYM DADA STORE | ${sectionTitles[section_name]}`} />
        <meta
          property="og:description"
          content={`استعرض ${sectionTitles[section_name]} في متجر GYM DADA STORE، أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر.`}
        />
        <meta property="og:image" content="https://gym-dada-store.vercel.app/images/gym-logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_AR" />
        <meta property="og:site_name" content="GYM DADA STORE" />
        <meta property="og:url" content="https://gym-dada-store.vercel.app" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`GYM DADA STORE | ${sectionTitles[section_name]}`} />
        <meta
          name="twitter:description"
          content={`استعرض ${sectionTitles[section_name]} في متجر GYM DADA STORE، أفضل متجر للمكملات الغذائية والملابس الرياضية في الجزائر.`}
        />
        <meta name="twitter:image" content="https://gym-dada-store.vercel.app/images/gym-logo.png" />
        <meta name="twitter:creator" content="@maahmoudragab" />
      </Head>

        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pt-16 md:pt-24 mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
            <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Title className="mb-4">{sectionTitles[section_name]}</Title>
              <SectionList section={section_name} />
            </div>
          </main>
          <Footer />
        </div>
    </>
  );
}
