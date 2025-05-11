import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface TranslationItem {
  key: string;
  en: string;
  sl: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { translations } = req.body as { translations: TranslationItem[] };
    
    // Paths to the translation files
    const slTranslationsPath = path.join(process.cwd(), 'public/locales/sl.json');
    const enTranslationsPath = path.join(process.cwd(), 'public/locales/en.json');
    
    // Read the current translations
    const slCurrentTranslations = JSON.parse(fs.readFileSync(slTranslationsPath, 'utf8'));
    const enCurrentTranslations = JSON.parse(fs.readFileSync(enTranslationsPath, 'utf8'));
    
    // Update the translations
    translations.forEach(item => {
      const [category, key] = item.key.split('.');
      
      // Update Slovenian translations
      if (slCurrentTranslations[category] && key) {
        slCurrentTranslations[category][key] = item.sl;
      }
      
      // Update English translations
      if (enCurrentTranslations[category] && key) {
        enCurrentTranslations[category][key] = item.en;
      }
    });
    
    // Write the updated translations back to the files
    fs.writeFileSync(slTranslationsPath, JSON.stringify(slCurrentTranslations, null, 2));
    fs.writeFileSync(enTranslationsPath, JSON.stringify(enCurrentTranslations, null, 2));
    
    return res.status(200).json({ message: 'Translations saved successfully' });
  } catch (error) {
    console.error('Error saving translations:', error);
    return res.status(500).json({ message: 'Error saving translations' });
  }
}
