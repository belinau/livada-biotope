import dynamic from 'next/dynamic';
import { LocaleValidator } from '@/components/LocaleValidator';

// Dynamically import the HomeContent component with no SSR
const HomeContent = dynamic(() => import('./home-content'), { 
  ssr: false,
  loading: () => <div>Loading...</div> 
});

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <LocaleValidator locale={locale}>
      <HomeContent />
    </LocaleValidator>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sl' }];
}

export const dynamicParams = false;
