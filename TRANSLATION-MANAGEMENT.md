# Translation Management for Livada Biotope

This document explains how to use the built-in translation management system for the Livada Biotope website.

## Accessing the Translation Management Interface

1. Go to your deployed website and navigate to `/admin/translations`
2. Log in with the following credentials:
   - Username: `admin`
   - Password: `livada2025`

## Features

- **Edit Both Languages**: You can edit both English and Slovenian translations in one interface
- **Search Functionality**: Quickly find specific translations using the search box
- **Automatic Saving**: Changes are saved to the translation files when you click "Save All Changes"
- **User Authentication**: Basic authentication to prevent unauthorized access

## How to Use

1. **Log in**: Enter your username and password
2. **Find Translations**: Use the search box to find specific translations
3. **Edit Translations**: Make changes to the English or Slovenian text in the text areas
4. **Save Changes**: Click the "Save All Changes" button to update the translation files
5. **Log out**: Click the "Logout" button when you're done

## Sharing Access with Others

You can share the login credentials with team members who need to edit translations. For better security in a production environment, consider implementing a more robust authentication system.

## Technical Details

The translation management system works by:
1. Reading translation files from the `public/locales` directory
2. Displaying them in an editable interface
3. Saving changes back to the files via an API endpoint

The system is built entirely within the Next.js application and doesn't require any external services.
