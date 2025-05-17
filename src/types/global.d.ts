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

// For next-i18next (kept for compatibility)
declare module 'next-i18next' {
  import { InitOptions } from 'i18next';

  export interface UserConfig {
    defaultNS?: string;
    localePath?: string;
    localeExtension?: string;
    localeStructure?: string;
    use?: any[];
  }

  export interface SSRConfig {
    _nextI18Next: {
      initialI18nStore: {
        [language: string]: {
          [namespace: string]: any;
        };
      };
      initialLocale: string;
      userConfig: UserConfig | null;
    };
  }

  export function serverSideTranslations(
    initialLocale: string,
    namespacesRequired?: string[],
    configOverride?: UserConfig | null
  ): Promise<SSRConfig>;

  export function useTranslation(ns?: string | string[], options?: {
    keyPrefix?: string;
  }): {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };

  export const appWithTranslation: <P extends object>(
    Component: React.ComponentType<P>,
    configOverride?: UserConfig | null
  ) => React.ComponentType<P>;

  // Add other exports as needed
  export const i18n: any;
  export const withTranslation: any;
  export interface I18n extends i18n {}
  export const initReactI18next: any;
  export const Trans: any;
  export const I18nextProvider: any;

  // For backward compatibility
  export default function useTranslation(ns?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };
}
