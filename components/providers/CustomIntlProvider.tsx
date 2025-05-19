'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface Props {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

export default function CustomIntlProvider({ locale, messages, children }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      // Disable error handling in production
      onError={process.env.NODE_ENV === 'development' ? console.error : undefined}
      // Disable all warnings
      getMessageFallback={() => ''}
    >
      {children}
    </NextIntlClientProvider>
  );
}
