import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { marked } from 'marked';
import { parse } from 'yaml';

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
            { amplitude: 20, frequency: 0.01, speed: 0.0008, yOffset: 0.55, color: 'rgba(74, 124, 89, 0.05)' },
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 1;

            const gradientAlpha = 0.12 + Math.sin(time * 0.005) * 0.08;
            const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
            skyGradient.addColorStop(0, `rgba(74, 124, 89, ${gradientAlpha})`);
            skyGradient.addColorStop(1, `rgba(0, 161, 30, 0)`);
            
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude + canvas.height * wave.yOffset;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();
            });

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

const BED_MAPPING = {
    '!35c2d45c-0': { name: 'travni sestoj', color: '#52796f' },
    '!35c2d45c-1': { name: 'sivka in melisa', color: '#84a98c' },
    
    '!04c5ad60-0': { name: 'barjansko rastje', color: '#354f52' },
    '!04c5ad60-1': { name: 'cvetlice za opraševalce', color: '#cad2c5' },

    '!76208ba5-0': { name: 'majaron in melisa', color: '#90a955' },
    '!76208ba5-1': { name: 'kamilica in slezenovec', color: '#606c38' },
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
        moistureFlows: 'Pretoki vlage',
        temperatureFlows: 'Pretoki temperature',
        time: 'Čas',
        temperature: 'temperatura',
        soilMoisture: 'vlaga v prsti',
        soilTemp: 'temperatura prsti',
        airTemp: 'temperatura zraka',
        airHumidity: 'vlažnost zraka',
        footerText: 'Biotop Livada – posebna pobuda v okviru zavoda BOB © 2025',
        photoBy: 'Foto',
        navMemoryGame: 'Spomin',
        memoryGameTitle: 'Spomin',
        moves: 'Poteze',
        playAgain: 'Nova igra'
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
        navMemoryGame: 'Memory',
        memoryGameTitle: 'Memory',
        moves: 'Moves',
        playAgain: 'Play Again'
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
    const { t } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });
    const [latestReadings, setLatestReadings] = useState({});

    const nivoTheme = {
        axis: { ticks: { text: { fill: '#333' } }, legend: { text: { fill: '#333', fontSize: 14 } } },
        grid: { line: { stroke: '#e0e0e0', strokeDasharray: '2 2' } },
        tooltip: { container: { background: 'white', color: '#333', border: '1px solid #ccc' } },
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

                if (!newLatestReadings[bedId]) {
                    newLatestReadings[bedId] = {};
                }
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                        <ChartWrapper title={t('moistureFlows')}>
                            {hasMoistureData ? (
                                <ResponsiveLine data={chartData.moisture} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 80, left: 50 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: 'Vlaga (%)', legendOffset: -40 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 70, itemsSpacing: 4, itemWidth: 160, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
                            ) : ( <div className="flex items-center justify-center h-full text-gray-500">{t('noChartData')}</div> )}
                        </ChartWrapper>
                        <ChartWrapper title={t('temperatureFlows')}>
                            {hasTemperatureData ? (
                                <ResponsiveLine data={chartData.temperature} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 80, left: 50 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: `${t('temperature')} (°C)`, legendOffset: -50 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 70, itemsSpacing: 4, itemWidth: 160, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
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

const CalendarFeed = ({ icsUrl }) => {
    const [events, setEvents] = useState([]); const [isLoading, setIsLoading] = useState(true); const { t, language } = useTranslation();
    useEffect(() => {
        const parseICS = (icsText) => {
            const parsedEvents = []; const eventBlocks = icsText.split('BEGIN:VEVENT'); eventBlocks.shift();
            for (const block of eventBlocks) {
                const summaryMatch = block.match(/SUMMARY:(.*)/); const dtstartMatch = block.match(/DTSTART(?:;TZID=.*)?:(.*)/); const locationMatch = block.match(/LOCATION:(.*)/);
                if (summaryMatch && dtstartMatch) {
                    const startDateStr = dtstartMatch[1].trim(); const year = parseInt(startDateStr.substring(0, 4), 10); const month = parseInt(startDateStr.substring(4, 6), 10) - 1; const day = parseInt(startDateStr.substring(6, 8), 10); const hour = startDateStr.length > 8 ? parseInt(startDateStr.substring(9, 11), 10) : 0; const minute = startDateStr.length > 8 ? parseInt(startDateStr.substring(11, 13), 10) : 0;
                    const startDate = new Date(Date.UTC(year, month, day, hour, minute));
                    if (startDate > new Date()) { parsedEvents.push({ uid: (block.match(/UID:(.*)/) || ['', ''])[1].trim(), summary: summaryMatch[1].trim(), location: locationMatch ? locationMatch[1].trim().replace(/\\,/g, ',') : '', startDate: startDate, }); }
                }
            }
            return parsedEvents.sort((a, b) => a.startDate - b.startDate);
        };
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        fetch(proxyUrl + encodeURIComponent(icsUrl)).then(response => { if (!response.ok) { throw new Error('Network response was not ok'); } return response.text(); }).then(icsText => { setEvents(parseICS(icsText)); }).catch(e => { console.error("Error fetching or parsing ICS file:", e); }).finally(() => setIsLoading(false));
    }, [icsUrl]);

    if (isLoading) return <div className="text-center">{t('loading')}...</div>;
    return (
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            {events.length > 0 ? (<ul className="space-y-4">{events.map(event => (<li key={event.uid} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50/50"><div className="text-center flex-shrink-0 w-20"><p className="text-primary font-mono font-bold text-lg">{event.startDate.toLocaleDateString(language, { month: 'short' }).toUpperCase()}</p><p className="text-3xl font-bold text-gray-700">{event.startDate.getDate()}</p></div><div className="border-l-2 border-primary/20 pl-4 pt-1"><h3 className="font-bold text-lg text-primary">{event.summary}</h3>{event.location && <p className="text-sm text-gray-600">{event.location}</p>}<p className="text-sm text-gray-500 mt-1">{event.startDate.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p></div></li>))}</ul>)
                : (<p className="text-center text-gray-500">{t('noUpcomingEvents')}</p>)}
        </div>
    );
}

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

// --- Add this component above your Page components ---
function MemoryGame() {
    const { t, language } = useTranslation();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameComplete, setGameComplete] = useState(false);
  
    // Fetch observations and prepare cards
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.inaturalist.org/v1/observations?project_id=the-livada-biotope-monitoring&per_page=12`
          );
          const data = await response.json();
          const observations = data.results.filter(obs => obs.photos?.length > 0);
          
          // Create card pairs (image + name)
          const gameCards = observations.flatMap(obs => {
            const displayName = obs.taxon?.preferred_common_name || obs.taxon?.name || "Unknown";
            return [
              { 
                id: `${obs.id}-image`,
                type: 'image',
                content: obs.photos[0]?.url.replace('square', 'medium'),
                organismId: obs.id
              },
              { 
                id: `${obs.id}-name`,
                type: 'name',
                content: displayName,
                organismId: obs.id
              }
            ];
          });
          
          // Shuffle cards
          setCards(gameCards.sort(() => Math.random() - 0.5));
        } catch (error) {
          console.error("Error fetching game data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleCardClick = (index) => {
      // Prevent clicking when game is complete or card is already matched
      if (gameComplete || matched.includes(index) || flipped.includes(index)) return;
      
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);
      
      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        
        const firstCard = cards[newFlipped[0]];
        const secondCard = cards[newFlipped[1]];
        
        if (
          firstCard.organismId === secondCard.organismId &&
          firstCard.type !== secondCard.type
        ) {
          setMatched([...matched, ...newFlipped]);
          
          // Check if game is complete
          if (matched.length + 2 === cards.length) {
            setGameComplete(true);
          }
        }
        
        setTimeout(() => setFlipped([]), 1000);
      }
    };
  
    const resetGame = () => {
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameComplete(false);
      setCards([...cards].sort(() => Math.random() - 0.5));
    };
  
    if (loading) return <div className="text-center py-12">{t('loading')}...</div>;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-mono font-bold text-primary">{t('memoryGameTitle')}</h3>
          <p className="text-gray-600">{t('moves')}: {moves}</p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index);
            const isMatched = matched.includes(index);
            const isVisible = isFlipped || isMatched;
            
            return (
              <div
                key={index}
                className={`relative h-32 cursor-pointer transition-all duration-300 ${
                  isMatched ? 'opacity-75' : 'hover:scale-105'
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className={`absolute inset-0 bg-primary/10 rounded-lg shadow-md flex items-center justify-center transition-opacity duration-300 ${
                  isVisible ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg">?</span>
                  </div>
                </div>
                
                <div className={`absolute inset-0 bg-white rounded-lg shadow-md flex items-center justify-center p-2 transition-opacity duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                  {card.type === 'image' ? (
                    <img 
                      src={card.content || "placeholder-image.jpg"} 
                      alt="Organism" 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/400x400/2d3748/a0aec0?text=Ni+slike`;
                      }}
                    />
                  ) : (
                    <p className="text-sm font-medium text-center">{card.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {(gameComplete || cards.length === 0) && (
          <div className="text-center mt-8">
            <button 
              onClick={resetGame} 
              className="bg-primary/90 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary transition-colors"
            >
              {t('playAgain')}
            </button>
          </div>
        )}
      </div>
    );
  }
  
// --- CORRECTED ProjectsPage Component ---
function ProjectsPage() {
    const { t, language } = useTranslation();
    // CHANGE 1: The state now holds 'content' instead of 'description'.
    const [pageData, setPageData] = useState({ title: '', content: '' });

    useEffect(() => {
        fetch(`/content/pages/intertwinings.md?v=${new Date().getTime()}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch intertwinings.md');
                }
                return res.text();
            })
            .then(text => {
                // CHANGE 2: Capture 'content' from the parsed markdown file.
                const { metadata, content } = parseMarkdown(text);
                
                const title = metadata.title?.[language] || metadata.title?.sl || t('sensorDataTitle');
                
                // If the main content is empty, fall back to the description from the metadata.
                const bodyContent = content || metadata.description?.[language] || metadata.description?.sl || t('projectFutureDesc');

                setPageData({ 
                    title: title, 
                    content: bodyContent // Store the actual body content.
                });
            })
            .catch(err => {
                console.error("Failed to fetch page content, using fallback:", err);
                setPageData({
                    title: t('sensorDataTitle'),
                    content: t('projectFutureDesc') // Use fallback content on error.
                });
            });
    }, [t, language]);

    return (
        <Page title={pageData.title}>
            <Section title={pageData.title}>
                <SensorVisualization />
                <div 
                    className="prose lg:prose-xl mb-8 max-w-3xl mx-auto text-center text-gray-600"
                    // CHANGE 3: Render the 'content' from the state.
                    dangerouslySetInnerHTML={{ __html: marked(pageData.content || '') }} 
                />
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
                <CalendarFeed icsUrl="https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics" />
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
                const baseFileNames = [...new Set(manifest.files.map(f => f.replace('.sl.md', '').replace('.en.md', '')))];

                const fetchedItems = await Promise.all(
                    baseFileNames.map(async baseName => {
                        const langFile = `${baseName}${langSuffix}`;
                        const defaultLangFile = `${baseName}.sl.md`;
                        
                        let fileToFetch = langFile;
                        let res = await fetch(`/${contentPath}/${fileToFetch}`);
                        if (!res.ok) {
                            fileToFetch = defaultLangFile;
                            res = await fetch(`/${contentPath}/${fileToFetch}`);
                        }
                         if (!res.ok) return null;

                        const text = await res.text();
                        return { ...parseMarkdown(text), id: baseName };
                    })
                );
                
                const validItems = fetchedItems.filter(item => item !== null);
                validItems.sort((a, b) => (a.metadata.date && b.metadata.date) ? new Date(b.metadata.date) - new Date(a.metadata.date) : 0);
                setItems(validItems);

            } catch (error) { console.error(`Error fetching content from ${contentPath}:`, error); setItems([]); }
            setIsLoading(false);
        };
        fetchContent();
    }, [contentPath, language]);

    if (isLoading) return <Section title={title}><div className="text-center">{t('loading')}...</div></Section>;
    
    return (
        <Page title={title}>
            <Section title={title}>
                <div className="space-y-8 max-w-3xl mx-auto">
                    {items.length > 0 ? items.map(item => (
                        <div key={item.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                            {item.metadata.date && <p className="text-sm text-gray-500 mb-1">{new Date(item.metadata.date).toLocaleDateString(language)}</p>}
                            <h3 className="text-2xl font-mono text-primary mb-3">{item.metadata.title}</h3>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(item.content) }}></div>
                            {item.metadata.tags && <div className="mt-4">{item.metadata.tags.map(tag => (<span key={tag} className="inline-block bg-primary/10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>))}</div>}
                        </div>
                    )) : <p className="text-center text-gray-500">{t('noMoreObservations')}</p>}
                </div>
            </Section>
        </Page>
    );
}

function GalleryPage() {
    const { t, language } = useTranslation();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGalleries = async () => {
            setIsLoading(true);
            try {
                const manifestResponse = await fetch('/content/galleries/manifest.json');
                if (!manifestResponse.ok) throw new Error('Gallery manifest not found');
                const manifest = await manifestResponse.json();
                const baseFileNames = [...new Set(manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, '')))];

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
                
                const validGalleries = fetchedGalleries
                    .filter(gallery => gallery && gallery.images && gallery.images.length > 0)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

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

    return (
        <Page title={t('navGallery')}>
            <Section title={t('navGallery')}>
                {isLoading ? (
                    <div className="text-center py-10">{t('loading')}...</div>
                ) : galleries.length > 0 ? (
                    <div className="space-y-16">
                        {galleries.map(gallery => (
                            <article key={gallery.id}>
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-mono text-primary">{gallery.title}</h3>
                                    {gallery.date && <p className="text-sm text-gray-500 mt-1">{new Date(gallery.date).toLocaleDateString(language)}</p>}
                                    {gallery.description && <p className="prose mt-2 max-w-2xl mx-auto text-gray-600">{gallery.description}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {gallery.images.map((image, index) => {
                                        const caption = language === 'sl' ? image.caption_sl : (image.caption_en || image.caption_sl);
                                        return (
                                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden group">
                                                <div className="aspect-w-1 aspect-h-1">
                                                    <img src={image.image} alt={caption || gallery.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                                                </div>
                                                {(caption || gallery.author) && (
                                                    <div className="p-3 text-sm">
                                                        {caption && <p className="text-gray-700">{caption}</p>}
                                                        {gallery.author && (
                                                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                                              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm5 6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                            </svg>
                                                            {t('photoBy')}: {gallery.author}
                                                          </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">{t('noMoreObservations')}</p>
                )}
            </Section>
        </Page>
    );
}

// --- Memory Game page component ---
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

// --- New HomePage Component ---
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
                if (!response.ok) {
                    // Fallback to default language if the specific one is not found
                    response = await fetch(defaultLangFile);
                }
                if (!response.ok) {
                    throw new Error('Home page content file not found at ' + langFile + ' or ' + defaultLangFile);
                }
                const text = await response.text();
                const { metadata, content } = parseMarkdown(text);
                setPageData({ content, metadata });
            } catch (error) {
                console.error("Failed to fetch home page content:", error);
                // Provide some default content so the page isn't empty on error
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
    const heroSubtitle = pageData.metadata.hero_subtitle || (language === 'sl' ? 'Živi laboratorij za prepletanje umetnosti, znanosti in tehnologije' : 'A living laboratory for intertwining art, science, and technology');

    return (
        <Page title={title}>
            {/* Hero section that allows the animated background to be visible */}
            <div style={{ minHeight: '60vh' }} className="flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-4xl md:text-6xl font-mono text-primary drop-shadow-lg">{heroTitle}</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">{heroSubtitle}</p>
            </div>

            {/* Content Section rendered on a slightly opaque background to ensure readability */}
            <div className="bg-[#f7faf9]/95 backdrop-blur-sm rounded-t-2xl shadow-lg -mt-16 pt-16">
                 <div className="container mx-auto px-4 py-12">
                     {isLoading ? (
                        <div className="text-center prose lg:prose-xl max-w-4xl mx-auto">{t('loading')}...</div>
                     ) : (
                        <div
                            className="prose lg:prose-xl max-w-4xl mx-auto"
                            dangerouslySetInnerHTML={{ __html: marked(pageData.content || '') }}
                        />
                     )}
                </div>
            </div>
        </Page>
    );
}

// --- Main App Component ---
function App() {
    // Set 'home' as the default page
    const [currentPage, setCurrentPage] = useState('home'); 
    const { t, setLanguage, language } = useTranslation();

    const pages = [
        { key: 'home', label: t('navHome') },
        { key: 'projects', label: t('navProjects') },
        { key: 'posts', label: t('navPosts') },
        { key: 'practices', label: t('navPractices') },
        { key: 'biodiversity', label: t('navBiodiversity') },
        { key: 'gallery', label: t('navGallery') },
        { key: 'calendar', label: t('navCalendar') },
        // Add memory game to navigation
        { key: 'memory', label: t('navMemoryGame') },
      ];
      
      const renderPage = () => {
        switch (currentPage) {
          case 'home': return <HomePage />;
          case 'projects': return <ProjectsPage />;
          case 'posts': return <ContentCollectionPage t={t} title={t('navPosts')} contentPath="content/posts" />;
          case 'practices': return <ContentCollectionPage t={t} title={t('navPractices')} contentPath="content/practices" />;
          case 'biodiversity': return <BiodiversityPage />;
          case 'calendar': return <CalendarPage />;
          case 'gallery': return <GalleryPage />;
          // Add case for memory game
          case 'memory': return <MemoryGamePage />;
          default: return <HomePage />;
        }
      };    

    return (
        <div className="app-container relative z-0">
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-lg border-b border-white/20">
                    <nav className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
                        <div className="flex items-center">
                            {/* Update logo to navigate to 'home' */}
                            <span className="text-xl font-bold cursor-pointer text-primary" onClick={() => setCurrentPage('home')}>livada.bio</span>
                        </div>
                        <div className="flex flex-wrap gap-1 my-2">
                            {pages.map(page => (
                                <button 
                                    key={page.key} 
                                    onClick={() => setCurrentPage(page.key)} 
                                    className={`relative px-3 py-2 font-medium text-gray-700 transition-colors duration-300 group ${
                                        currentPage === page.key 
                                            ? 'text-primary' 
                                            : 'hover:text-primary'
                                    }`}
                                >
                                    {page.label}
                                    <span 
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                                            currentPage === page.key ? 'scale-x-100' : 'scale-x-0'
                                        } group-hover:scale-x-100`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setLanguage('sl')} className={`px-2 py-1 font-semibold transition-colors ${language === 'sl' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>SL</button>
                            <button onClick={() => setLanguage('en')} className={`px-2 py-1 font-semibold transition-colors ${language === 'en' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>EN</button>
                        </div>
                    </nav>
                </header>
                <main className="flex-grow">
                    {renderPage()}
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
                <App />
            </SensorProvider>
        </LanguageProvider>
    );
}
