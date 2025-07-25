import React, { useState, useEffect, useMemo, createContext, useContext, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import { marked } from 'marked';
import { parse } from 'yaml';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';

// --- Animated Background Component ---

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;
        const waves = [
            { amplitude: 25, frequency: 0.02, speed: 0.001, yOffset: 0.45, color: 'rgba(74, 124, 89, 0.15)' },
            { amplitude: 30, frequency: 0.015, speed: -0.0015, yOffset: 0.5, color: 'rgba(74, 124, 89, 0.1)' },
            { amplitude: 25, frequency: 0.01, speed: 0.0008, yOffset: 0.55, color: 'rgba(74, 124, 89, 0.05)' },
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 1;
            const gradientAlpha = 0.1 + Math.sin(time * 0.005) * 0.06;
            const skyGradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
            
            skyGradient.addColorStop(0, `rgba(74, 124, 89, ${gradientAlpha})`); // Top color (greenish)
            skyGradient.addColorStop(1, `rgba(247, 146, 5, 0.69)`); // Bottom color (subtle orange accent)        
            waves.forEach((wave) => {
                ctx.fillStyle = wave.color; 
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude + canvas.height * wave.yOffset;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fill();
            });

            const topWave = waves[1];
            ctx.fillStyle = skyGradient; 
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * topWave.frequency + time * topWave.speed) * topWave.amplitude + canvas.height * topWave.yOffset;
                    ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fill();


            animationFrameId = requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        animate();
        
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: '#f7faf9' }} />;
};

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
    '!35c2d45c-0': { name: 'travni sestoj', color: '#52796f' },
    '!35c2d45c-1': { name: 'sivka in melisa', color: '#84a98c' },
    
    '!04c5ad60-0': { name: 'barjansko rastje', color: '#354f52' },
    '!04c5ad60-1': { name: 'cvetlice za opraševalce', color: '#cad2c5' },

    '!76208ba5-0': { name: 'majaron in melisa', color: '#90a955' },
    '!76208ba5-1': { name: 'tolščak in slezenovec', color: '#606c38' },
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

// 1️⃣  Mermaid 
mermaid.initialize({ startOnLoad: false, theme: 'base' });

// 2️⃣  Custom short-code renderer
function enhanceHTML(html) {
  return html
    // :::details Title↵↵content↵:::
    .replace(/:::details\s+(.+?)\n([\s\S]*?)\n:::/g, '<details><summary>$1</summary><div class="mt-2">$2</div></details>')
    // {{youtube ID}}
    .replace(/{{youtube\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>`)
    // {{vimeo ID}}
    .replace(/{{vimeo\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div>`);
}

/* ---------- Calendar helper component ---------- */
const EventRow = ({ event, lang, isPast }) => {
    const fmt = (d) =>
      d.toLocaleString(lang, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
  
    return (
      <li
        className={`p-3 rounded-lg shadow-sm ${
          isPast ? 'bg-gray-100 opacity-70' : 'bg-primary/5'
        }`}
      >
        <div className="font-semibold text-sm">{event.summary}</div>
        <div className="text-xs text-gray-500 mt-1">{fmt(event.startDate)}</div>
        {event.location && (
          <div className="text-xs text-gray-500 mt-1">📍 {event.location}</div>
        )}
        {event.description && (
          <div className="text-xs text-gray-700 mt-2 whitespace-pre-wrap break-words">
            {event.description}
          </div>
        )}
      </li>
    );
  };
  
// --- Contexts ---

const SensorContext = createContext();
const useSensorData = () => useContext(SensorContext);

const SensorProvider = ({ children }) => {
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const response = await fetch(`/history.json?t=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            
            const processedHistory = {};
            for (const key in data) {
                if (Array.isArray(data[key])) {
                    processedHistory[key] = data[key].map(point => ({
                        ...point,
                        x: new Date(point.x)
                    }));
                }
            }
            setHistory(processedHistory);
            setStatus({ key: 'dataUpdated', type: 'success' });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Could not fetch history:", error);
            setStatus({ key: 'fetchError', type: 'error' });
            setHistory({});
        }
    }, []);

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
        moistureFlows: 'Vlaga v zraku in prsti',
        temperatureFlows: 'Temperatura zraka in prsti',
        time: 'Čas',
        temperature: 'temperatura',
        soilMoisture: 'vlaga v prsti',
        soilTemp: 'temperatura prsti',
        airTemp: 'temperatura zraka',
        airHumidity: 'vlaga v zraku',
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
        moistureFlows: 'Moisture Flows',
        temperatureFlows: 'Temperature Flows',
        time: 'Time',
        temperature: 'Temperature',
        soilMoisture: 'soil moisture',
        soilTemp: 'soil temperature',
        airTemp: 'Air Temperature',
        airHumidity: 'Air Humidity',
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
        player: 'Player',
        score: 'Score',
        newGame: 'New Game',
        noScores: 'No scores yet',
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
        <div className="bg-gray-100/70 p-3 rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{displayValue}<span className="text-base text-gray-500 ml-1">{unit}</span></div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">{label}</div>
        </div>
    );
};
const BedCard = ({ bed, reading, t }) => {
    const lastHeard = reading ? new Date(reading.timestamp) : null;
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: bed.color, color: 'white' }}>
                <h4 className="font-bold text-lg">{bed.name}</h4>
            </div>
            <div className="p-4 space-y-4 flex-grow">
                {reading ? (
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard label={t('soilMoisture')} value={reading.moisture} unit="%" decimals={1} />
                        <MetricCard label={t('soilTemp')} value={reading.temperature} unit="°C" decimals={1} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">{t('noSensorData')}</div>
                )}
            </div>
            {lastHeard && (
                <div className="bg-gray-50/70 p-2 text-xs text-gray-500 flex justify-end items-center">
                    <span>{t('lastUpdated')}: {lastHeard.toLocaleString(t.language)}</span>
                </div>
            )}
        </div>
    );
};

const ChartWrapper = ({ title, children }) => (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-inner h-[400px] flex flex-col">
        <h4 className="font-semibold text-gray-700 mb-2 text-center">{title}</h4>
        <div className="flex-grow">{children}</div>
    </div>
);

function SensorVisualization() {
    const { t, language } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });
    const [latestReadings, setLatestReadings] = useState({});

    const nivoTheme = {
        axis: { ticks: { text: { fill: '#333' } }, legend: { text: { fill: '#333', fontSize: 14 } } },
        grid: { line: { stroke: '#e0e0e0', strokeDasharray: '2 2' } },
        tooltip: { container: { background: 'white', color: '#333', border: '1px solid #ccc' } },
    };

    const CustomTooltip = ({ point }) => {
        const date = new Date(point.data.x);
        const formattedDate = date.toLocaleString(language, {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        return (
            <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'block', width: '12px', height: '12px', background: point.serieColor, marginRight: '8px' }}></span>
                    <strong>{point.serieId}</strong>
                </div>
                <div>{formattedDate}</div>
                <div>{`${point.data.yFormatted}`}</div>
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
        <div className="relative p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-gray-50/80 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <h3 className="text-2xl font-mono text-primary"> {t('sensorDataTitle')} </h3>
                <div className="flex items-center gap-4">
                    <span className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{getStatusMessage()}</span>
                    <button onClick={refreshData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                        <span>{isLoading ? t('loading') : t('refreshData')}</span>
                    </button>
                </div>
            </div>

            {isLoading && !history ? (
                 <div className="text-center py-20 text-gray-500">{t('loading')}...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                            <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8 pt-6 border-t">
                        <ChartWrapper title={t('moistureFlows')}>
                            {hasMoistureData ? (
                                <ResponsiveLine tooltip={CustomTooltip} data={chartData.moisture} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 120, left: 70 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: 'Vlaga (%)', legendOffset: -50 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 80, itemsSpacing: 4, itemWidth: 180, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
                            ) : ( <div className="flex items-center justify-center h-full text-gray-500">{t('noChartData')}</div> )}
                        </ChartWrapper>
                        <ChartWrapper title={t('temperatureFlows')}>
                            {hasTemperatureData ? (
                                <ResponsiveLine tooltip={CustomTooltip} data={chartData.temperature} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 120, left: 70 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: `${t('temperature')} (°C)`, legendOffset: -50 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 80, itemsSpacing: 4, itemWidth: 180, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
                            ) : ( <div className="flex items-center justify-center h-full text-gray-500">{t('noChartData')}</div> )}
                        </ChartWrapper>
                    </div>
                </>
            )}
        </div>
    );
}

const INaturalistFeed = ({ projectSlug }) => {
    const [observations, setObservations] = useState([]);
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();

    const fetchObservations = useCallback(async (pageNum) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.inaturalist.org/v1/observations?project_id=${projectSlug}&per_page=18&page=${pageNum}&order_by=observed_on&order=desc&locale=${language}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setObservations(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
            if (data.results.length < 18) {
                setCanLoadMore(false);
            }
        } catch (err) {
            console.error("iNaturalist fetch error:", err);
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

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {observations.map(obs => {
                    const displayName = obs.taxon?.preferred_common_name || obs.taxon?.name || "Unknown";
                    return (
                        <a href={obs.uri} key={obs.id} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden group block">
                            <div className="relative aspect-square bg-gray-200">
                                <img src={obs.photos[0]?.url.replace('square', 'medium')} alt={displayName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/2d3748/a0aec0?text=Ni+slike`; }}/>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-sm text-primary truncate" title={displayName}>{displayName}</h3>
                                <p className="text-xs text-gray-500">{new Date(obs.observed_on_string).toLocaleDateString(language)}</p>
                            </div>
                        </a>
                    )
                })}
            </div>
            <div className="text-center mt-8">
                {canLoadMore && (
                    <button onClick={handleLoadMore} disabled={isLoading} className="bg-primary/90 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary transition-colors disabled:bg-gray-400">
                        {isLoading ? t('loading') : t('loadMore')}
                    </button>
                )}
            </div>
        </div>
    );
}

const CalendarFeed = ({ icsUrl, calendarUrl }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();
  
    /* -------- month navigation -------- */
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
  
    const changeMonth = (delta) => {
      const d = new Date(viewYear, viewMonth + delta, 1);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    };
  
    /* -------- fetch & parse -------- */
    useEffect(() => {
        const parseICS = (icsText) => {
          const blocks = icsText.split('BEGIN:VEVENT');
          blocks.shift();
          const parsed = [];
      
          for (const block of blocks) {
            const summary  = (block.match(/^SUMMARY:(.*)/m)?.[1] ?? '').trim();
            const location = (block.match(/^LOCATION:(.*)/m)?.[1] ?? '').trim().replace(/\\,/g, ',');
            const uid      = (block.match(/^UID:(.*)/m)?.[1] ?? '').trim();
      
            let description = '';
            const descStart = block.search(/^DESCRIPTION:/im);
            if (descStart !== -1) {
              description = block
                .slice(descStart + 12)               // +12 skips "DESCRIPTION:" + the colon
                .split(/\r?\n/)
                .reduce((a, l) => (/^[\t ]/.test(l) ? a + l.trimStart() : /^[A-Z-]+:/.test(l) ? a + '\0' : a + l), '')
                .split('\0')[0]
                .replace(/\\(.)/g, '$1')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

              if (description.length > 200) {
                description = description.slice(0, 200).split('\n').slice(0, 3).join('\n').replace(/\s+$/, '') + '…';
              }
            }
      
            const dt = block.match(/DTSTART(?:;TZID=[^:]*)?:(.*)/);
            if (!dt) continue;
            const raw = dt[1].trim();
            const startDate = new Date(Date.UTC(
              +raw.slice(0, 4),
              +raw.slice(4, 6) - 1,
              +raw.slice(6, 8),
              raw.length > 8 ? +raw.slice(9, 11) : 0,
              raw.length > 8 ? +raw.slice(11, 13) : 0
            ));
            parsed.push({ uid, summary, description, location, startDate });
          }
      
          return parsed.sort((a, b) => +a.startDate - +b.startDate);
        };
      
        const proxy = 'https://api.allorigins.win/raw?url=';
        fetch(proxy + encodeURIComponent(icsUrl))
          .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
          .then(t => setEvents(parseICS(t)))
          .catch(e => console.error('ICS error:', e))
          .finally(() => setIsLoading(false));
      }, [icsUrl]);
  
    /* -------- events for the current month -------- */
    const currentMonthEvents = useMemo(() => {
      const monthStart = new Date(viewYear, viewMonth, 1);
      const monthEnd = new Date(viewYear, viewMonth + 1, 1);
  
      return events.filter(
        (e) => e.startDate >= monthStart && e.startDate < monthEnd
      );
    }, [events, viewYear, viewMonth]);
  
    if (isLoading) return <div className="text-center">{t('loading')}...</div>;
  
    const monthName = new Date(viewYear, viewMonth).toLocaleString(language, {
      month: 'long',
      year: 'numeric',
    });
  
    return (
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        {/* month switcher */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &larr;
          </button>
          <span className="font-bold text-lg">{monthName}</span>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &rarr;
          </button>
        </div>
  
        <ul className="space-y-4">
          {currentMonthEvents.map((e) => (
            <EventRow key={e.uid} event={e} lang={language} />
          ))}
          {currentMonthEvents.length === 0 && (
            <p className="text-center text-gray-500">{t('noUpcomingEvents')}</p>
          )}
        </ul>
  
        {/* link to Google Calendar */}
        <div className="mt-6 text-center">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {t('openInGoogleCalendar')}
          </a>
        </div>
      </div>
    );
  }; 

// --- Page Components ---
function Page({ title, children }) {
    useEffect(() => { document.title = `${title} | Biotop Livada`; }, [title]);
    return <div>{children}</div>;
}

function Section({ title, children, className = '' }) {
    return (
        <section className={`container mx-auto px-4 py-12 ${className}`}>
            <h2 className="text-3xl font-mono mb-8 text-center text-primary">{title}</h2>
            <div className="relative z-10">{children}</div>
        </section>
    );
}

function MemoryGame() {
    const { t } = useTranslation();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameMode, setGameMode] = useState('sl');
  
    const resetGame = (mode = gameMode) => {
      setGameMode(mode);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
    };
  
    /* ---------- fetch cards ---------- */
    useEffect(() => {
      const fetchCards = async () => {
        setLoading(true);
        const localeParam = gameMode !== 'latin' ? `&locale=${gameMode}` : '';
        try {
          const res = await fetch(
            `https://api.inaturalist.org/v1/observations?project_id=the-livada-biotope-monitoring&per_page=12&quality_grade=research&order_by=random${localeParam}`
          );
          const data = await res.json();
          const observations = data.results.filter(o => o.photos?.length);
          const newCards = observations.flatMap(obs => [
            {
              id: `${obs.id}-img`,
              type: 'image',
              content: obs.photos[0].url.replace('square', 'medium'),
              organismId: obs.id
            },
            {
              id: `${obs.id}-txt`,
              type: 'text',
              content: (() => {
                switch(gameMode) {
                  case 'sl':
                    return (obs.taxon?.preferred_common_name || obs.taxon?.name || 'Unknown').toLowerCase();
                  case 'latin':
                    return obs.taxon?.name || 'Unknown'; // Always use scientific name for latin mode
                  default:
                    return obs.taxon?.preferred_common_name || obs.taxon?.name || 'Unknown';
                }
              })(),
              organismId: obs.id
            }
          ]);
          setCards(newCards.sort(() => Math.random() - 0.5));
        } catch {
          setCards([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCards();
    }, [gameMode]);
  
    /* ---------- click handler ---------- */
    const handleCardClick = idx => {
      // Don't allow clicking already matched or flipped cards
      if (matched.includes(idx) || flipped.includes(idx) || flipped.length >= 2) return;
      
      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);
      
      // If this is the second card flipped
      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        const [firstIdx, secondIdx] = newFlipped;
        const isMatch = cards[firstIdx].organismId === cards[secondIdx].organismId && 
                       cards[firstIdx].type !== cards[secondIdx].type;
        
        if (isMatch) {
          // Add both cards to matched and clear flipped state
          setMatched(prev => [...new Set([...prev, ...newFlipped])]);
          setFlipped([]);
        } else {
          // Only reset flip state for non-matches after a delay
          setTimeout(() => setFlipped([]), 1200);
        }
      }
    };
  
    /* ---------- render ---------- */
    if (loading) return <div className="max-w-6xl mx-auto text-center py-12">{t('loading')}...</div>;
  
    return (
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-mono font-bold text-primary">{t('memoryGameTitle')}</h3>
          <p className="text-gray-600">{t('moves')}: {moves}</p>
          <div className="flex justify-center gap-2 md:gap-4 mt-4">
            {['sl', 'en', 'latin'].map(m => (
              <button
                key={m}
                onClick={() => resetGame(m)}
                className={`px-3 py-2 rounded-lg transition ${gameMode === m ? 'bg-primary text-white shadow' : 'bg-gray-200'}`}
              >
                {t(m === 'sl' ? 'slovenian' : m === 'en' ? 'english' : 'latin')}
              </button>
            ))}
          </div>
        </div>
          /* ---------- card grid ---------- */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {cards.map((card, idx) => {
              const isFlipped = flipped.includes(idx);
              const isMatched = matched.includes(idx);
              const showFront = isFlipped || isMatched;
              
              // If card is matched, render it in a fixed face-up state with consistent styling
              if (isMatched) {
                return (
                  <div 
                    key={card.id}
                    className="relative w-full aspect-square"
                    style={{
                      opacity: 0.8,
                      zIndex: 1,
                      transform: 'rotateY(180deg) scale(1)',
                      transformStyle: 'preserve-3d',
                      WebkitTransformStyle: 'preserve-3d',
                      position: 'relative',
                      perspective: '1000px',
                      transition: 'opacity 0.3s, transform 0.5s',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="absolute inset-0 bg-white flex items-center justify-center p-2 rounded-lg overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        transformStyle: 'preserve-3d',
                        zIndex: 2,
                        pointerEvents: 'none'
                      }}
                    >
                      {card.type === 'image' ? (
                        <img
                          src={card.content}
                          alt=""
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-sm font-medium text-center">
                          {card.content}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
              
              // For non-matched cards, render with flip animation
              return (
                <motion.div
                  key={card.id}
                  className="relative w-full aspect-square cursor-pointer"
                  onClick={() => handleCardClick(idx)}
                  initial={false}
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                    scale: isFlipped ? 1.6 : 1,
                    zIndex: isFlipped ? 10 : 1
                  }}
                  transition={{
                    rotateY: { duration: 0.5 },
                    scale: { duration: 0.3 }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    position: 'relative',
                    perspective: '1000px',
                    transform: 'rotateY(0deg)'
                  }}
                >
                  {/* back */}
                  <div
                    className="absolute inset-0 bg-primary/10 rounded-lg shadow-md flex items-center justify-center overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)'
                    }}
                  >
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                      <defs>
                        <pattern id="cardPattern" patternUnits="userSpaceOnUse" width="25" height="25" patternTransform="rotate(45)">
                          <circle cx="5" cy="5" r="1.5" fill="#f6ad55" />
                          <circle cx="15" cy="15" r="2" fill="#84a98c" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#cardPattern)" />
                    </svg>
                  </div>
  
                  {/* front (photo or text) */}
                  <div
                    className="absolute inset-0 bg-white flex items-center justify-center p-2 rounded-lg overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 2,
                      pointerEvents: 'none'
                    }}
                  >
                    {card.type === 'image' ? (
                      <img
                        src={card.content}
                        alt=""
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-sm font-medium text-center">
                        {card.content}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
      </div>
    );
  }

function ProjectsPage() {
    const { t, language } = useTranslation();
    const [pageData, setPageData] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchContent = async () => {
            const langFile = `/content/pages/intertwinings.${language}.md?v=${new Date().getTime()}`;
            const defaultLangFile = `/content/pages/intertwinings.sl.md?v=${new Date().getTime()}`;
            
            try {
                let response = await fetch(langFile);
                if (!response.ok) { response = await fetch(defaultLangFile); }
                if (!response.ok) { throw new Error('Intertwinings content file not found'); }
                const text = await response.text();
                const { metadata, content } = parseMarkdown(text);
                setPageData({ title: metadata.title || t('navProjects'), content: content });
            } catch (error) {
                console.error("Failed to fetch page content, using fallback:", error);
                setPageData({ title: t('navProjects'), content: t('projectFutureDesc') });
            }
        };

        fetchContent();
    }, [t, language]);

    return (
        <Page title={pageData.title}>
            <Section title={pageData.title}>
                { /* CHANGE: Updated prose classes for better styling */ }
                <div 
                    className="prose max-w-3xl mx-auto text-gray-700 
                               [&_h2]:text-2xl [&_h2]:font-mono [&_h2]:text-primary 
                               prose-li:[&_li::before]:bg-primary"
                    dangerouslySetInnerHTML={{ __html: marked(pageData.content || '') }} 
                />
                <SensorVisualization />
            </Section>
        </Page>
    );
}

function BiodiversityPage() {
    const { t } = useTranslation();
    return (
        <Page title={t('navBiodiversity')}>
            <Section title={t('biodiversityTitle')}>
                <p className="mb-8 text-lg text-gray-600 max-w-3xl mx-auto text-center">{t('biodiversityDesc')}</p>
                <INaturalistFeed projectSlug="the-livada-biotope-monitoring" />
            </Section>
        </Page>
    );
}

function CalendarPage() {
    const { t } = useTranslation();
    return (
        <Page title={t('navCalendar')}>
            <Section title={t('calendarTitle')}>
                <p className="mb-8 text-lg text-gray-600 max-w-3xl mx-auto text-center">{t('calendarDesc')}</p>
                <CalendarFeed icsUrl="https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics"
                calendarUrl="https://calendar.google.com/calendar/embed?src=c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com&ctz=Europe%2FBelgrade"/>
            </Section>
        </Page>
    );
}

function ContentCollectionPage({ t, title, contentPath }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { language } = useTranslation();
  
    useEffect(() => {
      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const manifestResponse = await fetch(`/${contentPath}/manifest.json`);
          if (!manifestResponse.ok) throw new Error('Manifest not found');
          const manifest = await manifestResponse.json();
  
          const langSuffix = `.${language}.md`;
          const baseNames = [...new Set(manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, '')))];
  
          const fetchedItems = await Promise.all(
            baseNames.map(async baseName => {
              const langFile = `${baseName}${langSuffix}`;
              const defaultFile = `${baseName}.sl.md`;
              let file = langFile;
              let res = await fetch(`/${contentPath}/${file}`);
              if (!res.ok) { file = defaultFile; res = await fetch(`/${contentPath}/${file}`); }
              if (!res.ok) return null;
  
              const text = await res.text();
              return { ...parseMarkdown(text), id: baseName };
            })
          );
  
          const validItems = fetchedItems.filter(Boolean);
          validItems.sort((a, b) => (a.metadata.date && b.metadata.date) ? new Date(b.metadata.date) - new Date(a.metadata.date) : 0);
          setItems(validItems);
        } catch (err) {
          console.error(`Error fetching ${contentPath}:`, err);
          setItems([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();
    }, [contentPath, language]);
  
    useEffect(() => {
      if (items.length) mermaid.initialize({ startOnLoad: false, theme: 'base' });
    }, [items]);
  
    if (isLoading) {
      return (
        <Section title={title}>
          <div className="text-center">{t('loading')}…</div>
        </Section>
      );
    }
  
    return (
      <Page title={title}>
        <Section title={title}>
          <div className="space-y-8 max-w-3xl mx-auto">
            {items.length ? items.map(item => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                {item.metadata.date && (
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(item.metadata.date).toLocaleDateString(language)}
                  </p>
                )}
                <h3 className="text-2xl font-mono text-primary mb-3">{item.metadata.title}</h3>
  
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      let html = marked.parse(item.content);
                      html = enhanceHTML(html);
                      return html;
                    })()
                  }}
                  ref={node => {
                    if (!node) return;
                    node.querySelectorAll('.language-mermaid').forEach(pre => {
                      const graph = pre.textContent;
                      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                      pre.parentNode.replaceChild(
                        Object.assign(document.createElement('div'), { id, className: 'mermaid mb-4' }),
                        pre
                      );
                      mermaid.render(id, graph).then(({ svg }) => {
                        document.getElementById(id).innerHTML = svg;
                      });
                    });
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
              </div>
            )) : (
              <p className="text-center text-gray-500">{t('noMoreObservations')}</p>
            )}
          </div>
        </Section>
      </Page>
    );
  }

function GalleryPage() {
    const { t, language } = useTranslation();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const overlayRef = useRef(null);
    
    // Fetch galleries
    useEffect(() => {
        const fetchGalleries = async () => {
            setIsLoading(true);
            try {
                const manifestResponse = await fetch('/content/galleries/manifest.json');
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
                        let res = await fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`);
                        
                        if (!res.ok) { 
                            fileToFetch = defaultLangFile; 
                            res = await fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`); 
                        }
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
                console.error("Failed to load galleries:", error);
                setGalleries([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchGalleries();
    }, [language]);

    // Handle image click with animation
    const openImage = (gallery, imageIndex, event) => {
        const clickedElement = event.currentTarget;
        const rect = clickedElement.getBoundingClientRect();
        
        setClickedImage({
            element: clickedElement,
            rect: {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            }
        });
        
        requestAnimationFrame(() => {
            setSelectedImage({ gallery, imageIndex });
            document.body.style.overflow = 'hidden';
            document.documentElement.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        });
    };

    const closeImage = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
        document.documentElement.style.paddingRight = '';
    };

    useEffect(() => {
        if (!selectedImage) return;

        const handleKeyDown = (e) => {
            const { gallery, imageIndex } = selectedImage;
            const totalImages = gallery.images.length;
            
            switch (e.key) {
                case 'Escape':
                    closeImage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = (imageIndex - 1 + totalImages) % totalImages;
                    setSelectedImage({ gallery, imageIndex: prevIndex });
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (imageIndex + 1) % totalImages;
                    setSelectedImage({ gallery, imageIndex: nextIndex });
                    break;
                default:
                    break;
            }
        };

        const handleClickOutside = (e) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target)) {
                closeImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedImage]);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || !selectedImage) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe || isRightSwipe) {
            const { gallery, imageIndex } = selectedImage;
            const totalImages = gallery.images.length;
            
            if (isLeftSwipe) {
                const nextIndex = (imageIndex + 1) % totalImages;
                setSelectedImage({ gallery, imageIndex: nextIndex });
            } else {
                const prevIndex = (imageIndex - 1 + totalImages) % totalImages;
                setSelectedImage({ gallery, imageIndex: prevIndex });
            }
        }
    };

    useEffect(() => {
        if (!selectedImage) return;
        
        const { gallery, imageIndex } = selectedImage;
        const totalImages = gallery.images.length;
        const nextIndex = (imageIndex + 1) % totalImages;
        const prevIndex = (imageIndex - 1 + totalImages) % totalImages;
        
        const preloadImage = (url) => {
            const img = new Image();
            img.src = url;
        };
        
        preloadImage(gallery.images[nextIndex].image);
        preloadImage(gallery.images[prevIndex].image);
    }, [selectedImage]);

    if (isLoading) {
        return (
            <Page title={t('navGallery')}>
                <Section title={t('navGallery')}>
                    <div className="text-center py-10">{t('loading')}...</div>
                </Section>
            </Page>
        );
    }

    if (!isLoading && galleries.length === 0) {
        return (
            <Page title={t('navGallery')}>
                <Section title={t('navGallery')}>
                    <p className="text-center text-gray-500">{t('noGalleriesAvailable')}</p>
                </Section>
            </Page>
        );
    }

    return (
        <Page title={t('navGallery')}>
            <Section title={t('navGallery')}>
                <div className="space-y-16">
                    {galleries.map((gallery) => (
                        <article key={gallery.id}>
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-mono text-primary">{gallery.title}</h3>
                                {gallery.date && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(gallery.date).toLocaleDateString(language, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                                {gallery.description && (
                                    <p className="prose mt-2 max-w-2xl mx-auto text-gray-600">
                                        {gallery.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.images.map((image, index) => {
                                    const caption = language === 'sl' 
                                        ? image.caption_sl 
                                        : (image.caption_en || image.caption_sl);
                                    
                                    return (
                                        <motion.div 
                                            key={`${gallery.id}-${index}`}
                                            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden group cursor-zoom-in relative"
                                            onClick={(e) => openImage(gallery, index, e)}
                                            layoutId={`gallery-${gallery.id}-${index}`}
                                            initial={false}
                                            whileHover={{ 
                                                scale: 1.02,
                                                transition: { type: 'spring', stiffness: 400, damping: 10 }
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        >
                                            <div className="relative pb-[100%]">
                                                <motion.img 
                                                    src={getOptimizedImageUrl(image.image)} 
                                                    srcSet={getResponsiveSrcSet(image.image)}
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    alt={caption || gallery.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => { 
                                                        e.target.onerror = null; 
                                                        e.target.src = image.image;
                                                    }}
                                                    initial={false}
                                                    layoutId={`gallery-img-${gallery.id}-${index}`}
                                                />
                                            </div>
                                            
                                            {(caption || gallery.author) && (
                                                <div className="p-3 text-sm">
                                                    {caption && (
                                                        <p className="text-gray-700 line-clamp-2" title={caption}>
                                                            {caption}
                                                        </p>
                                                    )}
                                                    {gallery.author && (
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
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
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeImage}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <motion.div 
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />

                            <div 
                                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
                                onClick={e => e.stopPropagation()}
                            >
                                <motion.button
                                    className="absolute -top-12 right-0 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeImage();
                                    }}
                                    aria-label={t('close')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-8 w-8" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M6 18L18 6M6 6l12 12" 
                                        />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex = (selectedImage.imageIndex - 1 + selectedImage.gallery.images.length) % 
                                                      selectedImage.gallery.images.length;
                                        setSelectedImage({...selectedImage, imageIndex: newIndex});
                                    }}
                                    aria-label={t('previous')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-8 w-8" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15 19l-7-7 7-7" 
                                        />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex = (selectedImage.imageIndex + 1) % 
                                                      selectedImage.gallery.images.length;
                                        setSelectedImage({...selectedImage, imageIndex: newIndex});
                                    }}
                                    aria-label={t('next')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-8 w-8" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M9 5l7 7-7 7" 
                                        />
                                    </svg>
                                </motion.button>

                                {/* Image Counter */}
                                <motion.div
                                    className="absolute -top-10 left-0 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                >
                                    {selectedImage.imageIndex + 1} / {selectedImage.gallery.images.length}
                                </motion.div>

                                {/* Image Container */}
                                <motion.div
                                    className="relative w-full h-full flex items-center justify-center"
                                    layoutId={`gallery-${selectedImage.gallery.id}-${selectedImage.imageIndex}`}
                                    initial={false}
                                    transition={{ 
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.5
                                    }}
                                >
                                    <motion.img
                                        src={selectedImage.gallery.images[selectedImage.imageIndex].image}
                                        alt=""
                                        className="max-h-[85vh] w-auto mx-auto object-contain pointer-events-none"
                                        loading="eager"
                                        layoutId={`gallery-img-${selectedImage.gallery.id}-${selectedImage.imageIndex}`}
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.5
                                        }}
                                    />

                                    {/* Caption */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12 text-white"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    >
                                        <p className="text-lg font-medium">
                                            {language === 'sl'
                                                ? selectedImage.gallery.images[selectedImage.imageIndex].caption_sl
                                                : selectedImage.gallery.images[selectedImage.imageIndex].caption_en ||
                                                  selectedImage.gallery.images[selectedImage.imageIndex].caption_sl}
                                        </p>
                                        {selectedImage.gallery.author && (
                                            <p className="text-sm opacity-90 mt-1 flex items-center">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-4 w-4 mr-1.5" 
                                                    viewBox="0 0 20 20" 
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path 
                                                        fillRule="evenodd" 
                                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                                                        clipRule="evenodd" 
                                                    />
                                                </svg>
                                                <span>{t('photoBy')}: {selectedImage.gallery.author}</span>
                                            </p>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Section>
        </Page>
    );
}

function MemoryGamePage() {
    const { t } = useTranslation();
    return (
      <Page title={t('navMemoryGame')}>
        <Section title={t('memoryGameTitle')}>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <MemoryGame />
          </div>
        </Section>
      </Page>
    );
  }

function HomePage() {
    const { t, language } = useTranslation();
    const [pageData, setPageData] = useState({ content: '', metadata: {} });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            const langFile = `/content/pages/home.${language}.md?v=${new Date().getTime()}`;
            const defaultLangFile = `/content/pages/home.sl.md?v=${new Date().getTime()}`;
            
            try {
                let response = await fetch(langFile);
                if (!response.ok) { response = await fetch(defaultLangFile); }
                if (!response.ok) { throw new Error('Home page content file not found at ' + langFile + ' or ' + defaultLangFile); }
                const text = await response.text();
                const { metadata, content } = parseMarkdown(text);
                setPageData({ content, metadata });
            } catch (error) {
                console.error("Failed to fetch home page content:", error);
                const defaultContent = language === 'sl' 
                    ? '### Dobrodošli na livada.bio\n\nTo je prostor za urejanje vsebine. Uredite datoteko `/content/pages/home.sl.md`.'
                    : '### Welcome to livada.bio\n\nThis is a placeholder. Edit the file `/content/pages/home.en.md` to change this content.';
                setPageData({ content: defaultContent, metadata: {} });
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [language]);

    const title = pageData.metadata.title || t('navHome');
    const heroTitle = pageData.metadata.hero_title || 'livada.bio';
    const heroSubtitle = pageData.metadata.hero_subtitle || (language === 'sl' ? 'Gojenje sorodstev v več kot človeškem svetu' : 'Fostering kinship in a more than human world');

    return (
        <Page title={title}>
            <div style={{ minHeight: '60vh' }} className="flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-4xl md:text-6xl font-mono text-primary drop-shadow-lg">{heroTitle}</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">{heroSubtitle}</p>
            </div>
            <div className="bg-[#f7faf9]/95 backdrop-blur-sm rounded-t-2xl shadow-lg -mt-16 pt-16">
                 <div className="container mx-auto px-4 py-12">
                     {isLoading ? ( <div className="text-center prose lg:prose-xl max-w-4xl mx-auto">{t('loading')}...</div> ) 
                                : ( <div className="prose lg:prose-xl max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: marked(pageData.content || '') }} /> )}
                </div>
            </div>
        </Page>
    );
}

// --- Main App Component ---
function App() {
    const { t, setLanguage, language } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="app-container relative z-0">
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-lg border-b border-white/20">
                    <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold cursor-pointer text-primary">livada.bio</Link>
                        </div>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:flex flex-wrap gap-1">
                            {pages.map(page => (
                                <NavLink key={page.path} to={page.path} className={({ isActive }) => `relative px-3 py-2 font-medium text-gray-700 transition-colors duration-300 group ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
                                    {({ isActive }) => (<> {page.label} <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}/> </>)}
                                </NavLink>
                            ))}
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-2">
                            <button onClick={() => setLanguage('sl')} className={`px-2 py-1 font-semibold transition-colors ${language === 'sl' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>SL</button>
                            <button onClick={() => setLanguage('en')} className={`px-2 py-1 font-semibold transition-colors ${language === 'en' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>EN</button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-primary focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                                </svg>
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Drawer */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white/95 backdrop-blur-md">
                            <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
                                {pages.map(page => (
                                    <NavLink key={page.path} to={page.path} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        {page.label}
                                    </NavLink>
                                ))}
                                <div className="flex justify-center space-x-4 pt-4 border-t mt-4">
                                     <button onClick={() => { setLanguage('sl'); setIsMenuOpen(false); }} className={`px-3 py-1 font-semibold transition-colors ${language === 'sl' ? 'text-primary' : 'text-gray-500'}`}>Slovenščina</button>
                                     <button onClick={() => { setLanguage('en'); setIsMenuOpen(false); }} className={`px-3 py-1 font-semibold transition-colors ${language === 'en' ? 'text-primary' : 'text-gray-500'}`}>English</button>
                                </div>
                            </div>
                        </div>
                    )}
                </header>
                <main className="flex-grow">
                    <Routes>
                        {pages.map(page => ( <Route key={page.path} path={page.path} element={page.element} /> ))}
                    </Routes>
                </main>
                <footer className="py-6 text-center bg-gray-100/80 backdrop-blur-sm">
                    <div className="container mx-auto text-gray-600">{t('footerText')}</div>
                </footer>
            </div>
        </div>
    );
}

// Root Wrapper
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