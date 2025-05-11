import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';

interface TranslationItem {
  key: string;
  en: string;
  sl: string;
}

interface TranslationsPageProps {
  translations: TranslationItem[];
}

export default function TranslationsPage({ translations: initialTranslations }: TranslationsPageProps) {
  const router = useRouter();
  const [translations, setTranslations] = useState<TranslationItem[]>(initialTranslations);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Simple authentication - in a real app, you would use a more secure method
  const handleLogin = () => {
    // This is a very basic authentication - in production, use a proper auth system
    if (username === 'admin' && password === 'livada2025') {
      setIsAuthenticated(true);
      localStorage.setItem('translationAuth', 'true');
    } else {
      setMessage('Invalid credentials');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem('translationAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const filteredTranslations = translations.filter(
    item => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTranslationChange = (index: number, value: string, language: 'en' | 'sl') => {
    const newTranslations = [...translations];
    newTranslations[index][language] = value;
    setTranslations(newTranslations);
  };

  const handleSave = () => {
    try {
      // Organize translations by language and category
      const enTranslations: Record<string, Record<string, string>> = {};
      const slTranslations: Record<string, Record<string, string>> = {};
      
      translations.forEach(item => {
        const [category, key] = item.key.split('.');
        
        // Initialize category objects if they don't exist
        if (!enTranslations[category]) enTranslations[category] = {};
        if (!slTranslations[category]) slTranslations[category] = {};
        
        // Add translations
        enTranslations[category][key] = item.en;
        slTranslations[category][key] = item.sl;
      });
      
      // Create downloadable JSON files
      const enBlob = new Blob([JSON.stringify(enTranslations, null, 2)], { type: 'application/json' });
      const slBlob = new Blob([JSON.stringify(slTranslations, null, 2)], { type: 'application/json' });
      
      // Create download links
      const enUrl = URL.createObjectURL(enBlob);
      const slUrl = URL.createObjectURL(slBlob);
      
      // Create and trigger download for English translations
      const enLink = document.createElement('a');
      enLink.href = enUrl;
      enLink.download = 'en.json';
      document.body.appendChild(enLink);
      enLink.click();
      document.body.removeChild(enLink);
      
      // Create and trigger download for Slovenian translations
      const slLink = document.createElement('a');
      slLink.href = slUrl;
      slLink.download = 'sl.json';
      document.body.appendChild(slLink);
      slLink.click();
      document.body.removeChild(slLink);
      
      // Clean up URLs
      URL.revokeObjectURL(enUrl);
      URL.revokeObjectURL(slUrl);
      
      setMessage('Translation files downloaded! Replace the files in public/locales/ with these files.');
      setTimeout(() => setMessage(''), 10000);
    } catch (error) {
      console.error('Error generating translation files:', error);
      setMessage('Error generating translation files');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Translation Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl mb-4">Login Required</h2>
          
          {message && (
            <div className="p-4 mb-4 rounded bg-red-100 text-red-700">
              {message}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Translation Management</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('translationAuth');
            setIsAuthenticated(false);
          }}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Logout
        </button>
      </div>
      
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
          Download Translation Files
        </button>
        <p className="text-sm text-gray-600 mt-2">
          After downloading, replace the files in your repository at <code>public/locales/</code> and commit the changes.
        </p>
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
                <td className="py-2 px-4 border">
                  <textarea
                    value={item.en}
                    onChange={(e) => handleTranslationChange(index, e.target.value, 'en')}
                    className="w-full p-2 border rounded"
                    rows={Math.max(1, Math.ceil(item.en.length / 40))}
                  />
                </td>
                <td className="py-2 px-4 border">
                  <textarea
                    value={item.sl}
                    onChange={(e) => handleTranslationChange(index, e.target.value, 'sl')}
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
