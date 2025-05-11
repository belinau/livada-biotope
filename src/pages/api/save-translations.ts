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
    
    // Path to the Slovenian translations file
    const translationsPath = path.join(process.cwd(), 'public/locales/sl.json');
    
    // Read the current translations
    const currentTranslations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
    
    // Update the translations
    translations.forEach(item => {
      const [category, key] = item.key.split('.');
      if (currentTranslations[category] && key) {
        currentTranslations[category][key] = item.sl;
      }
    });
    
    // Write the updated translations back to the file
    fs.writeFileSync(translationsPath, JSON.stringify(currentTranslations, null, 2));
    
    return res.status(200).json({ message: 'Translations saved successfully' });
  } catch (error) {
    console.error('Error saving translations:', error);
    return res.status(500).json({ message: 'Error saving translations' });
  }
}
