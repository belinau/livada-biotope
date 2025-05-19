import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';

// Dynamically import components with no SSR
const INaturalistFeed = dynamic(
  () => import('@/components/biodiversity/INaturalistFeed'),
  { ssr: false, loading: () => <div>Loading biodiversity data...</div> }
);

const BiodiversityMap = dynamic(
  () => import('@/components/biodiversity/BiodiversityMap'),
  { ssr: false, loading: () => <div>Loading map...</div> }
);

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  return {
    title: 'Biodiversity',
    description: 'Explore the biodiversity of our biotope',
    // Add other metadata as needed
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BiodiversityPage({ params: { locale } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('biodiversity');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('map.title')}</h2>
        <div className="h-96 rounded-lg overflow-hidden bg-gray-100">
          <BiodiversityMap />
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('recentObservations')}</h2>
        <INaturalistFeed />
      </section>
    </div>
  );
}
