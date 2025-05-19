// For @livada-ignite/types/calendar
declare module '@livada-ignite/types/calendar' {
  export interface CalendarEvent {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    allDay?: boolean;
    resource?: any;
    extendedProps?: {
      [key: string]: any;
    };
  }

  export interface CalendarOptions {
    headerToolbar?: {
      left?: string;
      center?: string;
      right?: string;
    };
    initialView?: string;
    initialDate?: Date | string;
    events?: (CalendarEvent | (() => Promise<CalendarEvent[]>));
    eventClick?: (info: { event: CalendarEvent; el: HTMLElement; jsEvent: MouseEvent; view: any }) => void;
  }
}

// For @livada-libs/types
declare module '@livada-libs/types' {
  export interface SensorData {
    id: string;
    name: string;
    value: number;
    unit: string;
    timestamp: string;
    location?: {
      lat: number;
      lng: number;
    };
  }

  export interface BiodiversityItem {
    id: string;
    name: string;
    scientificName: string;
    type: 'plant' | 'animal' | 'fungi' | 'bacteria' | 'other';
    status: 'endangered' | 'vulnerable' | 'least concern' | 'data deficient';
    description?: string;
    imageUrl?: string;
    lastSeen?: string;
  }
}

// For next-intl
declare module 'next-intl' {
  export function useTranslations(namespace?: string): (key: string, values?: Record<string, any>) => string;
  export function useLocale(): string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    // Add other environment variables as needed
  }
}

// Add any global type extensions here
declare module '*.md' {
  const content: string;
  export default content;
}

import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom HTML attributes here
    css?: any;
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ico';
declare module '*.svg';
declare module '*.json';
// Add other asset type declarations as needed

// SVG Module Declaration
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Global Type Extensions
declare global {
  interface Window {
    // Add any global window properties here
    ENV?: {
      NODE_ENV: 'development' | 'production' | 'test';
    };
  }

  // Common types used throughout the application
  type Locale = 'en' | 'sl';

  interface LocalizedContent {
    en: string;
    sl: string;
  }

  interface ImageAsset {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
  }

  // Add any other global types here
}

// This export is needed for TypeScript to treat this file as a module
export {};
