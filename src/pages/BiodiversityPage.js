import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import { ExpandableBiodiversityCard } from '../components/ExpandableBiodiversityCard';

const limit = pLimit(2);

function BiodiversityPage() {
    const { t, language } = useTranslation();
    const projectSlug = "the-livada-biotope-monitoring"; // Define projectSlug here
    const [observations, setObservations] = useState([]);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [observationDataCache, setObservationDataCache] = useState({});

    const fetchDescription = useCallback(async (lang, taxonName, signal) => {
        const response = await limit(() => fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(taxonName.replace(/ /g, '_'))}`, { signal }));
        if (!response.ok) {
            return `No description found on ${lang} Wikipedia.`;
        }
        const data = await response.json();
        return data.extract;
    }, []);

    const fetchObservationDetails = useCallback(async (observation, signal) => {
        if (observationDataCache[observation.id]) {
            return { ...observation, ...observationDataCache[observation.id] };
        }

        try {
            const taxonName = observation.taxon.name;
            const [enDescription, slDescription] = await Promise.all([
                fetchDescription('en', taxonName, signal),
                fetchDescription('sl', taxonName, signal)
            ]);

            const newData = { 
                en: { description: enDescription },
                sl: { description: slDescription }
            };

            setObservationDataCache(prevCache => ({ ...prevCache, [observation.id]: newData }));
            return { ...observation, ...newData };

        } catch (error) {
            if (error.name !== 'AbortError') {
              console.error("Error fetching observation data:", error);
            }
            return observation;
        }
    }, [observationDataCache, fetchDescription]);

    const fetchObservations = useCallback(async (pageNum, signal) => {
        setIsLoading(true);
        try {
            const response = await limit(() => fetch(`https://api.inaturalist.org/v1/observations?project_id=${projectSlug}&per_page=12&page=${pageNum}&order_by=observed_on&order=desc&locale=${language}`, { signal }));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setObservations(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
            if (data.results.length < 12) {
                setCanLoadMore(false);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
              console.error("iNaturalist fetch error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [projectSlug, language]);

    useEffect(() => {
      const controller = new AbortController();
      fetchObservations(1, controller.signal);

      return () => {
        controller.abort();
      };
    }, [fetchObservations]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchObservations(nextPage);
    };

    return (
        <Page title={t('navBiodiversity')}> 
            <Section title={t('biodiversityTitle')}>
                <p className="text-body-lg mb-8 text-text-muted max-w-3xl mx-auto text-center">{t('biodiversityDesc')}</p>
                <div className="max-w-3xl mx-auto">
                    <ExpandableBiodiversityCard
                        observations={observations}
                        fetchObservationDetails={fetchObservationDetails}
                        language={language}
                        t={t}
                    />
                </div>
                <div className="text-center mt-8">
                    {canLoadMore && (
                        <button onClick={handleLoadMore} disabled={isLoading} className="bg-primary/90 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary transition-colors disabled:bg-text-muted">
                            {isLoading ? t('loading') : t('loadMore')}
                        </button>
                    )}
                    {!canLoadMore && observations.length > 0 && (
                        <p className="text-text-muted mt-4">{t('noMoreObservations')}</p>
                    )}
                </div>
            </Section>
        </Page>
    );
}

export default BiodiversityPage;
