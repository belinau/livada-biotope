import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';

interface TranslationItem {
  key: string;
  en: string;
  sl: string;
}

interface TranslationsPageProps {
  translations: TranslationItem[];
}

export default function TranslationsPage({ translations: initialTranslations }: TranslationsPageProps) {
  const [translations, setTranslations] = useState<TranslationItem[]>(initialTranslations);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const filteredTranslations = translations.filter(
    item => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTranslationChange = (index: number, value: string) => {
    const newTranslations = [...translations];
    newTranslations[index].sl = value;
    setTranslations(newTranslations);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/save-translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ translations }),
      });
      
      if (response.ok) {
        setMessage('Translations saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving translations');
      }
    } catch (error) {
      setMessage('Error saving translations');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Translation Management</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search translations..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <button 
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save All Changes
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Key</th>
              <th className="py-2 px-4 border">English</th>
              <th className="py-2 px-4 border">Slovenian</th>
            </tr>
          </thead>
          <tbody>
            {filteredTranslations.map((item, index) => (
              <tr key={item.key} className="hover:bg-gray-100">
                <td className="py-2 px-4 border font-mono text-sm">{item.key}</td>
                <td className="py-2 px-4 border">{item.en}</td>
                <td className="py-2 px-4 border">
                  <textarea
                    value={item.sl}
                    onChange={(e) => handleTranslationChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={Math.max(1, Math.ceil(item.sl.length / 40))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // In a production environment, you would load these from your actual translation files
  // This is just a simplified example
  const translationsPath = path.join(process.cwd(), 'public/locales/sl.json');
  const englishPath = path.join(process.cwd(), 'public/locales/en.json');
  
  let translations: TranslationItem[] = [];
  
  try {
    const slData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
    const enData = JSON.parse(fs.readFileSync(englishPath, 'utf8'));
    
    // Convert to the format we need
    Object.keys(slData).forEach(category => {
      Object.keys(slData[category]).forEach(key => {
        translations.push({
          key: `${category}.${key}`,
          en: enData[category]?.[key] || '',
          sl: slData[category][key]
        });
      });
    });
  } catch (error) {
    console.error('Error loading translations:', error);
  }
  
  return {
    props: {
      translations
    }
  };
};
