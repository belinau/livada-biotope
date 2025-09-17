import React, { useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import CalendarFeed from '../components/CalendarFeed';
import OdonataSprite from '../components/OdonataSprite';
import MetaTags from '../components/MetaTags';

function CalendarPage() {
    const containerRef = useRef(null);
    const { t } = useTranslation();
    const pageTitle = t('navCalendar');
    const pageDescription = t('calendarDesc');

    // Responsive flight path using percentages of the wrapper
    const calendarFlightPath = {
        y: [-0.05, -0.2, -0.1, -0.3, -0.35, -0.15, -0.25, -0.05, -0.05],
        x: [0, 0.3, 0.6, 0.9, 0.6, 0.3, 0, 0, 0],
    };

    // Responsive perch point
    const perchPoint = { x: 0, y: -50 }; // Perch at top-left, slightly above

    return (
        <Page title={pageTitle}> 
            <MetaTags title={pageTitle} description={pageDescription} />
            <div ref={containerRef} className="container mx-auto px-4 pt-8 md:pt-12 pb-12 relative">
                <div className="text-center">
                    <div className="inline-block bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-4 px-8 rounded-full mb-8">
                        <h2 className="text-display text-3xl text-center bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">{t('calendarTitle')}</h2>
                    </div>
                </div>
                <OdonataSprite
                    wrapperRef={containerRef}
                    className="w-24 h-24 mx-auto mb-8"
                    perchPoint={perchPoint}
                    flightPath={calendarFlightPath}
                />
                <div className="relative z-10">
                    <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
                        <p className="text-body-lg mb-8 text-text-muted max-w-3xl mx-auto text-center">{t('calendarDesc')}</p>
                        <CalendarFeed 
                            icsUrl="https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics"
                            calendarUrl="https://calendar.google.com/calendar/embed?src=c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com&ctz=Europe%2FBelgrade"
                        />
                    </GlassSection>
                </div>
            </div>
        </Page>
    );
}

export default CalendarPage;