import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parse } from 'yaml';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import PracticesHero from '../components/PracticesHero';
import JoinHero from '../components/JoinHero';
import LiveSensorReadings from '../components/LiveSensorReadings';
import HomeHero from '../components/HomeHero';
import OdonataSprite from '../components/OdonataSprite';
import { GlassSection } from '../components/ui/GlassSection';
import MetaTags from '../components/MetaTags';
import { GlassCard } from '../components/ui/GlassCard';

const limit = pLimit(2);

const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = parse(match[1]) || {};
        const content = rawContent.slice(match[0].length);
        return { metadata, content };
    } catch (e) {
        console.error("Error parsing markdown frontmatter:", e);
        return { metadata: {}, content: rawContent };
    }
};

function HomePage() {
    const { t, language } = useTranslation();
    const [pageData, setPageData] = useState({ content: '', metadata: {} });
    const [isLoading, setIsLoading] = useState(true);

    const wrapperRef = useRef(null);

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchContent = async () => {
          setIsLoading(true);
          const langFile = `/content/pages/home.${language}.md?v=${new Date().getTime()}`;
          const defaultLangFile = `/content/pages/home.sl.md?v=${new Date().getTime()}`;
          
          try {
              let response = await limit(() => fetch(langFile, { signal }));
              if (!response.ok) { response = await limit(() => fetch(defaultLangFile, { signal })); }
              if (!response.ok) { throw new Error('Home page content file not found at ' + langFile + ' or ' + defaultLangFile); }
              const text = await response.text();
              const { metadata, content } = parseMarkdown(text);
              setPageData({ content, metadata });
          } catch (error) {
              if (error.name !== 'AbortError') {
                console.error("Failed to fetch home page content:", error);
                const defaultContent = language === 'sl' 
                    ? `### Dobrodošli na livada.bio

To je prostor za urejanje vsebine. Uredite datoteko 
/content/pages/home.sl.md.`
                    : `### Welcome to livada.bio

This is a placeholder. Edit the file 
/content/pages/home.en.md to change this content.`;
                setPageData({ content: defaultContent, metadata: {} });
              }
          } finally {
              setIsLoading(false);
          }
      };

      fetchContent();

      return () => {
        controller.abort();
      };
    }, [language]);

    const title = pageData.metadata.title || t('navHome');
    const heroTitle = pageData.metadata.hero_title || 'livada.bio';
    const heroSubtitle = pageData.metadata.hero_subtitle || (language === 'sl' ? 'Gojenje sorodstev v več kot človeškem svetu' : 'Fostering kinship in a more than human world');
    const pageDescription = pageData.metadata.description || heroSubtitle;
    const pageImage = pageData.metadata.image ? `${window.location.origin}${pageData.metadata.image}` : null;

    const perchPoint = { x: 0, y: -50 };

    const homeFlightPath = {
        y: [-0.1, -0.5, -1.0, -0.8, -1.2, -0.6, -0.9, -0.2, -0.1],
        x: [0.05, 0.4, 0.8, 0.8, 0.8, 0.4, 0.05, 0.05, 0.05]
    };

    return (
        <Page title={title}> 
            <MetaTags
                title={title}
                description={pageDescription}
                imageUrl={pageImage}
            />
            <div className="pt-4 md:pt-8 lg:pt-12">
                {/* Home Hero Section */}
                <div className="w-full mb-16">
                    <HomeHero 
                      title={heroTitle} 
                      subtitle={heroSubtitle} 
                      language={language} 
                    />
                </div>
                {/* Main Content */}
                <div className="py-12">
                    <div className="container mx-auto px-4">
                        <GlassSection ref={wrapperRef} variant="card-gradient" className="max-w-4xl mx-auto relative">
                            {/* Odonata Sprite in corner */}
                            <div className="absolute top-0 left-0 z-10">
                                <OdonataSprite 
                                    scope="wrapper" 
                                    wrapperRef={wrapperRef} 
                                    perchPoint={perchPoint} 
                                    flightPath={homeFlightPath}
                                />
                            </div>
                            <div className="px-6 py-12">
                                {isLoading ? (
                                    <div className="text-center text-body-lg text-text-muted">
                                        {t('loading')}...
                                    </div>
                                ) : (
                                    <div className="text-text-main text-center prose prose-lg max-w-none">
                                        {pageData.content || ''}
                                    </div>
                                )}
                            </div>
                        </GlassSection>
                    </div>
                </div>
                {/* Practices Hero Section */}
                <div className="w-full mb-16">
                    <div className="container mx-auto px-4">
                        <PracticesHero language={language} />
                    </div>
                </div>
                
                {/* Live Sensor Readings Section */}
                <div className="w-full mb-16">
                    <div className="container mx-auto px-4">
                        <GlassCard className="p-6 rounded-2xl">
                            <LiveSensorReadings />
                        </GlassCard>
                    </div>
                </div>
                
                {/* Join Hero Section */}
                <div className="w-full mb-16">
                    <div className="container mx-auto px-4">
                        <JoinHero language={language} />
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default HomePage;