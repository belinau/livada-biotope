import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import CalendarFeed from '../components/CalendarFeed';

function CalendarPage() {
    const { t } = useTranslation();
    return (
        <Page title={t('navCalendar')}> 
            <div className="container mx-auto px-4 pt-8 md:pt-12 pb-12">
                <h2 className="text-display text-3xl mb-8 text-center bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent pt-4">{t('calendarTitle')}</h2>
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
