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
- **Translation Files**: Managed through the admin panel in a list format
- **API Endpoint**: Custom endpoint at `/api/translations` for serving translations

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
- **CMS Management**: All projects except "Let's Not Dry Out The Future" are editable via the CMS
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
- **Data Backup**: Automatic backup system for sensor data in JSON format

### 7. Gallery Management

A system for creating and managing image galleries:

- **Multiple Galleries**: Support for multiple distinct galleries
- **Bilingual Support**: Titles and descriptions in both English and Slovenian
- **CMS Integration**: Full gallery management through the admin interface

## Content Management

### Admin Panel

The Netlify CMS admin panel is accessible at `/admin` and allows authorized users to:

1. **Edit Pages**: Update content on Home, About, and Contact pages
2. **Manage Blog Posts**: Create, edit, and delete blog posts
3. **Update Translations**: Edit site text in both languages
4. **Manage Resources**: Update ecofeminism resources
5. **Upload Media**: Add images to the media library
6. **Create Galleries**: Create and manage image galleries

### File Structure

The site's content is organized as follows:

mkdir -p /Users/belmacpro/CascadeProjects/livada-biotope/public/docs
cat > /Users/belmacpro/CascadeProjects/livada-biotope/public/docs/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livada Biotope - Site Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { color: #2e7d32; }
        h1 { border-bottom: 2px solid #2e7d32; padding-bottom: 10px; }
        pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .note {
            background-color: #e8f5e9;
            padding: 15px;
            border-left: 5px solid #2e7d32;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Livada Biotope Site Structure</h1>
    
    <div class="note">
        <p><strong>Last Updated:</strong> May 14, 2025</p>
    </div>

    <h2>Content Organization</h2>
    <p>The site content is organized as follows:</p>
    <pre>
src/
├── content/
│   ├── posts/           # Blog posts as markdown files
│   ├── events/          # Event information
│   ├── galleries/       # Image galleries
│   ├── pages/           # Main page content
│   ├── projects/        # Project descriptions
│   ├── resources/       # Resource pages (Ecofeminism)
│   └── translations/    # Translation files
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── blog/            # Blog pages
│   ├── projects/        # Project pages
│   └── galleries/       # Gallery pages
    </pre>

    <h2>Recent Updates (May 2025)</h2>
    <ul>
        <li><strong>Blog Posts:</strong> Consolidated in src/content/posts/</li>
        <li><strong>Projects:</strong> All projects except "Let's Not Dry Out The Future" are now editable via CMS</li>
        <li><strong>Galleries:</strong> New structure with improved multilingual support</li>
        <li><strong>Translations:</strong> Updated to list format with new API endpoint</li>
        <li><strong>Sensor Data:</strong> Added backup functionality</li>
    </ul>

    <h2>CMS Usage</h2>
    <p>The admin panel at <a href="/admin">/admin</a> allows editing:</p>
    <ul>
        <li>Blog posts</li>
        <li>Projects (except "Let's Not Dry Out The Future")</li>
        <li>Galleries</li>
        <li>Translations</li>
        <li>Resources</li>
    </ul>

    <h2>For Developers</h2>
    <p>Local development setup:</p>
    <ol>
        <li>Clone the repository</li>
        <li>Run <code>npm install</code></li>
        <li>Start the dev server: <code>npm run dev</code></li>
        <li>For CMS access: <code>http://localhost:3000/admin/#/config.dev.yml</code></li>
        <li>Run proxy server: <code>npx netlify-cms-proxy-server</code></li>
    </ol>

    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
        <p>Livada Biotope Project © 2025</p>
    </footer>
</body>
</html>
