import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import { ExpandableBiodiversityCard } from '../components/ExpandableBiodiversityCard';
import BiodiversityHero from '../components/BiodiversityHero';
import MetaTags from '../components/MetaTags';

const limit = pLimit(2);

function BiodiversityPage() {
    const { t, language } = useTranslation();
    const projectSlug = "the-livada-biotope-monitoring"; // Define projectSlug here
    const [observations, setObservations] = useState([]);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [observationDataCache, setObservationDataCache] = useState({});

    // Fetch observation details with caching
    const fetchObservationDetails = useCallback(async (observation) => {
        const taxonId = observation.taxon?.id;
        if (!taxonId) return {};

        // Check cache first
        if (observationDataCache[taxonId]) {
            return observationDataCache[taxonId];
        }

        try {
            // Fetch from multiple languages simultaneously
            const [slResponse, enResponse] = await Promise.allSettled([
                limit(() => fetch(`https://sl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(observation.taxon.name.replace(/ /g, '_'))}`)),
                limit(() => fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(observation.taxon.name.replace(/ /g, '_'))}`))
            ]);

            const details = {};

            if (slResponse.status === 'fulfilled' && slResponse.value.ok) {
                const data = await slResponse.value.json();
                details.sl = { description: data.extract };
            }

            if (enResponse.status === 'fulfilled' && enResponse.value.ok) {
                const data = await enResponse.value.json();
                details.en = { description: data.extract };
            }

            // Cache the results
            setObservationDataCache(prev => ({ ...prev, [taxonId]: details }));
            return details;
        } catch (error) {
            console.error("Error fetching observation details:", error);
            return {};
        }
    }, [observationDataCache]);

    // Fetch observations from iNaturalist API
    const fetchObservations = useCallback(async (pageNum = 1) => {
        setIsLoading(true);
        try {
            const perPage = 20;
            const url = `https://api.inaturalist.org/v1/observations?project_id=${projectSlug}&order_by=observed_on&order=desc&page=${pageNum}&per_page=${perPage}&locale=${language}`;
            
            const response = await limit(() => fetch(url));
            const data = await response.json();
            
            if (pageNum === 1) {
                setObservations(data.results || []);
            } else {
                setObservations(prev => [...prev, ...(data.results || [])]);
            }
            
            setCanLoadMore(data.results && data.results.length === perPage);
        } catch (error) {
            console.error("Failed to fetch observations:", error);
            setObservations([]);
        } finally {
            setIsLoading(false);
        }
    }, [projectSlug, language]);

    useEffect(() => {
        fetchObservations(1);
    }, [fetchObservations]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchObservations(nextPage);
    };

    const [scrollContainerRef] = useState(null);

    // Enhanced scroll snapping behavior
    useEffect(() => {
        const container = scrollContainerRef;
        if (!container) return;

        let isScrolling = false;
        let scrollTimeout;

        const handleScroll = () => {
            if (!isScrolling) {
                isScrolling = true;
                container.classList.add('scrolling');
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                container.classList.remove('scrolling');
            }, 150);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [scrollContainerRef]);

    const pageTitle = t('navBiodiversity');
    const pageDescription = t('biodiversityDescription');

    return (
        <Page title={pageTitle}>
            <MetaTags
                title={pageTitle}
                description={pageDescription}
            />
            <BiodiversityHero language={language} />
            <div className="container mx-auto px-4 py-8 md:py-12">
                <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
                    <h2 className="text-display text-3xl mb-8 text-center bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent pt-4">{t('navBiodiversity')}</h2>
                    <div className="relative z-10">
                        <div className="space-y-12">
                            <div className="text-center max-w-3xl mx-auto">
                                <p className="text-lg text-text-muted">
                                    {t('biodiversityDescription')}
                                </p>
                            </div>
                            
                            <ExpandableBiodiversityCard 
                                observations={observations}
                                fetchObservationDetails={fetchObservationDetails}
                                language={language}
                                t={t}
                            />
                            
                            <div className="text-center mt-8">
                                {canLoadMore && (
                                    <button 
                                        onClick={handleLoadMore} 
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-t from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] text-[var(--primary)] font-semibold rounded-full border-2 border-[var(--glass-border)] shadow-sm backdrop-blur-sm hover:bg-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? t('loading') : t('loadMore')}
                                    </button>
                                )}
                                {!canLoadMore && observations.length > 0 && (
                                    <p className="text-text-muted mt-4">{t('noMoreObservations')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassSection>
            </div>
        </Page>
    );
}

export default BiodiversityPage;