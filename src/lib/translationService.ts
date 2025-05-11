/**
 * Translation service for automatically translating event content
 * from English to Slovenian
 */

// Common event-related terms translations
const commonTerms: Record<string, string> = {
  // Event types
  'workshop': 'delavnica',
  'lecture': 'predavanje',
  'community': 'skupnost',
  'meeting': 'srečanje',
  
  // Locations
  'Livada Biotope': 'Biotop Livada',
  'Community Garden': 'Skupnostni vrt',
  'Botanical Garden': 'Botanični vrt',
  'Urban Garden': 'Mestni vrt',
  'City Park': 'Mestni park',
  'Nature Reserve': 'Naravni rezervat',
  'Forest': 'Gozd',
  'Meadow': 'Travnik',
  'Online': 'Spletno',
  'Biotop Livada': 'Biotop Livada',
  'LivadaLAB': 'LivadaLAB',
  
  // Time-related terms
  'Today': 'Danes',
  'Tomorrow': 'Jutri',
  'Next week': 'Naslednji teden',
  'Last week': 'Prejšnji teden',
  'Morning': 'Jutro',
  'Afternoon': 'Popoldne',
  'Evening': 'Večer',
  'Night': 'Noč',
  'Hour': 'Ura',
  'Minute': 'Minuta',
  'Duration': 'Trajanje',
  
  // Action words
  'Register': 'Prijava',
  'Join': 'Pridruži se',
  'Participate': 'Sodeluj',
  'Learn': 'Nauči se',
  'Discover': 'Odkrij',
  'Explore': 'Razišči',
  'Create': 'Ustvari',
  'Build': 'Zgradi',
  'Plant': 'Posadi',
  'Grow': 'Goji',
  'Harvest': 'Poberi',
  'Compost': 'Kompostiraj',
  
  // Specific event titles from the screenshot
  'Meet-up with a student group and assistant professor from the Biotechnical faculty': 'Srečanje s študentsko skupino in asistentom profesorjem iz Biotehniške fakultete',
  'Permacultural delavnica #2': 'Permakulturna delavnica #2',
  'Permacultural delavnica #3': 'Permakulturna delavnica #3'
};

/**
 * Simple translation function that replaces known English terms with Slovenian equivalents
 * For more complex translations, you would integrate with a translation API
 */
export function translateCommonTerms(text: string): string {
  if (!text) return '';
  
  let translatedText = text;
  
  // Replace all common terms
  Object.entries(commonTerms).forEach(([english, slovenian]) => {
    try {
      // Case-insensitive replacement with word boundary check
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, slovenian);
    } catch (error) {
      // Skip problematic regex patterns
      console.warn(`Error translating term '${english}':`, error);
    }
  });
  
  // Add some common sentence translations for better results
  translatedText = translateCommonSentences(translatedText);
  
  return translatedText;
}

/**
 * Translate common sentences and phrases that need more context
 * Using informal language (ti instead of vi) and more laid-back style
 */
function translateCommonSentences(text: string): string {
  const commonSentences: Record<string, string> = {
    'Join us for': 'Pridruži se nam na',
    'We invite you to': 'Vabimo te na',
    'Learn how to': 'Nauči se',
    'Registration is required': 'Potrebna je prijava',
    'Free entry': 'Vstop prost',
    'Please bring your own': 'Prinesi s sabo',
    'All materials provided': 'Vse materiale dobiš pri nas',
    'For more information': 'Za več info',
    'Contact us at': 'Piši nam na',
    'Limited spots available': 'Omejeno število mest',
    'No prior experience needed': 'Ne rabiš predznanja',
    'Suitable for all ages': 'Za vse starosti',
    'Children must be accompanied by an adult': 'Otroci naj pridejo z odraslo osebo',
    'In case of rain': 'Če bo dež',
    'The event will be held': 'Dogodek bo',
    'We look forward to seeing you': 'Se vidimo tam',
    'Thank you for your interest': 'Hvala za zanimanje',
  };
  
  let translatedText = text;
  
  // Replace common sentences
  Object.entries(commonSentences).forEach(([english, slovenian]) => {
    // Use simple string replacement for sentences to avoid regex issues
    if (translatedText.includes(english)) {
      translatedText = translatedText.replace(english, slovenian);
    }
  });
  
  return translatedText;
}

/**
 * Translate event title from English to Slovenian
 */
export function translateEventTitle(title: string): string {
  // Check for exact matches in the dictionary for full titles
  if (commonTerms[title]) {
    return commonTerms[title];
  }
  
  // Try to match specific event titles from the screenshot
  if (title.includes('Meet-up with a student group')) {
    return 'Srečanje s študentsko skupino in asistentom profesorjem iz Biotehniške fakultete';
  }
  
  if (title.includes('Permacultural delavnica #2')) {
    return 'Permakulturna delavnica #2';
  }
  
  if (title.includes('Permacultural delavnica #3')) {
    return 'Permakulturna delavnica #3';
  }
  
  // Fall back to word-by-word translation
  return translateCommonTerms(title);
}

/**
 * Translate event description from English to Slovenian
 * If the description already contains a Slovenian translation (indicated by SL: or similar markers),
 * extract and use that instead of machine translation
 */
export function translateEventDescription(description: string): string {
  if (!description) return '';
  
  // Specific event translations with flexible matching - using informal language
  const specificEventTranslations = [
    {
      keyPhrases: ['group visit', 'anyone can join', 'Vsi dobrodošli'],
      translation: 'Dobili bomo skupinski obisk, če se lahko pridružiš, si dobrodošel/a.<br>'
    },
    {
      keyPhrases: ['torek', 'delavnica', 'beds established', 'first delavnica'],
      translation: 'Na torkovi delavnici se bomo ukvarjali z gredami, ki smo jih naredili na prvi delavnici - učili se bomo prepoznavati mlade rastline, oceniti kako dobro kalijo, redčiti rastline kjer je treba, presajati solato in posaditi nova semena, kjer ni nič zraslo. Če bodo zelišča dovolj suha, bomo tudi nabrali spomladanska zelišča za čaje ali začimbe.<br>'
    },
    {
      keyPhrases: ['Thursday', 'delavnica', 'collaborative design', 'plant summer season'],
      translation: 'Na četrtkovi delavnici bomo skupaj načrtovali, se učili in sadili poletno zelenjavo - kumare, paradižnike, bučke in podobno. Naredili bomo tudi opore iz leske za paradižnike in zastirali nove in stare grede.<br>'
    },
    {
      keyPhrases: ['lettuce', 'seedlings', 'seeds', 'germination'],
      translation: 'Na delavnici se bomo učili prepoznavati mlade rastline, preveriti kako dobro kalijo, redčiti rastline kjer je treba, presajati solato in saditi nova semena.<br>'
    },
    {
      keyPhrases: ['vegetables', 'cucumbers', 'tomatoes', 'squash', 'zucchini'],
      translation: 'Na delavnici bomo sadili poletno zelenjavo - kumare, paradižnike, bučke in drugo sezonsko zelenjavo.<br>'
    },
    {
      keyPhrases: ['hazelnut sticks', 'mulch', 'beds'],
      translation: 'Naredili bomo opore iz leske za paradižnike in zastirali nove in stare grede.<br>'
    }
  ];
  
  // Try to find the best match from specific translations
  let bestMatchScore = 0;
  let bestTranslation = '';
  
  for (const eventTrans of specificEventTranslations) {
    let matchScore = 0;
    
    // Count how many key phrases match
    for (const phrase of eventTrans.keyPhrases) {
      if (description.toLowerCase().includes(phrase.toLowerCase())) {
        matchScore++;
      }
    }
    
    // If this is a better match than previous ones, use it
    if (matchScore > bestMatchScore && matchScore >= 2) { // Require at least 2 matches
      bestMatchScore = matchScore;
      bestTranslation = eventTrans.translation;
    }
  }
  
  if (bestTranslation) {
    return bestTranslation;
  }
  
  // Check for common translation markers
  const translationMarkers = [
    { start: 'SL:', end: '' },  // SL: [Slovenian text] at the end
    { start: '[SL]', end: '[/SL]' },  // [SL]Slovenian text[/SL]
    { start: 'SLOVENIAN:', end: '' },  // SLOVENIAN: [text] at the end
    { start: 'SLOVENŠČINA:', end: '' },  // SLOVENŠČINA: [text] at the end
    { start: '-- SL --', end: '' },  // -- SL -- [text] at the end
    { start: '---SLOVENIAN---', end: '' }  // ---SLOVENIAN--- [text] at the end
  ];
  
  // Try to find existing translation using markers
  for (const marker of translationMarkers) {
    const startIndex = description.indexOf(marker.start);
    if (startIndex !== -1) {
      // Found a marker, extract the Slovenian text
      const translationStart = startIndex + marker.start.length;
      let translationEnd = description.length;
      
      // If there's an end marker, find it
      if (marker.end && marker.end.length > 0) {
        const endIndex = description.indexOf(marker.end, translationStart);
        if (endIndex !== -1) {
          translationEnd = endIndex;
        }
      }
      
      // Extract the Slovenian text
      const slovenianText = description.substring(translationStart, translationEnd).trim();
      if (slovenianText.length > 0) {
        return slovenianText;
      }
    }
  }
  
  // If no existing translation found, use dictionary-based translation
  return translateCommonTerms(description);
}

/**
 * Translate event location from English to Slovenian
 */
export function translateEventLocation(location: string): string {
  return translateCommonTerms(location);
}

/**
 * For production use, you would implement an API-based translation
 * using a service like Google Translate. This is a placeholder for that implementation.
 */
export async function translateWithAPI(text: string, targetLanguage: string = 'sl'): Promise<string> {
  // This is where you would integrate with a translation API
  // For now, we'll just use our simple dictionary-based translation
  return translateCommonTerms(text);
  
  /* Example of how you might implement this with an actual API:
  
  try {
    const response = await fetch('https://translation-api.example.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text,
        source: 'en',
        target: targetLanguage
      })
    });
    
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation API error:', error);
    return translateCommonTerms(text); // Fallback to dictionary-based translation
  }
  */
}
