import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parse } from 'yaml';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import PracticesHero from '../components/PracticesHero';
import JoinHero from '../components/JoinHero';
import LiveSensorReadings from '../components/LiveSensorReadings';
import HomeHero from '../components/HomeHero';
import { GlassSection } from '../components/ui/GlassSection';

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

    return (
        <Page title={title}> 
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
                        <GlassSection variant="card-gradient" className="max-w-4xl mx-auto">
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
                    <PracticesHero language={language} />
                </div>
                
                {/* Live Sensor Readings Section */}
                <div className="w-full mb-16 portal-container">
                    <div className="container mx-auto px-4 py-4 w-full">
                        <div className="w-full max-w-6xl">
                            <LiveSensorReadings />
                        </div>
                    </div>
                </div>
                
                {/* Join Hero Section */}
                <JoinHero language={language} />
            </div>
        </Page>
    );
}

export default HomePage;