import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import CalendarFeed from '../components/CalendarFeed';

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

export default CalendarPage;
