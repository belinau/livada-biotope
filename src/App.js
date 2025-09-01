import React, { useState, useEffect, useMemo, createContext, useContext, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { parse } from 'yaml';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';
import pLimit from 'p-limit';
import HistoricalSensorVisualization from './components/HistoricalSensorVisualization';
import LivadaAPIClient from './shared/api-client';
import { transformApiData } from './shared/sensor-utils';
import { ExpandableBiodiversityCard } from './components/ExpandableBiodiversityCard';
import { HoverEffect } from './components/ui/HoverEffect';
import { GlassCard } from './components/ui/GlassCard';
import { GlassSection } from './components/ui/GlassSection';

import CalendarFeed from './components/CalendarFeed';
import MemoryGame from './components/MemoryGame';
import ExpandableCard from './components/ExpandableCard';
import GalleryExpandedContent from './components/GalleryExpandedContent';
import BiodiversityHero from './components/BiodiversityHero';
import PracticesHero from './components/PracticesHero';
import JoinHero from './components/JoinHero';
import ScatterText from './components/ui/scramble-text';
import { Navbar } from "./components/ui/resizable-navbar/Navbar";
import { NavBody } from "./components/ui/resizable-navbar/NavBody";
import { NavItems } from "./components/ui/resizable-navbar/NavItems";
import { MobileNav } from "./components/ui/resizable-navbar/MobileNav";
import { NavbarLogo } from "./components/ui/resizable-navbar/NavbarLogo";
import { NavbarButton } from "./components/ui/resizable-navbar/NavbarButton";
import { MobileNavHeader } from "./components/ui/resizable-navbar/MobileNavHeader";
import { MobileNavToggle } from "./components/ui/resizable-navbar/MobileNavToggle";
import { MobileNavMenu } from "./components/ui/resizable-navbar/MobileNavMenu";

const limit = pLimit(2); // Limit to 2 concurrent requests

// --- Config and Helper Functions ---
/**
 * Generates optimized image URL using Netlify's CDN
 * @param {string} src - Image source path
 * @param {number} [width=400] - Desired width
 * @param {number} [height=400] - Desired height
 * @returns {string} Optimized image URL
 */
const isLocalDevelopment = process.env.NODE_ENV === 'development';

const getOptimizedImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // In local development, return the path directly without Netlify CDN
  if (isLocalDevelopment) {
    // Handle both relative and absolute paths
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
      return imagePath;
    }
    // Ensure the path is correctly formatted for local development
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  // Production: Use Netlify CDN
  const url = new URL('https://livada.bio');
  url.pathname = `/.netlify/images`;
  url.searchParams.append('url', imagePath);
  url.searchParams.append('w', '1200');
  url.searchParams.append('q', '80');
  return url.toString();
};

const getResponsiveSrcSet = (imagePath) => {
  if (!imagePath || isLocalDevelopment) {
    // In local development, just return the image path as is
    return imagePath;
  }

  // Production: Generate responsive srcset
  const widths = [400, 600, 800, 1000, 1200, 1600, 2000];
  const url = new URL('https://livada.bio');
  
  return widths.map(width => {
    url.pathname = `/.netlify/images`;
    const params = new URLSearchParams();
    params.append('url', imagePath);
    params.append('w', width.toString());
    params.append('q', '80');
    return `${url.toString()}?${params.toString()} ${width}w`;
  }).join(', ');
};

const BED_MAPPING = {
    '!35c2d45c-0': { name: 'travni sestoj', color: 'var(--primary)' },
    '!35c2d45c-1': { name: 'sivka in melisa', color: 'var(--text-sage)' },
    
    '!04c5ad60-0': { name: 'barjansko rastje', color: 'var(--primary-dark)' },
    '!04c5ad60-1': { name: 'cvetlice za opraševalce', color: 'var(--border-color)' },

    '!76208ba5-0': { name: 'majaron in melisa', color: 'var(--text-sage)' },
    '!76208ba5-1': { name: 'tolščak in slezenovec', color: 'var(--primary-dark)' },
};

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

 

// 2️⃣  Custom short-code renderer
function enhanceHTML(html) {
  return html
    // :::details Title
    // content
    // :::
    .replace(/:::details\s+(.+?)\n([\s\S]*?)\n:::/g, '<details><summary>$1</summary><div class="mt-2">$2</div></details>')
    // {{youtube ID}}
    .replace(/{{youtube\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>`)
    // {{vimeo ID}}
    .replace(/{{vimeo\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div>`);
}

  
// --- Contexts ---

const SensorContext = createContext();
const useSensorData = () => useContext(SensorContext);

const HistoricalSensorContext = createContext();
const useHistoricalSensorData = () => useContext(HistoricalSensorContext);

const SensorProvider = ({ children }) => {
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);

    const livadaApiClient = useMemo(() => new LivadaAPIClient(process.env.REACT_APP_PI_API_URL), []);

    const fetchHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const data = await livadaApiClient.getHistoryTelemetry();
            const transformedData = transformApiData(data.data);
            
            const processedHistory = {};
            for (const key in transformedData) {
                if (Array.isArray(transformedData[key])) {
                    processedHistory[key] = transformedData[key].map(point => ({
                        ...point,
                        x: new Date(point.x)
                    }));
                }
            }
            setHistory(processedHistory);
            setStatus({ key: 'dataUpdated', type: 'success' });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Could not fetch history:", error.message || error);
            setStatus({ key: 'fetchError', type: 'error' });
            setHistory({});
        }
    }, [livadaApiClient]);

    useEffect(() => {
        fetchHistory();
        const intervalId = setInterval(fetchHistory, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchHistory]);

    return (
        <SensorContext.Provider value={{ history, status, lastUpdated, refreshData: fetchHistory }}>
            {children}
        </SensorContext.Provider>
    );
};

const LanguageContext = createContext();
const translations = {
    sl: {
        navHome: 'Domov',
        navProjects: 'Prepletanja',
        navPractices: 'Utelešenja',
        navBiodiversity: 'Biodiverziteta',
        navGallery: 'Galerija',
        navCalendar: 'Koledar',
        navPosts: 'Zapisi',
        sensorDataTitle: 'livada.bio občuti zemljo',
        projectFutureDesc: 'V tem prepletanju ne merimo, temveč poslušamo šepet prsti, ki nam pripoveduje o vlagi, temperaturi in življenju pod površjem. Podatki se osvežujejo vsako uro.',
        biodiversityTitle: 'Življenje na livadi',
        biodiversityDesc: 'Biodiverziteta ni zgolj seznam vrst, temveč mreža razmerij, ki jih spletamo s travnikom in njegovimi prebivalci.',
        calendarTitle: 'Koledar dogodkov',
        calendarDesc: 'Naši prihajajoči dogodki, delavnice in srečanja. Pridruži se nam!',
        recentObservations: 'Nedavna opazovanja',
        loading: 'Nalagam',
        loadMore: 'Naloži več',
        noMoreObservations: 'Ni več opazovanj.',
        fetchError: 'Napaka pri pridobivanju podatkov',
        dataUpdated: 'Podatki so osveženi',
        lastUpdated: 'Zadnja meritev',
        refreshData: 'Osveži podatke',
        noChartData: 'Ni dovolj podatkov za prikaz grafa.',
        noSensorData: 'Ni podatkov o senzorjih',
        noUpcomingEvents: 'Trenutno ni napovedanih dogodkov.',
        noEventsFound: 'Ni najdenih dogodkov v koledarju.',
        moistureFlows: 'Vlaga v zraku in prsti',
        temperatureFlows: 'Temperatura zraka in prsti',
        time: 'Čas',
        temperature: 'temperatura',
        soilMoisture: 'vlaga v prsti',
        soilTemp: 'temperatura prsti',
        airTemp: 'temperatura zraka',
        airHumidity: 'vlaga v zraku',
        historicalSensorDataTitle: 'Zgodovinski podatki senzorjev',
        footerText: 'Biotop Livada – posebna pobuda v okviru zavoda BOB © 2025',
        photoBy: 'Foto',
        navMemoryGame: 'Spomin',
        memoryGameTitle: 'Spomin',
        moves: 'poteze',
        playAgain: 'nova igra',
        slovenian: 'SL',
        english: 'EN',
        latin: 'strokovna imena',
        close: 'Zapri',
        previous: 'Prejšnja',
        next: 'Naslednja',
        memoryGameDescription: 'V igri Spomin so uporabljeni posnetki, zbrani med rednimi monitoringi v Biotopu Livada, celotno zbirko lahko pogledaš na odseku Biodiverziteta. Če bi v igri rad_a videl_a tudi tvoje fotografije, se nam lahko pridružiš na monitoringu na Livadi in prispevaš svoja opažanja preko platforme iNaturalist. Vsa opažanja na tej mikrolokaciji (opremljena z geokoordinatami LivadaLAB ali bližnje okolice) se samodejno vpišejo v naš namenski projekt na omenjeni plaformi.',
        congratulations: 'Čestitamo!',
        yourScore: 'Tvoj rezultat:',
        enterName: 'Vpiši ime za lestvico:',
        submitScore: 'Shrani rezultat',
        hallOfFame: 'Lestvica najboljših',
        player: 'Bitje',
        score: 'Točke',
        newGame: 'Nova igra',
        noScores: 'Ni še rezultatov',
        openInINaturalist: 'Odpri v iNaturalistu',
        openInWikipedia: 'Odpri v Wikipediji',
        loadingDescription: 'Nalagam opis...',

    },
    en: {
        navHome: 'Home',
        navProjects: 'Intertwinings',
        navPractices: 'Embodiments',
        navBiodiversity: 'Biodiversity',
        navGallery: 'Gallery',
        navCalendar: 'Calendar',
        navPosts: 'Writings',
        sensorDataTitle: 'livada.bio soil sensing',
        projectFutureDesc: 'In this intertwining, we don\'t just measure; we listen to the whisper of the soil, which tells us stories of moisture, temperature, and life beneath the surface. Data is updated hourly.',
        biodiversityTitle: 'Life at Livada',
        biodiversityDesc: 'Biodiversity is not just a list of species, but a web of relationships we co-create. See who we\'ve spotted in our meadow.',
        calendarTitle: 'Calendar of Events',
        calendarDesc: 'Our upcoming events, workshops, and gatherings. Join us!',
        recentObservations: 'Recent Observations',
        loading: 'Loading',
        loadMore: 'Load More',
        noMoreObservations: 'No more observations.',
        fetchError: 'Error fetching data',
        dataUpdated: 'Data updated',
        lastUpdated: 'Last measurement',
        refreshData: 'Refresh Data',
        noChartData: 'Not enough data to display the chart.',
        noSensorData: 'No sensor data available',
        noUpcomingEvents: 'No upcoming events scheduled at this time.',
        noEventsFound: 'No events found in the calendar.',
        moistureFlows: 'Moisture Flows',
        temperatureFlows: 'Temperature Flows',
        time: 'Time',
        temperature: 'Temperature',
        soilMoisture: 'soil moisture',
        soilTemp: 'soil temperature',
        airTemp: 'Air Temperature',
        airHumidity: 'Air Humidity',
        historicalSensorDataTitle: 'Historical Sensor Data',
        footerText: 'The Livada Biotope – special initiative within BOB Institute © 2025',
        photoBy: 'Photo',
        navMemoryGame: 'Memory Game',
        memoryGameTitle: 'Memory Game',
        moves: 'Moves',
        playAgain: 'Play Again',
        slovenian: 'Slovenian',
        english: 'English',
        latin: 'Latin',
        close: 'Close',
        previous: 'Previous',
        next: 'Next',
        memoryGameDescription: 'The Memory game uses images collected during regular monitoring in the Livada Biotope. You can view the entire collection in the Biodiversity section. If you would like to see your photos in the game, you can join us in monitoring at Livada and contribute your observations via the iNaturalist platform. All observations in this microlocation (equipped with the coordinates of LivadaLAB or the immediate vicinity) are automatically entered into our dedicated project on the mentioned platform.',
        congratulations: 'Congratulations!',
        yourScore: 'Your score:',
        enterName: 'Enter name for leaderboard:',
        submitScore: 'Save Score',
        hallOfFame: 'Hall of Fame',
        player: 'Bitje',
        score: 'Točke',
        newGame: 'New Game',
        noScores: 'Ni še rezultatov',
        openInINaturalist: 'Odpri v iNaturalistu',
        openInWikipedia: 'Odpri v Wikipediji',
        loadingDescription: 'Nalagam opis...',
    }
};
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('sl');
    const t = useCallback((key) => translations[language]?.[key] || key, [language]);
    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};
const useTranslation = () => useContext(LanguageContext);


// --- Components ---
const MetricCard = ({ label, value, unit = '', decimals = 0 }) => {
    const isValid = typeof value === 'number' && !isNaN(value);
    const displayValue = isValid ? value.toFixed(decimals) : '--';
    return (
        <motion.div
            className="bg-bg-main/70 p-3 rounded-md text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-display text-2xl text-primary">{displayValue}<span className="text-accent text-base text-text-muted ml-1">{unit}</span></div>
            <div className="text-accent text-xs text-text-muted uppercase tracking-wider">{label}</div>
        </motion.div>
    );
};
const BedCard = ({ bed, reading, t }) => {
    const lastHeard = reading ? new Date(reading.timestamp) : null;
    return (
        <div className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-border-color/50 hover:border-border-color/60">
            <div className="p-4 flex justify-between items-center bg-gradient-to-r" style={{ background: `linear-gradient(135deg, ${bed.color}, ${bed.color}dd)`, color: 'white' }}>
                <h4 className="heading-organic text-lg group-hover:scale-105 transition-transform duration-200">{bed.name}</h4>
                <div className="w-3 h-3 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors duration-200"></div>
            </div>
            <div className="p-5 space-y-4 flex-grow bg-gradient-to-b from-white/5 to-transparent">
                {reading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard label={t('soilMoisture')} value={reading.moisture} unit="%" decimals={1} />
                        <MetricCard label={t('soilTemp')} value={reading.temperature} unit="°C" decimals={1} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="text-accent text-sm">{t('noSensorData')}</div>
                        </div>
                    </div>
                )}
            </div>
            {lastHeard && (
                <div className="bg-bg-main/80 backdrop-blur-sm p-3 text-xs text-text-muted flex justify-between items-center border-t border-border-color/50">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse"></div>
                        <span className="text-accent font-medium">Live</span>
                    </div>
                    <span className="text-accent">{t('lastUpdated')}: {lastHeard.toLocaleString(t.language)}</span>
                </div>
            )}
        </div>
    );
};

export const ChartWrapper = ({ title, children }) => (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-border-color/50 flex flex-col min-h-[400px] hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center mb-4">
            <h4 className="heading-playful text-lg text-center px-4 py-2 bg-gradient-to-r from-bg-main to-bg-main rounded-full border border-border-color shadow-sm">{title}</h4>
        </div>
        <div className="flex-grow relative overflow-hidden">{children}</div>
    </div>
);

function SensorVisualization() {
    const { t, language } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });
    const [latestReadings, setLatestReadings] = useState({});

    const nivoTheme = useMemo(() => {
        if (typeof window === 'undefined') return {};
        const style = getComputedStyle(document.documentElement);
        return {
            axis: {
                ticks: { text: { fill: style.getPropertyValue('--text-muted') } },
                legend: { text: { fill: style.getPropertyValue('--text-main'), fontSize: 'var(--text-sm)' } }
            },
            grid: { line: { stroke: style.getPropertyValue('--border-color'), strokeDasharray: '2 2' } },
            tooltip: { container: { background: style.getPropertyValue('--bg-main'), color: style.getPropertyValue('--text-main'), border: `1px solid ${style.getPropertyValue('--border-color')}` } },
        };
    }, []);

    const CustomTooltip = ({ point }) => {
        const date = new Date(point.data.x);
        const formattedDate = date.toLocaleString(language, {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        return (
            <div className="bg-bg-main p-3 border border-border-color rounded-sm shadow-lg">
                <div className="flex items-center">
                    <span style={{ display: 'block', width: '12px', height: '12px', background: point.serieColor, marginRight: '8px' }}></span>
                    <strong className="text-text-main">{point.serieId}</strong>
                </div>
                <div className="text-text-muted">{formattedDate}</div>
                <div className="text-text-main">{`${point.data.yFormatted}`}</div>
            </div>
        );
    };

    useEffect(() => {
        if (!history) return;

        const newChartData = { moisture: [], temperature: [] };
        const newLatestReadings = {};
        const processDataPoint = (item) => ({ x: new Date(item.x), y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : 0 });

        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const seriesData = history[historyKey].map(processDataPoint);
                const lastPoint = history[historyKey][history[historyKey].length - 1];
                const bedId = historyKey.substring(0, historyKey.lastIndexOf('-'));
                const metricType = historyKey.substring(historyKey.lastIndexOf('-') + 1);

                if (!newLatestReadings[bedId]) { newLatestReadings[bedId] = {}; } 
                newLatestReadings[bedId][metricType] = lastPoint.y;
                newLatestReadings[bedId].timestamp = lastPoint.x;

                const bedInfo = BED_MAPPING[bedId];
                if (bedInfo) {
                    if (metricType === 'moisture') newChartData.moisture.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                    else if (metricType === 'temperature') newChartData.temperature.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                }
            }
        }
        
        if (history.airHumidity?.length > 0) newChartData.moisture.push({ id: t('airHumidity'), color: '#76e4f7', data: history.airHumidity.map(processDataPoint) });
        if (history.airTemperature?.length > 0) newChartData.temperature.push({ id: t('airTemp'), color: '#f6ad55', data: history.airTemperature.map(processDataPoint) });

        setChartData(newChartData);
        setLatestReadings(newLatestReadings);
    }, [history, t]);

    const hasMoistureData = chartData.moisture.some(series => series.data.length > 1);
    const hasTemperatureData = chartData.temperature.some(series => series.data.length > 1);
    const isLoading = status.key === 'loading';

    const getStatusMessage = () => {
        if (status.type === 'error') return t('fetchError');
        if (status.type === 'success') return `${t('dataUpdated')} (${lastUpdated?.toLocaleTimeString()})`;
        return `${t('loading')}...`;
    };
    
    return (
        <div className="relative p-4 sm:p-8 rounded-2xl shadow-2xl overflow-hidden border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-display text-2xl lg:text-3xl text-text-main bg-gradient-to-r from-primary-dark to-primary-dark bg-clip-text text-transparent">{t('sensorDataTitle')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.type === 'error' ? 'bg-sunset' : status.type === 'success' ? 'bg-primary animate-pulse' : 'bg-sunset'}`}></div>
                        <span className={`text-accent font-medium ${status.type === 'error' ? 'text-sunset' : 'text-text-main'}`}>{getStatusMessage()}</span>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                        <span className="text-accent font-medium">{isLoading ? t('loading') : t('refreshData')}</span>
                    </button>
                </div>
            </div>

            {isLoading && !history ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                    </div>
                    <div className="text-body-lg text-text-muted">{t('loading')}...</div>
                    <div className="text-accent text-text-muted mt-2">Pridobivam podatke senzorjev</div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                            <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                        ))}
                    </div>

                    <div className="space-y-8 pt-8 border-t-2 border-border-color">
                        <div className="text-center">
                            <h4 className="heading-organic text-xl mb-3">Grafični prikaz podatkov</h4>
                            <p className="text-body text-text-muted">Spremljanje vlage in temperature skozi čas</p>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <ChartWrapper title={t('moistureFlows')}> 
                                {hasMoistureData ? (
                                    <ResponsiveLine
                                        tooltip={CustomTooltip}
                                        data={chartData.moisture}
                                        theme={nivoTheme}
                                        colors={{ datum: 'color' }}
                                        margin={{ top: 20, right: 30, bottom: 140, left: 80 }}
                                        xScale={{ type: 'time', format: 'native' }}
                                        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                        axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
                                        axisLeft={{ legend: 'Vlaga (%)', legendOffset: -60, legendPosition: 'middle' }}
                                        enablePoints={false}
                                        useMesh={true}
                                        curve="monotoneX"
                                        animate={true}
                                        motionConfig="wobbly"
                                        legends={[{ 
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: 0,
                                            translateY: 100,
                                            itemsSpacing: 8,
                                            itemWidth: 140,
                                            itemHeight: 20,
                                            symbolSize: 14,
                                            itemTextColor: 'var(--text-main)'
                                        }]}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                                        <div className="text-center p-8">
                                            <div className="text-4xl mb-3">📈</div>
                                            <div className="text-body font-medium">{t('noChartData')}</div>
                                            <div className="text-accent text-text-muted mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
                                        </div>
                                    </div>
                                )}
                            </ChartWrapper>
                            <ChartWrapper title={t('temperatureFlows')}> 
                                {hasTemperatureData ? (
                                    <ResponsiveLine
                                        tooltip={CustomTooltip}
                                        data={chartData.temperature}
                                        theme={nivoTheme}
                                        colors={{ datum: 'color' }}
                                        margin={{ top: 20, right: 30, bottom: 140, left: 80 }}
                                        xScale={{ type: 'time', format: 'native' }}
                                        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                        axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
                                        axisLeft={{ legend: `${t('temperature')} (°C)`, legendOffset: -60, legendPosition: 'middle' }}
                                        enablePoints={false}
                                        useMesh={true}
                                        curve="monotoneX"
                                        animate={true}
                                        motionConfig="wobbly"
                                        legends={[{ 
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: 0,
                                            translateY: 100,
                                            itemsSpacing: 8,
                                            itemWidth: 140,
                                            itemHeight: 20,
                                            symbolSize: 14,
                                            itemTextColor: 'var(--text-main)'
                                        }]}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                                        <div className="text-center p-8">
                                            <div className="text-4xl mb-3">🌡️</div>
                                            <div className="text-body font-medium">{t('noChartData')}</div>
                                            <div className="text-accent text-text-muted mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
                                        </div>
                                    </div>
                                )}
                            </ChartWrapper>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// --- Page Components ---
function Page({ title, children }) {
    useEffect(() => { document.title = `${title} | Biotop Livada`; }, [title]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}

function Section({ title, children, className = '' }) {
    return (
        <section className={`container mx-auto px-4 py-12 ${className}`}>
            <h2 className="text-display text-3xl mb-8 text-center text-primary">{title}</h2>
            <div className="relative z-10">
                <GlassSection>
                    {children}
                </GlassSection>
            </div>
        </section>
    );
}



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
                <div className="max-w-3xl mx-auto">
                    <SensorVisualization />
                    <HistoricalSensorVisualization />
                </div>
            </Section>
        </Page>
    );
}

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

function CalendarPage() {
    const { t } = useTranslation();
    return (
        <Page title={t('navCalendar')}> 
            <Section title={t('calendarTitle')}> 
                <p className="text-body-lg mb-8 text-text-muted max-w-3xl mx-auto text-center">{t('calendarDesc')}</p>
                <div className="max-w-3xl mx-auto">
                    <CalendarFeed 
                        icsUrl="https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics"
                        calendarUrl="https://calendar.google.com/calendar/embed?src=c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com&ctz=Europe%2FBelgrade"
                    />
                </div>
            </Section>
        </Page>
    );
}

// Function to render markdown with Mermaid and custom shortcodes
const renderMarkdown = (content) => {
  if (!content) return '';
  
  // First, process any Mermaid code blocks to prevent markdown processing
  let processedContent = content.replace(
    /```mermaid\n([\s\S]*?)\n```/g, 
    (match, diagram) => {
      // Replace with a placeholder that will be processed by renderMermaid
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      return `<div class="mermaid-placeholder" data-diagram="${encodeURIComponent(diagram)}" id="${id}"></div>`;
    }
  );
  
  // Process the remaining markdown to HTML
  const html = marked(processedContent);
  
  // Apply custom shortcodes
  return enhanceHTML(html);
};

// Function to render Mermaid diagrams within a given container
const renderMermaid = (container) => {
  if (!container) return;

  try {
    // First, handle mermaid placeholders
    const placeholders = container.querySelectorAll('.mermaid-placeholder');
    placeholders.forEach(placeholder => {
      const diagram = decodeURIComponent(placeholder.getAttribute('data-diagram') || '');
      if (diagram) {
        const id = placeholder.id || `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = diagram;
        div.id = id;
        
        // Replace the placeholder with our div
        placeholder.parentNode.replaceChild(div, placeholder);
      }
    });
    
    // Then handle any direct mermaid code blocks
    const mermaidElements = container.querySelectorAll('code.language-mermaid');
    mermaidElements.forEach((element) => {
      const graphDefinition = element.textContent;
      
      // Create a div for the diagram
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = graphDefinition;
      
      // Replace the code block with our div
      const parent = element.parentElement;
      if (parent) {
        parent.parentNode.replaceChild(div, parent);
      }
    });
    
    // Render all mermaid diagrams found in the container
    mermaid.run({
      nodes: container.querySelectorAll('.mermaid'),
    });
    
  } catch (error) {
    console.error('Error rendering Mermaid diagrams:', error);
  }
};

function ContentCollectionPage({ t, title, contentPath }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { language } = useTranslation();
    const contentRef = useRef({});

    // Process markdown content when items change
    const processedItems = useMemo(() => {
      return items.map(item => ({
        ...item,
        processedContent: renderMarkdown(item.content)
      }));
    }, [items]);
  
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const manifestResponse = await limit(() => fetch(`/${contentPath}/manifest.json`, { signal }));
          if (!manifestResponse.ok) throw new Error('Manifest not found');
          const manifest = await manifestResponse.json();
  
          const langSuffix = `.${language}.md`;
          const baseNames = [...new Set(manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, '')))];
  
          const fetchedItems = await Promise.all(
            baseNames.map(async baseName => {
              const langFile = `${baseName}${langSuffix}`;
              const defaultFile = `${baseName}.sl.md`;
              let file = langFile;
              let res = await limit(() => fetch(`/${contentPath}/${file}`, { signal }));
              if (!res.ok) { file = defaultFile; res = await limit(() => fetch(`/${contentPath}/${file}`, { signal })); } 
              if (!res.ok) return null;
  
              const text = await res.text();
              return { ...parseMarkdown(text), id: baseName };
            })
          );
  
          const validItems = fetchedItems.filter(Boolean);
          validItems.sort((a, b) => (a.metadata.date && b.metadata.date) ? new Date(b.metadata.date) - new Date(a.metadata.date) : 0);
          setItems(validItems);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error(`Error fetching ${contentPath}:`, err);
            setItems([]);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();

      return () => {
        controller.abort();
      };
    }, [contentPath, language]);

    useEffect(() => {
        if (isLoading) return;
        processedItems.forEach(item => {
            if (contentRef.current[item.id] && contentRef.current[item.id].innerHTML !== item.processedContent) {
                contentRef.current[item.id].innerHTML = item.processedContent;
                renderMermaid(contentRef.current[item.id]);
            }
        });
    }, [processedItems, isLoading]);
  
    if (isLoading) {
      return (
        <Section title={title}> 
          <div className="text-body text-center text-text-muted">{t('loading')}…</div>
        </Section>
      );
    }
  
    return (
      <Page title={title}> 
        <Section title={title}> 
          <div className="space-y-8 max-w-3xl mx-auto">
                        {processedItems.length ? processedItems.map(item => (
              <GlassCard key={item.id}> 
                {item.metadata.date && (
                  <p className="text-accent text-sm text-text-muted mb-1">
                    {new Date(item.metadata.date).toLocaleDateString(language)}
                  </p>
                )}
                <h3 className="heading-organic text-2xl text-primary mb-3">{item.metadata.title}</h3>
                
                {/* Single content render with Mermaid and video embeds */}
                <div
                  className="prose-organic max-w-none mb-4"
                  ref={node => {
                    if (node && !contentRef.current[item.id]) {
                        contentRef.current[item.id] = node;
                        node.innerHTML = item.processedContent;
                        renderMermaid(node);
                    }
                  }}
                />
  
                {item.metadata.tags && (
                  <div className="mt-4">
                    {item.metadata.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block bg-primary/10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            )) : (
              <p className="text-center text-text-muted">{t('noMoreObservations')}</p>
            )}
          </div>
        </Section>
      </Page>
    );
  }

const LazyImage = ({ src, srcSet, sizes, alt, className, layoutId }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className} style={{ position: 'relative', paddingBottom: '100%' }}>
            {isLoaded && (
                <motion.img
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layoutId={layoutId}
                />
            )}
        </div>
    );
};

function GalleryPage() {
    const { t, language } = useTranslation();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedGallery, setExpandedGallery] = useState(null);
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);
    const [hoveredGalleryItem, setHoveredGalleryItem] = useState(null);
    
    // Fetch galleries
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchGalleries = async () => {
          setIsLoading(true);
          try {
              const manifestResponse = await limit(() => fetch('/content/galleries/manifest.json', { signal }));
              if (!manifestResponse.ok) throw new Error('Gallery manifest not found');
              const manifest = await manifestResponse.json();
              const baseFileNames = [...new Set(
                  manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, ''))
              )];

              const fetchedGalleries = await Promise.all(
                  baseFileNames.map(async baseName => {
                      const langFile = `${baseName}.${language}.md`;
                      const defaultLangFile = `${baseName}.sl.md`;
                      let fileToFetch = langFile;
                      let res = await limit(() => fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`, { signal }));
                      
                      if (!res.ok) { fileToFetch = defaultLangFile; res = await limit(() => fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`, { signal })); } 
                      if (!res.ok) return null;

                      const text = await res.text();
                      const { metadata } = parseMarkdown(text);
                      return { id: baseName, ...metadata };
                  })
              );
              
              const validGalleries = fetchedGalleries.filter(gallery => 
                  gallery && gallery.images && gallery.images.length > 0
              ).sort((a, b) => new Date(b.date) - new Date(a.date));
              
              setGalleries(validGalleries);
          } catch (error) {
              if (error.name !== 'AbortError') {
                console.error("Failed to load galleries:", error);
                setGalleries([]);
              }
          } finally {
              setIsLoading(false);
          }
      };
      
      fetchGalleries();

      return () => {
        controller.abort();
      };
    }, [language]);

    const openImage = (gallery, imageIndex) => {
      setExpandedGallery(gallery);
      setExpandedImageIndex(imageIndex);
    };

    const closeImage = () => {
      setExpandedGallery(null);
      setExpandedImageIndex(null);
    };

    const goToPrev = () => {
      if (!expandedGallery || expandedImageIndex === null) return;
      const totalImages = expandedGallery.images.length;
      const prevIndex = (expandedImageIndex - 1 + totalImages) % totalImages;
      setExpandedImageIndex(prevIndex);
    };

    const goToNext = () => {
      if (!expandedGallery || expandedImageIndex === null) return;
      const totalImages = expandedGallery.images.length;
      const nextIndex = (expandedImageIndex + 1) % totalImages;
      setExpandedImageIndex(nextIndex);
    };

    // Preload images
    useEffect(() => {
      if (!expandedGallery || expandedImageIndex === null) return; 
      
      const { images } = expandedGallery;
      const totalImages = images.length;
      const nextIndex = (expandedImageIndex + 1) % totalImages;
      const prevIndex = (expandedImageIndex - 1 + totalImages) % totalImages;
      
      const preloadImage = (url) => {
        const img = new Image();
        img.src = url;
      };
      
      preloadImage(images[nextIndex].image);
      preloadImage(images[prevIndex].image);
    }, [expandedGallery, expandedImageIndex]);

    if (isLoading) {
      return (
        <Page title={t('navGallery')}> 
            <Section title={t('navGallery')}> 
                <div className="text-body text-center py-10 text-text-muted">{t('loading')}...</div>
            </Section>
        </Page>
      );
    }

    if (!isLoading && galleries.length === 0) {
        return (
            <Page title={t('navGallery')}> 
                <Section title={t('navGallery')}> 
                    <p className="text-body text-center text-text-muted">{t('noGalleriesAvailable')}</p>
                </Section>
            </Page>
        );
    }

    return (
        <Page title={t('navGallery')}> 
            <Section title={t('navGallery')}> 
                <div className="space-y-16 max-w-3xl mx-auto">
                    {galleries.map((gallery) => (
                        <article key={gallery.id}>
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-mono text-primary">{gallery.title}</h3>
                                {gallery.date && (
                                    <p className="text-sm text-text-muted mt-1">
                                        {new Date(gallery.date).toLocaleDateString(language, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                                {gallery.description && (
                                    <p className="prose mt-2 max-w-2xl mx-auto text-text-muted">
                                        {gallery.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {gallery.images.map((image, index) => {
                                    const caption = language === 'sl' 
                                        ? image.caption_sl 
                                        : (image.caption_en || image.caption_sl);
                                    
                                    return (
                                        <a
                                            key={`${gallery.id}-${index}`}
                                            className="relative group block p-2 h-full w-full"
                                            onMouseEnter={() => setHoveredGalleryItem(`${gallery.id}-${index}`)}
                                            onMouseLeave={() => setHoveredGalleryItem(null)}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openImage(gallery, index);
                                            }}
                                            layoutId={`gallery-${gallery.id}-${index}`}
                                        >
                                            <AnimatePresence>
                                                {hoveredGalleryItem === `${gallery.id}-${index}` && (
                                                    <motion.span
                                                        className="absolute inset-0 h-full w-full bg-[var(--ch-border)] block rounded-3xl opacity-70"
                                                        layoutId="hoverBackground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.7 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.15 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                            
                                            <motion.div 
                                              layoutId={`gallery-img-${gallery.id}-${index}`}
                                              className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden group relative text-left w-full h-full border-2 border-transparent group-hover:border-[var(--ch-border)]"
                                            >
                                                <LazyImage
                                                    src={getOptimizedImageUrl(image.image)}
                                                    srcSet={getResponsiveSrcSet(image.image)}
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    alt={caption || gallery.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                
                                                {(caption || gallery.author) && (
                                                    <div className="p-3 text-sm">
                                                        {caption && (
                                                            <p className="text-text-main line-clamp-2" title={caption}>
                                                                {caption}
                                                            </p>
                                                        )}
                                                        {gallery.author && (
                                                            <p className="text-xs text-text-muted mt-1 flex items-center">
                                                                <svg 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    className="h-4 w-4 mr-1.5 opacity-70"
                                                                    viewBox="0 0 20 20" 
                                                                    fill="currentColor"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path 
                                                                        fillRule="evenodd" 
                                                                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" 
                                                                        clipRule="evenodd" 
                                                                    />
                                                                </svg>
                                                                <span>
                                                                    {t('photoBy')}: {gallery.author}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        </a>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>

                {expandedGallery && expandedImageIndex !== null && (
                  <ExpandableCard
                    isExpanded={!!expandedGallery}
                    onToggle={(expanded) => {
                      if (!expanded) {
                        closeImage();
                      }
                    }}
                    layoutId={`gallery-${expandedGallery.id}-${expandedImageIndex}`}
                    expandedContent={
                      <GalleryExpandedContent
                        gallery={expandedGallery}
                        imageIndex={expandedImageIndex}
                        goToPrev={goToPrev}
                        goToNext={goToNext}
                        currentIndex={expandedImageIndex}
                        totalImages={expandedGallery.images.length}
                        t={t}
                        language={language}
                      />
                    }
                    className="relative group block p-2 h-full w-full"
                    expandedClassName="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-sm sm:rounded-3xl overflow-auto"
                    closeOnBackdropClick={true}
                    closeOnEscape={true}
                  />
                )}
            </Section>
        </Page>
    );
}

function MemoryGamePage() {
    const { t } = useTranslation();
    return (
      <Page title={t('navMemoryGame')}> 
        <Section title={t('memoryGameTitle')}> 
          <GlassCard className="max-w-3xl mx-auto">
            <MemoryGame />
          </GlassCard>
        </Section>
      </Page>
    );
  }

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
            <div className="w-full mt-12">
                <PracticesHero language={language} />
            </div>
            
            {/* Main Content */}
            <div className="bg-[var(--glass-bg)] backdrop-blur-sm rounded-t-3xl shadow-2xl -mt-16 pt-20 pb-16 border-t border-[var(--glass-border)]">
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
            <div className="w-full mt-12">
                <JoinHero language={language} />
            </div>
        </Page>
    );
}

// --- Main App Component ---
function App() {
    const { t, setLanguage, language } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                primaryColor: '#4a7c59',
                primaryTextColor: '#1a1f1a',
                primaryBorderColor: '#4a7c59',
                lineColor: '#4a7c59',
                secondaryColor: '#6aa87a',
                tertiaryColor: '#e8f5e9'
            }
        });
    }, []); // Empty dependency array means it runs once on mount

    const pages = [
        { path: '/', label: t('navHome'), element: <HomePage /> },
        { path: '/prepletanja', label: t('navProjects'), element: <ProjectsPage /> },
        { path: '/zapisi', label: t('navPosts'), element: <ContentCollectionPage t={t} title={t('navPosts')} contentPath="content/posts" /> },
        { path: '/utelesenja', label: t('navPractices'), element: <ContentCollectionPage t={t} title={t('navPractices')} contentPath="content/practices" /> },
        { path: '/biodiverziteta', label: t('navBiodiversity'), element: <BiodiversityPage /> },
        { path: '/galerija', label: t('navGallery'), element: <GalleryPage /> },
        { path: '/koledar', label: t('navCalendar'), element: <CalendarPage /> },
        { path: '/spomin', label: t('navMemoryGame'), element: <MemoryGamePage /> },
      ];
      
    return (
        <div className="relative flex flex-col min-h-screen">
          <Navbar className="sticky top-0 z-50">
            {/* Desktop Navigation */}
            <NavBody>
              <NavbarLogo />
              <NavItems items={pages} />
              <div className="flex items-center space-x-1">
                <NavbarButton onClick={() => setLanguage('sl')} className={`text-accent px-3 py-2 font-semibold transition-all duration-300 rounded-lg text-interactive hover:bg-primary/10 ${language === 'sl' ? 'text-primary bg-primary/5 shadow-sm' : 'text-text-muted hover:text-primary'}`}>SL</NavbarButton>
                <NavbarButton onClick={() => setLanguage('en')} className={`text-accent px-3 py-2 font-semibold transition-all duration-300 rounded-lg text-interactive hover:bg-primary/10 ${language === 'en' ? 'text-primary bg-primary/5 shadow-sm' : 'text-text-muted hover:text-primary'}`}>EN</NavbarButton>
              </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
              </MobileNavHeader>

              <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                {pages.map((item, idx) => (
                  <NavLink
                    key={`mobile-link-${idx}`}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `nav-text block px-4 py-3 rounded-lg text-base transition-all duration-300 text-sage ${isActive ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary font-semibold border border-primary/20' : 'hover:bg-bg-main/80 hover:text-primary'}`}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="flex justify-center space-x-3 pt-4 border-t border-border-color/50 mt-4">
                  <NavbarButton onClick={() => { setLanguage('sl'); setIsMobileMenuOpen(false); }} className={`text-accent px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${language === 'sl' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-muted hover:text-primary hover:bg-bg-main/80'}`}>Slovenščina</NavbarButton>
                  <NavbarButton onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`text-accent px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${language === 'en' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-text-muted hover:text-primary hover:bg-bg-main/80'}`}>English</NavbarButton>
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Routes location={location}> 
                                {pages.map(page => ( <Route key={page.path} path={page.path} element={page.element} /> ))}
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </main>
                <footer className="py-8 text-center bg-gradient-to-t from-bg-main/90 to-transparent backdrop-blur-sm border-t border-border-color/30">
                    <div className="container mx-auto text-body text-text-muted">{t('footerText')}</div>
                </footer>
            </div> 
    );
}

export { useHistoricalSensorData, useTranslation, BED_MAPPING, getOptimizedImageUrl };


export default function WrappedApp() {
    return (
        <LanguageProvider>
            <SensorProvider>
                <BrowserRouter>
                                    
                    <App />
                </BrowserRouter>
            </SensorProvider>
        </LanguageProvider>
    );
}