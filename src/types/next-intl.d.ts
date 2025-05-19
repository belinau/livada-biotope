import 'next-intl';

declare module 'next-intl' {
  export interface IntlMessages {
    events: {
      title: string;
      joinCommunity: string;
      description: string;
      hostEvent: {
        title: string;
        description: string;
        button: string;
      };
    };
    common: {
      // Add common translation keys here
    };
  }
}

declare module 'next-intl' {
  export function useTranslations(
    namespace: keyof IntlMessages
  ): (key: string, values?: Record<string, any>) => string;
  
  export function getTranslations(
    namespace: keyof IntlMessages
  ): (key: string, values?: Record<string, any>) => Promise<string>;
}
