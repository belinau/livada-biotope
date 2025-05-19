'use client';

import dynamic from 'next/dynamic';

// Dynamically import the calendar component to avoid SSR issues
const CalendarComponent = dynamic(
  () => import('@/components/calendar/CalendarComponent'),
  { ssr: false }
);

export default function CalendarPage() {
  return (
    <main>
      <CalendarComponent />
    </main>
  );
}
