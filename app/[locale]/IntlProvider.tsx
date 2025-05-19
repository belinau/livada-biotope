'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ReactNode } from 'react';

interface IntlProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
  timeZone?: string;
  now?: Date;
  onError?: (error: Error) => void;
}

export default function IntlProvider({
  locale,
  messages,
  children,
  timeZone,
  now,
  onError,
}: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      now={now}
      onError={onError || ((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      })}
    >
      {children}
    </NextIntlClientProvider>
  );
}
