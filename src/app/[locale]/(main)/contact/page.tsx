import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';
import { ContactForm } from '@/components/contact/ContactForm';

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  return {
    title: 'Contact Us',
    description: 'Get in touch with our team',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params: { locale } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('contact');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600">{t('subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('contactInfo.title')}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{t('contactInfo.address.title')}</h3>
              <address className="not-italic text-gray-700">
                {t('contactInfo.address.line1')}<br />
                {t('contactInfo.address.line2')}<br />
                {t('contactInfo.address.city')}
              </address>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t('contactInfo.email')}</h3>
              <a 
                href="mailto:info@example.com" 
                className="text-primary-600 hover:underline"
              >
                info@example.com
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t('contactInfo.phone')}</h3>
              <a 
                href="tel:+1234567890" 
                className="text-primary-600 hover:underline"
              >
                +1 (234) 567-890
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t('contactInfo.hours.title')}</h3>
              <div className="space-y-1">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-700">{t(`contactInfo.hours.days.${day}`)}:</span>
                    <span className="text-gray-900 font-medium">
                      {t(`contactInfo.hours.hours.${day}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('sendMessage')}</h2>
          <ContactForm />
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">{t('findUsOnMap')}</h2>
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
          {/* Replace with your map component */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Map will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
