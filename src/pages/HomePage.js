import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parse } from 'yaml';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import BiodiversityHero from '../components/BiodiversityHero';
import PracticesHero from '../components/PracticesHero';
import JoinHero from '../components/JoinHero';
import ScatterText from '../components/ui/scramble-text';
import LiveSensorReadings from '../components/LiveSensorReadings';

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
                    ? `### Dobrodošli na livada.bio\n\nTo je prostor za urejanje vsebine. Uredite datoteko 
/content/pages/home.sl.md.`
                    : `### Welcome to livada.bio\n\nThis is a placeholder. Edit the file 
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
            {/* Main Hero Section - Biodiversity */}
            <div className="w-full">
                <BiodiversityHero 
                    language={language} 
                    heroTitle={heroTitle}
                    heroSubtitle={heroSubtitle}
                />
            </div>
            
            {/* Practices Hero Section */}
            <div className="w-full">
                <PracticesHero language={language} />
            </div>
            
            {/* Live Sensor Readings Section */}
            <div className="w-full">
                <LiveSensorReadings />
            </div>

            {/* Main Content */}
            <div className="bg-[var(--glass-bg)] backdrop-blur-sm rounded-t-3xl shadow-2xl pt-20 pb-16 border-t border-[var(--glass-border)]">
                 <div className="container mx-auto px-6 py-12">
                     {isLoading ? ( <div className="text-center text-body-lg max-w-4xl mx-auto text-text-muted">{t('loading')}...</div> ) 
                               : ( 
                                 <div className="max-w-4xl mx-auto px-8 py-10">
                                   <ScatterText 
                                     content={pageData.content || ''} 
                                     className="text-text-main"
                                   />
                                 </div>
                               )}
                </div> 
            </div>
            
            {/* Join Hero Section */}
            <div className="w-full">
                <JoinHero language={language} />
            </div>
        </Page>
    );
}

export default HomePage;