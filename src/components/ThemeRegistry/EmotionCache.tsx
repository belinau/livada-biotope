'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache, { type EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
// @ts-ignore - No types available for this package
import rtlPlugin from 'stylis-plugin-rtl';
import * as React from 'react';

type Direction = 'ltr' | 'rtl';

interface NextAppDirEmotionCacheProviderProps {
  options: {
    key: string;
    prepend?: boolean;
    stylisPlugins?: any[];
  };
  children: React.ReactNode;
  direction?: Direction;
}

export function NextAppDirEmotionCacheProvider({
  options,
  children,
  direction = 'ltr',
}: NextAppDirEmotionCacheProviderProps) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({
      ...options,
      stylisPlugins: [
        ...(direction === 'rtl' ? [prefixer, rtlPlugin] : []),
        ...(options.stylisPlugins || []),
      ],
    });
    
    // @ts-ignore - The cache type doesn't include compat in the types
    cache.compat = true;
    
    // @ts-ignore - The cache type doesn't include insert in the types
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    
    // @ts-ignore - The cache type doesn't include insert in the types
    cache.insert = (...args) => {
      const serialized = args[1];
      // @ts-ignore - The cache type doesn't include inserted in the types
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    
    let styles = '';
    for (const name of names) {
      // @ts-ignore - The cache type doesn't include inserted in the types
      styles += cache.inserted[name];
    }
    
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export default NextAppDirEmotionCacheProvider;
