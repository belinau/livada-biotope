# Livada Biotope Website Documentation

## Overview

The Livada Biotope website is a Next.js-based platform designed to showcase the Livada Biotope project, which focuses on biodiversity, drought resilience, and community engagement in Ljubljana, Slovenia. This documentation provides an overview of the site structure, features, and how to maintain and update content.

## Site Architecture

The Livada Biotope website is built with:

- **Framework**: Next.js (React)
- **Styling**: Material UI components with custom theming
- **Content Management**: Netlify CMS for easy content editing
- **Deployment**: Netlify for hosting and serverless functions
- **Internationalization**: Multi-language support (English and Slovenian)

## Key Features

### 1. Multi-language Support

The site supports both English and Slovenian languages. Content is managed through the translations system, which allows for easy updates to text across the site.

- **Language Switcher**: Located in the navigation bar
- **Translation Files**: Managed through the admin panel

### 2. Enhanced Event Calendar

The calendar component displays events from a Google Calendar feed:

- **Event Display**: Shows events on a monthly calendar view
- **Event Details**: Clicking on a date with events shows details
- **Upcoming Events**: Sidebar shows upcoming events
- **Data Source**: Fetches from a Google Calendar via Netlify serverless function

### 3. StylizedImage Component

A custom component that displays decorative pattern backgrounds:

- **Patterns Only**: Displays only pattern backgrounds (no photos)
- **Species Information**: Can display species names and Latin names
- **Pattern Types**: Supports dots, waves, lines, and leaves patterns
- **Customization**: Configurable colors and pattern types

### 4. Projects Section

Showcases the various projects at Livada Biotope:

- **Project Pages**: Individual pages for each project
- **Interactive Elements**: Sensor data visualization where applicable
- **Biodiversity Showcase**: Displays flora and fauna at the biotope

### 5. Ecofeminism Resources

A dedicated section for ecofeminist resources:

- **Key Concepts**: Explanations of ecofeminist principles
- **Reading Recommendations**: Curated book recommendations
- **Videos & Podcasts**: Links to multimedia resources

### 6. Sensor Data Integration

Integration with environmental sensors through the Sideband plugin:

- **Data Visualization**: Displays sensor readings in charts and graphs
- **Real-time Updates**: Shows current environmental conditions
- **Historical Data**: Allows viewing of past readings

## Content Management

### Admin Panel

The Netlify CMS admin panel is accessible at `/admin` and allows authorized users to:

1. **Edit Pages**: Update content on Home, About, and Contact pages
2. **Manage Blog Posts**: Create, edit, and delete blog posts
3. **Update Translations**: Edit site text in both languages
4. **Manage Resources**: Update ecofeminism resources
5. **Upload Media**: Add images to the media library

### File Structure

The site's content is organized as follows:

```
src/
├── content/
│   ├── blog/           # Blog posts as markdown files
│   ├── events/         # Event information
│   ├── galleries/      # Image galleries
│   ├── pages/          # Main page content (Home, About, Contact)
│   ├── projects/       # Project descriptions
│   └── resources/      # Resource pages (Ecofeminism)
├── components/         # React components
├── contexts/           # React contexts (Language, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Next.js pages
└── styles/             # Global styles
```

### Image Management

Images are stored in:

```
public/
├── images/
│   ├── uploads/        # User-uploaded images via CMS
│   ├── illustrations/  # Botanical and zoological illustrations
│   └── icons/          # Site icons
```

## Netlify Functions

The site uses serverless functions for dynamic features:

1. **Calendar Function**: Fetches events from Google Calendar
   - Path: `/netlify/functions/calendar/calendar.js`
   - Endpoint: `/.netlify/functions/calendar`

2. **Contact Form Handler**: Processes contact form submissions
   - Path: `/netlify/functions/contact/contact.js`
   - Endpoint: `/.netlify/functions/contact`

## Updating Content

### Pages

Main pages (Home, About, Contact) can be edited through the admin panel:

1. Navigate to `/admin`
2. Log in with your credentials
3. Select "Pages" from the sidebar
4. Choose the page you want to edit
5. Make your changes and click "Publish"

### Translations

Site text can be edited through the admin panel:

1. Navigate to `/admin`
2. Log in with your credentials
3. Select "Translations" from the sidebar
4. Edit the JSON file directly
5. Click "Publish" to save changes

### Blog Posts

See the [BLOG_GUIDE.md](./BLOG_GUIDE.md) for detailed instructions on creating and managing blog posts.

## Development

### Local Development

To run the site locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the site at `http://localhost:3000`
5. Access the admin panel at `http://localhost:3000/admin`

### Building for Production

To build the site for production:

1. Run `npm run build`
2. Test the production build: `npm run start`

### Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch.

## Troubleshooting

### Common Issues

1. **Calendar Not Showing Events**:
   - Check that the Google Calendar URL is correct in `/netlify/functions/calendar/calendar.js`
   - Verify that the calendar has public sharing enabled
   - Check browser console for API errors

2. **Admin Panel Issues**:
   - Clear browser cache and cookies
   - Verify that you have the correct permissions
   - Check for syntax errors in configuration files

3. **Translation Issues**:
   - Ensure all translation keys are present in both languages
   - Check for syntax errors in the JSON file

## Support and Contact

For technical support or questions about the website:

- Email: tech@livada.bio
- GitHub Issues: https://github.com/livada-bio/livada-biotope/issues

## License

The Livada Biotope website is licensed under the MIT License. See LICENSE.md for details.
