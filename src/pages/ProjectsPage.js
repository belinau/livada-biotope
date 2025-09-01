import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parse } from 'yaml';
import pLimit from 'p-limit';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import RecentSensorChart from '../components/RecentSensorChart';
import HistoricalSensorVisualization from '../components/HistoricalSensorVisualization';
import JoinHero from '../components/JoinHero';

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

function ProjectsPage() {
    const { t, language } = useTranslation();
    const [pageData, setPageData] = useState({ title: '', content: '' });

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchContent = async () => {
          const langFile = `/content/pages/intertwinings.${language}.md?v=${new Date().getTime()}`;
          const defaultLangFile = `/content/pages/intertwinings.sl.md?v=${new Date().getTime()}`;
          
          try {
              let response = await limit(() => fetch(langFile, { signal }));
              if (!response.ok) { response = await limit(() => fetch(defaultLangFile, { signal })); }
              if (!response.ok) { throw new Error('Intertwinings content file not found'); }
              const text = await response.text();
              const { metadata, content } = parseMarkdown(text);
              setPageData({ title: metadata.title || t('navProjects'), content: content });
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error("Failed to fetch page content, using fallback:", error);
              setPageData({ title: t('navProjects'), content: t('projectFutureDesc') });
            }
          }
      };

      fetchContent();

      return () => {
        controller.abort();
      };
    }, [t, language]);

    return (
        <Page title={pageData.title}> 
            <Section title={pageData.title}> 
                <div 
                    className="prose max-w-3xl mx-auto text-text-main mb-8
                               [&_h2]:text-2xl [&_h2]:font-mono [&_h2]:text-primary 
                               prose-li:[&_li::before]:bg-primary"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(pageData.content || '')) }} 
                />
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="relative p-4 sm:p-6 rounded-2xl shadow-2xl overflow-hidden border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm">
                        <RecentSensorChart />
                    </div>
                    <div className="relative p-4 sm:p-6 rounded-2xl shadow-2xl overflow-hidden border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm">
                        <HistoricalSensorVisualization />
                    </div>
                </div>
            </Section>
            <div className="w-full mt-8">
                <JoinHero language={language} />
            </div>
        </Page>
    );
}

export default ProjectsPage;
