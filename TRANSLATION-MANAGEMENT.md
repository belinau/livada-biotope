# Translation Management for Livada Biotope

This document explains how to use the serverless function-based translation management system for the Livada Biotope website.

## Accessing the Translation Management Interface

1. Go to your deployed website and navigate to `/admin/translations-editor`
2. Log in with the following credentials:
   - Password: `livada2025`

## Features

- **Serverless Architecture**: Translations are managed through Netlify serverless functions
- **Real-time Updates**: Changes are immediately available to all users without requiring a site rebuild
- **Edit Both Languages**: You can edit both English and Slovenian translations in one interface
- **Search Functionality**: Quickly find specific translations using the search box
- **Add New Translations**: Easily add new translation keys and values
- **User Authentication**: Simple password protection to prevent unauthorized access
- **Caching**: Translations are cached for better performance

## How to Use

1. **Log in**: Enter the password to access the translation editor
2. **Find Translations**: Use the search box to find specific translations
3. **Edit Translations**: Click the edit icon next to any translation to modify it
4. **Save Changes**: Click the save icon to save your changes
5. **Add New Translations**: Click the "Add Translation" button to create new translation keys
6. **Test Translations**: Visit the `/translation-preview` page to see your translations in action
7. **Log out**: Click the "Logout" button when you're done

## Sharing Access with Others

You can share the password with team members who need to edit translations. For better security in a production environment, consider implementing a more robust authentication system.

## Technical Details

The translation management system works by:

1. **Serverless Functions**: Translations are stored and served through Netlify serverless functions
2. **JSON Storage**: Translations are stored in a JSON file in the `netlify/functions/translations` directory
3. **React Hook**: The `useTranslations` hook fetches translations from the serverless function
4. **Caching**: Translations are cached on the server to improve performance

## Developer Integration

To use translations in your components:

```tsx
import useTranslations from '@/hooks/useTranslations';

function MyComponent() {
  const { t } = useTranslations();
  
  return (
    <div>
      <h1>{t('page.title', 'Default Title')}</h1>
      <p>{t('page.description', 'Default description text')}</p>
    </div>
  );
}
```

The `t()` function takes two parameters:
1. The translation key
2. A default value to use if the translation is not found

## Adding New Languages

The current system supports English and Slovenian. To add more languages:

1. Modify the `Language` type in `src/lib/translations.ts`
2. Update the serverless function to handle the new language
3. Add UI elements to select the new language
4. Add translations for the new language in the editor

## Exporting Translations

To export all translations to a JSON file (useful for backups):

1. Run `node scripts/export-translations.js`
2. The translations will be exported to `netlify/functions/translations/translations.json`
