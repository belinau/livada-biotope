import { Metadata } from 'next';
import { getHomePageData } from '@/lib/api/home';
import HomePage from '@/components/pages/HomePage';

export const revalidate = 3600; // Revalidate at most every hour

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();
  
  return {
    title: {
      default: data.title_en,
      template: `%s | ${data.title_en}`,
    },
    description: data.summary_en,
    openGraph: {
      title: data.title_en,
      description: data.summary_en,
      type: 'website',
      locale: 'en_US',
      siteName: 'Livada Biotope',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title_en,
      description: data.summary_en,
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function Home() {
  const data = await getHomePageData();
  
  return <HomePage data={data} />;
}
