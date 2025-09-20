import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import MemoryGame from '../components/MemoryGame';
import MetaTags from '../components/MetaTags';

function MemoryGamePage() {
    const { t } = useTranslation();
    const pageTitle = t('navMemoryGame');
    const pageDescription = t('memoryGameDescription');

    return (
      <Page title={pageTitle}> 
        <MetaTags
            title={pageTitle}
            description={pageDescription}
        />
        <div className="container mx-auto px-4 pt-8 md:pt-12 pb-8">
          <div className="relative z-10">
            <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
              <div className="w-full">
                <MemoryGame />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <a 
                  href="/lestvica" 
                  className="px-4 py-2 bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] text-[var(--primary)] font-bold rounded-lg border border-[var(--glass-border)] shadow-sm backdrop-blur-sm hover:from-[var(--glass-bg-nav)] hover:to-[var(--glass-i-bg)] transition-all duration-300 text-center"
                >
                  {t('hallOfFame')}
                </a>
              </div>
              <p className="text-center text-text-muted mt-8 max-w-2xl mx-auto">{t('memoryGameDescription')}</p>
            </GlassSection>
          </div>
        </div>
      </Page>
    );
  }

export default MemoryGamePage;
