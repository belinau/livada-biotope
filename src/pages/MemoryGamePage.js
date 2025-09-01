import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import { GlassCard } from '../components/ui/GlassCard';
import MemoryGame from '../components/MemoryGame';

function MemoryGamePage() {
    const { t } = useTranslation();
    return (
      <Page title={t('navMemoryGame')}> 
        <Section> 
          <GlassCard className="max-w-3xl mx-auto">
            <MemoryGame />
          </GlassCard>
          <p className="text-center text-text-muted mt-8 max-w-2xl mx-auto">{t('memoryGameDescription')}</p>
        </Section>
      </Page>
    );
  }

export default MemoryGamePage;
