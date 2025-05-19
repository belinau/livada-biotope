import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  return {
    title: 'About Us',
    description: 'Learn more about our initiative and mission',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params: { locale } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('about');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">{t('description')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('ourMission.title')}</h2>
        <p className="mb-6">{t('ourMission.description')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('ourValues.title')}</h2>
        <ul className="space-y-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>{t(`ourValues.values.${i}`)}</span>
            </li>
          ))}
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('team.title')}</h2>
        <p className="mb-6">{t('team.description')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <h3 className="text-xl font-semibold">{t(`team.members.${i}.name`)}</h3>
              <p className="text-gray-600 mb-2">{t(`team.members.${i}.role`)}</p>
              <p className="text-sm text-gray-700">{t(`team.members.${i}.bio`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
