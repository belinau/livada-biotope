// /src/pages/api/translations/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const locale = req.query.locale as string || 'en';
  
  try {
    // Read translations file
    const filePath = path.join(process.cwd(), 'src/content/translations/common.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    // Extract translations in new format
    const translations = data.translations || [];
    
    // Convert to key-value format for compatibility
    const formattedTranslations = translations.reduce((result: Record<string, string>, item: any) => {
      result[item.key] = item[locale];
      return result;
    }, {});
    
    res.status(200).json(formattedTranslations);
  } catch (error) {
    console.error('Error loading translations:', error);
    res.status(500).json({ error: 'Failed to load translations' });
  }
}