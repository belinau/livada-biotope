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
  'Monthly community gathering to discuss ongoing projects.': 'Mesečno srečanje skupnosti za razpravo o tekočih projektih.',
  'Workshop on sustainable living practices.': 'Delavnica o praksah trajnostnega življenja.',
  
  // Locations
  'Livada Biotope, Ljubljana': 'Livada Biotop, Ljubljana',
  'Community Center': 'Družinski center',
  'Main Garden': 'Glavni vrt'
};

// Current language state
let currentLanguage: 'en' | 'sl' = 'en';

/**
 * Sets the current language for translations
 */
export function setTranslationLanguage(language: 'en' | 'sl'): void {
  currentLanguage = language;
}

/**
 * Translates a string from English to the current language
 */
export function translateText(text: string): string {
  // If the language is English, return the text as is
  if (currentLanguage === 'en') {
    return text;
  }
  
  // Otherwise, try to find a translation
  return translations[text as TranslationKey] || text;
}

type TranslationKey = keyof typeof translations;

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
