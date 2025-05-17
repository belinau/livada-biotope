/**
 * Translation service for automatically translating event content
 * from English to Slovenian
 */

// Simple in-memory translation dictionary
const translations = {
  // Event titles
  'Garden Workshop': 'Vrtnarska delavnica',
  'Community Meeting': 'Srečanje skupnosti',
  'Sustainability Workshop': 'Delavnica o trajnostnem razvoju',
  
  // Event descriptions
  'Learn about permaculture and sustainable gardening practices.': 'Naučite se o permakulturi in trajnostnih vrtnarskih praksah.',
  'Join us for our monthly community gathering.': 'Pridružite se nam na mesečnem srečanju skupnosti.',
  
  // Locations
  'Livada Biotope, Ljubljana': 'Livada Biotop, Ljubljana',
  'Community Center': 'Družinski center',
  'Main Garden': 'Glavni vrt'
};

type TranslationKey = keyof typeof translations;

/**
 * Translates a string from English to the current language
 */
export function translateText(text: string): string {
  // In a real app, you would use a proper i18n library
  return translations[text as TranslationKey] || text;
}

export function translateEventTitle(title: string): string {
  return translateText(title);
}

export function translateEventDescription(description: string): string {
  return translateText(description);
}

export function translateEventLocation(location: string): string {
  return translateText(location);
}

// This function is kept for backward compatibility
export async function translateWithAPI(text: string): Promise<string> {
  return translateText(text);
}
