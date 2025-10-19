import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import { GlassCard } from '../components/ui/GlassCard';
import FilteredImage from '../components/ui/FilteredImage';
import { processAndRenderContent, parseMarkdown } from '../shared/markdown-utils';
import PracticeSteps from '../components/PracticeSteps';
import MetaTags from '../components/MetaTags';
import { normalizeImagePath } from '../utils/path-utils';
// Import sensor components for the specific project
import LiveSensorReadings from '../components/LiveSensorReadings';
import EnhancedHistoricalVisualization from '../components/EnhancedHistoricalVisualization';

const limit = pLimit(2);

const collectionSlugMapping = {
    "prepletanja": "projects",
    "utelesenja": "practices",
    "zapisi": "posts",
    "sorodstva": "kinships"
};

const collectionPathMap = {
    projects: 'content/projects',
    practices: 'content/practices',
    posts: 'content/posts',
    kinships: 'content/kinships'
};

function ContentItemPage() {
    const { collection: collectionSlug, slug } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasRenderError, setHasRenderError] = useState(false); // New state for render errors
    const [hasFetchError, setHasFetchError] = useState(false); // New state for fetch errors
    const { language, t } = useTranslation();
    const contentRef = useRef(null);

    const collection = collectionSlugMapping[collectionSlug] || collectionSlug;
    const contentPath = collectionPathMap[collection];

    // Check if this is the specific project that needs sensor components
    // This project should show sensor components on its detail page
    const needsSensorComponents = collection === 'projects' && (item?.id === 'lets-not-dry-out-future' || item?.id === 'ne-izsusimo-prihodnosti');
     
    // Debug logging
    console.log('ContentItemPage debug:', { collection, slug, item, needsSensorComponents });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchContent = async () => {
            if (!contentPath || !slug) {
                setIsLoading(false);
                setHasFetchError(false); // Reset fetch error if no path/slug
                return;
            }
            setIsLoading(true);
            setHasFetchError(false); // Reset fetch error at the start of a new fetch
            setIsLoading(true);
            try {
                console.log(`Fetching content for ${collection}/${slug} in ${language}`);

                const baseName = slug; // Assume slug is the baseName
                const langFile = `${baseName}.${language}.md`;
                const defaultFile = `${baseName}.sl.md`;

                let fileToFetch;
                let res;

                // Try to fetch the file for the current language
                fileToFetch = `/${contentPath}/${langFile}`;
                res = await limit(() => fetch(fileToFetch, { signal }));

                // If it fails, fall back to the default Slovenian file
                if (!res.ok) {
                    console.warn(`Could not find ${langFile}, falling back to Slovenian version.`);
                    fileToFetch = `/${contentPath}/${defaultFile}`;
                    res = await limit(() => fetch(fileToFetch, { signal }));
                }

                if (res.ok) {
                    const text = await res.text();
                    const parsed = parseMarkdown(text);
                    const foundItem = { ...parsed, id: baseName };
                    console.log(`Found item for ${collection}/${slug} in ${language}:`, foundItem);
                    setItem(foundItem);
                } else {
                    console.log(`Content not found for ${collection}/${slug} in ${language}`);
                    // If content is explicitly not found after fallback, it's not a fetch error but a 404
                    setItem(null); // Ensure item is null to trigger 404 display
                }

            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(`Error fetching content:`, err);
                    setHasFetchError(true); // Set fetch error state for network issues
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();

        return () => {
            controller.abort();
        };
    }, [contentPath, slug, language, collection]);

    useEffect(() => {
        if (item && contentRef.current) {
            try {
                processAndRenderContent(item.content, contentRef, language);
                setHasRenderError(false); // Reset error if successful
            } catch (error) {
                console.error("Error rendering content:", error);
                setHasRenderError(true);
            }
        }
    }, [item, contentRef, language]);

    if (isLoading) {
        return (
            <Section title={t('loading')}> 
                <div className="text-body text-center text-text-muted">{t('loading')}…</div>
            </Section>
        );
    }

    if (!item) {
        return (
            <Page title="404">
                <Section title="404">
                    <p className="text-center text-text-muted">{t('contentNotFound')}</p>
                </Section>
            </Page>
        );
    }

    if (hasRenderError) {
        return (
            <Page title={t('error')}> 
                <Section title={t('error')}> 
                    <p className="text-center text-red-500">{t('contentRenderError')}</p>
                </Section>
            </Page>
        );
    }

    if (hasFetchError) {
        return (
            <Page title={t('error')}> 
                <Section title={t('error')}> 
                    <p className="text-center text-red-500">{t('contentFetchError')}</p>
                </Section>
            </Page>
        );
    }

    // Helper function to create a summary from markdown
    const createSummary = (markdown) => {
        if (!markdown) return '';
        const plainText = markdown
            .replace(/!\\[.*?\\]\(.*?\)/g, '') // remove images
            .replace(/\\[(.*?)\\]\(.*?\)/g, '$1') // remove links, keeping text
            .replace(/\*\*|\*|_|---/g, '') // remove bold, italic, code, hr
            .replace(/#+\s/g, '') // remove headings
            .replace(/{{\s*.*?}}\n/g, ' ') // remove shortcodes and newlines
            .trim();
        return plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    };

    const pageTitle = item.metadata.title;
    const pageDescription = item.metadata.description || createSummary(item.content);
    const normalizedImage = normalizeImagePath(item.metadata.image);
    const pageImage = normalizedImage ? `${window.location.origin}${normalizedImage}` : null;

    return (
        <Page title={pageTitle}>
            <MetaTags
                title={pageTitle}
                description={pageDescription}
                imageUrl={pageImage}
            />
            <div className="max-w-3xl mx-auto pt-6">
                <div className="mb-6">
                    <button 
                        onClick={() => {
                            console.log('Button clicked, navigating to:', `/${collectionSlug}`);
                            navigate(`/${collectionSlug}`);
                        }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] text-text-main border border-glass-border shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out relative z-10 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        {t('backToCollection')}
                    </button>
                </div>
                <GlassCard className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] rounded-2xl p-6">
                    {normalizedImage && (
                        <div className="mb-8 overflow-hidden rounded-lg aspect-video">
                            <FilteredImage src={normalizedImage} alt={item.metadata.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {item.metadata.date && (
                            <p className="text-accent text-sm text-text-muted">
                                {new Date(item.metadata.date).toLocaleDateString(language)}
                            </p>
                        )}
                        {item.metadata.author && (
                            <p className="text-accent text-sm text-text-muted">
                                {language === 'sl' ? 'Avtor: ' : 'by '}
                                {item.metadata.author}
                            </p>
                        )}
                    </div>
                    <h1 className="heading-organic text-3xl md:text-4xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent mb-6">{item.metadata.title}</h1>
                    
                    <div
                        className="prose-organic max-w-none"
                        ref={contentRef}
                    />

                    {item.metadata.steps && (
                        <PracticeSteps
                            steps={item.metadata.steps}
                            language={language}
                            t={t}
                        />
                    )}

                    {item.metadata.tags && (
                        <div className="mt-8 pt-4 border-t border-glass-border flex flex-wrap gap-2">
                            {item.metadata.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {/* Conditionally render sensor components for the specific project */}
                {needsSensorComponents && (
                    <div className="space-y-8 mt-8">
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <LiveSensorReadings />
                        </div>
                        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
                            <EnhancedHistoricalVisualization />
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default ContentItemPage;
