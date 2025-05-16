# Project Structure

## Overview

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components used across the app
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── config/              # Configuration files
├── content/             # Content in markdown format
│   ├── pages/           # Page content
│   ├── projects/        # Project markdown files
│   └── resources/       # Other content resources
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Library code and utilities
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── admin/           # Admin pages
│   └── projects/        # Project pages
├── public/              # Static files
│   ├── images/          # Image assets
│   └── fonts/           # Font files
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Key Files and Directories

### `/src/pages`
- Contains all route definitions
- Uses Next.js file-system based routing
- Special files:
  - `_app.tsx`: Custom App component
  - `_document.tsx`: Custom Document component
  - `_error.tsx`: Error page
  - `404.tsx`: 404 page

### `/src/components`
- Organized by feature and type
- Each component should have its own directory with:
  - `index.tsx`: Main component file
  - `ComponentName.module.css`: Styles (if needed)
  - `ComponentName.stories.tsx`: Storybook stories (if applicable)
  - `ComponentName.test.tsx`: Tests (if applicable)

### `/src/content`
- Contains all markdown content
- Organized by content type
- Each markdown file can have frontmatter for metadata

## Development Guidelines

### Adding a New Page
1. Create a new file in `/src/pages` or a subdirectory
2. Export a default React component
3. Use `getStaticProps` for static generation if needed
4. Add any required translations

### Adding a New Component
1. Create a new directory in `/src/components`
2. Add an `index.tsx` file
3. Export the component as default
4. Add PropTypes or TypeScript interfaces
5. Add tests and stories if applicable

### Content Updates
- Update markdown files in `/src/content`
- Use frontmatter for metadata
- Follow the existing structure for consistency

## Build and Deployment
- The project is configured for Netlify deployment
- Build command: `npm run build`
- Output directory: `.next`
- Environment variables are managed through Netlify
