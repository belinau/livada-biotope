import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { translations } from '@/lib/translations';

// Simple in-memory cache
let translationsCache: Record<string, any> = {};
let lastCacheUpdate = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale = 'en' } = req.query;
    
    // Check if we have a valid cached response
    const now = Date.now();
    if (translationsCache[locale as string] && now - lastCacheUpdate < CACHE_TTL) {
      return res.status(200).json(translationsCache[locale as string]);
    }
    
    // Convert translations object to the format expected by the client
    const formattedTranslations: Record<string, any> = {};
    
    // Process translations from the translations.ts file
    Object.entries(translations).forEach(([key, value]) => {
      formattedTranslations[key] = value;
    });
    
    // Cache the result
    translationsCache[locale as string] = formattedTranslations;
    lastCacheUpdate = now;
    
    // Return the translations
    return res.status(200).json(formattedTranslations);
  } catch (error) {
    console.error('Error in translations API:', error);
    return res.status(500).json({ error: 'Failed to load translations' });
  }
}
