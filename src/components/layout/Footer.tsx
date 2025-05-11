import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Footer = () => {
  const t = useTranslations('Footer');
  const router = useRouter();
  const isSlLanguage = router.locale === 'sl';

  return (
    <footer className="bg-livada-dark text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isSlLanguage ? 'Biotop Livada' : 'The Livada Biotope'}
            </h3>
            <p className="text-sm text-gray-300">
              {t('description')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-300 hover:text-white">{t('home')}</a></Link></li>
              <li><Link href="/biodiversity"><a className="text-gray-300 hover:text-white">{t('biodiversity')}</a></Link></li>
              <li><Link href="/projects"><a className="text-gray-300 hover:text-white">{t('projects')}</a></Link></li>
              <li><Link href="/instructables"><a className="text-gray-300 hover:text-white">{t('instructables')}</a></Link></li>
              <li><Link href="/ecofeminism"><a className="text-gray-300 hover:text-white">{t('ecofeminism')}</a></Link></li>
              <li><Link href="/events"><a className="text-gray-300 hover:text-white">{t('events')}</a></Link></li>
              <li><Link href="/about"><a className="text-gray-300 hover:text-white">{t('about')}</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-2">
              <li>{isSlLanguage ? 'Zavod BOB' : 'BOB Institute'}</li>
              <li>Robbova 15</li>
              <li>1000 Ljubljana, Slovenia</li>
              <li><a href="mailto:info@biotop-livada.si" className="text-gray-300 hover:text-white">info@biotop-livada.si</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
            <div className="flex space-x-4">
              {/* iNaturalist */}
              <a href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="iNaturalist">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.32 5.36c-.3-.9-2.4-.9-2.7 0-.16.53-.1 1.06-.03 1.57.1.76.3 1.5.68 2.17.34.68.68 1.35.97 2.03.27.7.47 1.44.5 2.2.03.75-.12 1.5-.39 2.2-.3.7-.66 1.36-1.02 2.02-.35.64-.72 1.28-1 1.96-.32.8-.52 1.64-.52 2.5h4.54c0-.87-.2-1.7-.53-2.5-.3-.68-.67-1.32-1.02-1.97-.36-.65-.72-1.32-1.02-2.02-.28-.7-.4-1.44-.38-2.2.03-.76.22-1.5.5-2.2.3-.68.63-1.34.97-2.02.37-.66.57-1.4.68-2.17.08-.5.13-1.04-.03-1.57z" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </a>
              
              {/* Bluesky */}
              <a href="https://bsky.app/profile/livada-bio.bsky.social" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Bluesky">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17z"/>
                  <path d="M17.25 12a.75.75 0 0 1-.75.75h-3.75v3.75a.75.75 0 0 1-1.5 0v-3.75H7.5a.75.75 0 0 1 0-1.5h3.75V7.5a.75.75 0 0 1 1.5 0v3.75h3.75a.75.75 0 0 1 .75.75z"/>
                </svg>
              </a>
              
              {/* Discord */}
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Discord">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} {isSlLanguage ? 'Biotop Livada' : 'The Livada Biotope'}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
