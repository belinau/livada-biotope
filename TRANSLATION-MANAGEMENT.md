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
4. **Download Files**: Click the "Download Translation Files" button to download the updated translation files
5. **Replace Files**: Replace the files in your repository at `public/locales/` with the downloaded files
6. **Commit Changes**: Commit and push the changes to your GitHub repository
7. **Log out**: Click the "Logout" button when you're done

## Sharing Access with Others

You can share the login credentials with team members who need to edit translations. For better security in a production environment, consider implementing a more robust authentication system.

## Technical Details

The translation management system works by:
1. Reading translation files from the `public/locales` directory
2. Displaying them in an editable interface
3. Generating downloadable JSON files with your changes

Since Netlify's file system is read-only in production, we use a download-based approach instead of trying to write directly to the files on the server. This means you'll need to manually replace the files in your repository and commit the changes.

The system is built entirely within the Next.js application and doesn't require any external services.
