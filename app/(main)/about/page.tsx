import { getTranslations } from 'next-intl/server';

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('about');
  
  return (
    <main>
      {/* Your page content */}
    </main>
  );
}
