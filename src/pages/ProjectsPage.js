import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parse } from 'yaml';
import pLimit from 'p-limit';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import LiveSensorReadings from '../components/LiveSensorReadings';
import HistoricalSensorVisualization from '../components/HistoricalSensorVisualization';
import JoinHero from '../components/JoinHero';
import Hero from '../components/Hero';

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
    const [projects, setProjects] = useState([]);
    const [pageData, setPageData] = useState({ title: '', content: '', metadata: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [useProjectsContent, setUseProjectsContent] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProjects = async () => {
            try {
                // First try to fetch the projects manifest
                const manifestResponse = await limit(() => fetch('/content/projects/manifest.json', { signal }));
                if (!manifestResponse.ok) throw new Error('Projects manifest not found');
                
                const manifest = await manifestResponse.json();
                const langSuffix = `.${language}.md`;
                const defaultLangSuffix = '.sl.md';
                
                // Get unique base names
                const baseNames = [...new Set(manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, '')))];
                
                // Fetch all projects
                const fetchedProjects = await Promise.all(
                    baseNames.map(async (baseName) => {
                        const langFile = `${baseName}${langSuffix}`;
                        const defaultFile = `${baseName}${defaultLangSuffix}`;
                        
                        let file = langFile;
                        let response = await limit(() => fetch(`/content/projects/${file}`, { signal }));
                        
                        if (!response.ok) {
                            file = defaultFile;
                            response = await limit(() => fetch(`/content/projects/${file}`, { signal }));
                        }
                        
                        if (response.ok) {
                            const text = await response.text();
                            const { metadata, content } = parseMarkdown(text);
                            return { 
                                id: baseName, 
                                metadata, 
                                content,
                                title: metadata.title || baseName
                            };
                        }
                        return null;
                    })
                );
                
                const validProjects = fetchedProjects.filter(Boolean);
                setProjects(validProjects);
                setUseProjectsContent(validProjects.length > 0);
                
                // If there are no projects, fall back to the original content
                if (validProjects.length === 0) {
                    // Fetch the original content
                    const langFile = `/content/pages/intertwinings.${language}.md?v=${new Date().getTime()}`;
                    const defaultLangFile = `/content/pages/intertwinings.sl.md?v=${new Date().getTime()}`;
                    
                    let response = await limit(() => fetch(langFile, { signal }));
                    if (!response.ok) { response = await limit(() => fetch(defaultLangFile, { signal })); }
                    if (response.ok) {
                        const text = await response.text();
                        const { metadata, content } = parseMarkdown(text);
                        setPageData({ title: metadata.title || t('navProjects'), content: content, metadata: metadata });
                    } else {
                        setPageData({ title: t('navProjects'), content: t('projectFutureDesc'), metadata: {} });
                    }
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Failed to fetch projects, using fallback:", error);
                    setProjects([]);
                    setUseProjectsContent(false);
                    
                    // Fetch the original content as fallback
                    const langFile = `/content/pages/intertwinings.${language}.md?v=${new Date().getTime()}`;
                    const defaultLangFile = `/content/pages/intertwinings.sl.md?v=${new Date().getTime()}`;
                    
                    try {
                        let response = await limit(() => fetch(langFile, { signal }));
                        if (!response.ok) { response = await limit(() => fetch(defaultLangFile, { signal })); }
                        if (response.ok) {
                            const text = await response.text();
                            const { metadata, content } = parseMarkdown(text);
                            setPageData({ title: metadata.title || t('navProjects'), content: content, metadata: metadata });
                        } else {
                            setPageData({ title: t('navProjects'), content: t('projectFutureDesc'), metadata: {} });
                        }
                    } catch (fallbackError) {
                        if (fallbackError.name !== 'AbortError') {
                            console.error("Failed to fetch page content, using fallback:", fallbackError);
                            setPageData({ title: t('navProjects'), content: t('projectFutureDesc'), metadata: {} });
                        }
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();

        return () => {
            controller.abort();
        };
    }, [language, t]);

    if (isLoading) {
        return (
            <Page title={t('navProjects')}> 
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                </div>
            </Page>
        );
    }

    // If we have projects, show the first one directly (since we only have one for now)
    if (useProjectsContent && projects.length > 0) {
        const project = projects[0];
        return (
            <Page title={project.title}> 
                <div>
                    <Hero 
                        title={project.metadata.hero_title || project.title} 
                        subtitle={project.metadata.hero_subtitle || project.metadata.description || t('projectFutureDesc')} 
                    />
                    <Section title={null}> 
                    <div 
                        className="prose max-w-none text-text-main mb-8
                                   [&_h2]:text-2xl [&_h2]:font-mono [&_h2]:text-primary 
                                   prose-li:[&_li::before]:bg-primary"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(project.content || '')) }} 
                    />
                    <div className="space-y-8">
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <LiveSensorReadings />
                        </div>
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <HistoricalSensorVisualization />
                        </div>
                    </div>
                </Section>
                    <div className="w-full mt-8">
                        <JoinHero language={language} />
                    </div>
                </div>
            </Page>
        );
    }

    // Show the original content if no projects were found
    return (
        <Page title={pageData.title}> 
            <div>
                <Hero 
                    title={pageData.metadata?.hero_title || pageData.title || t('navProjects')} 
                    subtitle={pageData.metadata?.hero_subtitle || pageData.metadata?.description || t('projectFutureDesc')} 
                />
                <Section title={null}> 
                    <div 
                        className="prose max-w-none text-text-main mb-8
                                   [&_h2]:text-2xl [&_h2]:font-mono [&_h2]:text-primary 
                                   prose-li:[&_li::before]:bg-primary"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(pageData.content || '')) }} 
                    />
                    <div className="space-y-8">
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <LiveSensorReadings />
                        </div>
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <HistoricalSensorVisualization />
                        </div>
                    </div>
                </Section>
                <div className="w-full mt-8">
                    <JoinHero language={language} />
                </div>
            </div>
        </Page>
    );
}

export default ProjectsPage;
