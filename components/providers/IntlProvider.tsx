'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

interface IntlProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
