import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  return {
    title: 'Projects',
    description: 'Our ongoing and past projects',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage({ params: { locale } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('projects');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project cards will be mapped here */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{t('project1.title')}</h2>
          <p className="text-gray-600">{t('project1.description')}</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{t('project2.title')}</h2>
          <p className="text-gray-600">{t('project2.description')}</p>
        </div>
      </div>
    </div>
  );
}
