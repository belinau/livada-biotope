// Script to export translations from the TypeScript file to a JSON file for the serverless function
const fs = require('fs');
const path = require('path');

// Path to the translations.ts file
const translationsPath = path.join(__dirname, '../src/lib/translations.ts');
// Path to output JSON file
const outputPath = path.join(__dirname, '../netlify/functions/translations/translations.json');

// Read the translations.ts file
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Create a simple translations object for the serverless function
const translations = {};

// Use a more flexible regex to extract key-value pairs
const regex = /'([^']+)':\s*{\s*en:\s*['"]([^'"]*)['"],\s*sl:\s*['"]([^'"]*)['"]\s*}/g;
let match;

while ((match = regex.exec(translationsContent)) !== null) {
  const key = match[1];
  const enValue = match[2];
  const slValue = match[3];
  
  translations[key] = {
    en: enValue,
    sl: slValue
  };
}

// Check if we found any translations
if (Object.keys(translations).length === 0) {
  console.error('Could not extract any translations from the file');
  process.exit(1);
}

// Write the translations to the output file
fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2));

console.log(`Successfully exported ${Object.keys(translations).length} translations to ${outputPath}`);

