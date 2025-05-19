'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ReactNode } from 'react';

interface CustomIntlProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
  children: ReactNode;
  defaultTranslationValues?: Record<string, any>;
  onError?: (error: Error) => void;
}

export default function CustomIntlProvider({
  locale,
  messages,
  timeZone,
  children,
  defaultTranslationValues,
  onError,
}: CustomIntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      defaultTranslationValues={defaultTranslationValues}
      onError={onError}
    >
      {children}
    </NextIntlClientProvider>
  );
}
