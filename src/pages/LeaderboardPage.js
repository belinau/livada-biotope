import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import MetaTags from '../components/MetaTags';

function LeaderboardPage() {
    const { t } = useTranslation();
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/.netlify/functions/leaderboard');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                
                const data = await response.json();
                setScores(data.scores || []);
            } catch (err) {
                console.error("Error fetching scores:", err);
                setError(t('error'));
                setScores([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [t]);

    const pageTitle = t('hallOfFame');
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
                        <div className="text-center mb-8">
                            <h2 className="text-display text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">
                                {t('hallOfFame')}
                            </h2>
                            <p className="text-text-muted mt-2">
                                {t('memoryGameDescription')}
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-12 h-12 bg-primary rounded-full mb-4"></div>
                                    <div className="h-4 bg-primary rounded w-32"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-text-muted">{error}</p>
                            </div>
                        ) : scores.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-text-muted">{t('noScores')}</p>
                                <p className="text-text-muted text-sm mt-2">
                                    {t('beTheFirstToSubmitScore')}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-glass-border">
                                            <th className="py-3 px-4 text-left text-text-main font-bold">{t('player')}</th>
                                            <th className="py-3 px-4 text-right text-text-main font-bold">{t('score')}</th>
                                            <th className="py-3 px-4 text-right text-text-main font-bold">{t('date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores.map((score, index) => (
                                            <tr 
                                                key={score.id} 
                                                className={`border-b border-glass-border ${index < 3 ? 'bg-primary/10' : ''}`}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        {index === 0 && (
                                                            <span className="mr-2">🥇</span>
                                                        )}
                                                        {index === 1 && (
                                                            <span className="mr-2">🥈</span>
                                                        )}
                                                        {index === 2 && (
                                                            <span className="mr-2">🥉</span>
                                                        )}
                                                        <span className={index < 3 ? 'font-bold' : ''}>
                                                            {score.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono">
                                                    {score.score} {t('moves')}
                                                </td>
                                                <td className="py-3 px-4 text-right text-text-muted text-sm">
                                                    {new Date(score.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </GlassSection>
                </div>
            </div>
        </Page>
    );
}

export default LeaderboardPage;