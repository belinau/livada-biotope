# Livada Biotope Website

Eco-feminist initiative website for developing land-based practices.

## Features

- Multi-language support (Slovenian and English)
- Project pages with sensor data visualization
- Event calendar
- Photo galleries
- Instructables section
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values in `.env.local` with your configuration

3. Start the development server:
```bash
npm run dev
# Or use netlify dev for full Netlify Functions support
netlify dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sideband Bridge

The Sideband bridge is a Netlify Function that provides an API for sensor data. It's located in `netlify/functions/sideband-bridge.js`.

### Available Endpoints

- `GET /api/sideband/status` - Check if the bridge is online
- `GET /api/sideband/data` - Get sensor data
- `GET /api/sideband/debug` - Debug information

### Development

1. Start the Netlify dev server:
   ```bash
   netlify dev
   ```

2. Test the API endpoints:
   - http://localhost:8888/api/sideband/status
   - http://localhost:8888/api/sideband/data
   - http://localhost:8888/api/sideband/debug

### Deployment

The Sideband bridge is automatically deployed with your Netlify site. The production endpoints will be available at:
- `https://your-site.netlify.app/api/sideband/status`
- `https://your-site.netlify.app/api/sideband/data`
- `https://your-site.netlify.app/api/sideband/debug`

### Environment Variables

Set these in your Netlify site settings:

- `NEXT_PUBLIC_SIDEBAND_HOST` - Your Netlify site URL (e.g., your-site.netlify.app)
- `NEXT_PUBLIC_SIDEBAND_PORT` - 443 for production
- `NEXT_PUBLIC_SIDEBAND_HASH` - Your Sideband collector hash

## Project Structure

```
livada-biotope/
├── src/
│   ├── components/
│   │   ├── layout/     # Layout components (Navbar, Footer, etc.)
│   │   └── features/   # Feature components (SensorVisualization, etc.)
│   ├── pages/         # Page components
│   └── styles/        # Global styles
├── public/            # Static assets
└── public/locales/    # Translation files
```

## Technologies

- Next.js
- React
- TypeScript
- Chart.js
- Next-intl
- React Calendar

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Livada Biotope

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.4.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.5-0081CB?logo=mui)](https://mui.com/)

Sustainable living and biodiversity in harmony with nature.

## Features

- 🌍 Multi-language support (English, Slovenian)
- 🌓 Light/Dark mode with system preference detection
- 📱 Fully responsive design
- ⚡ Optimized performance with Next.js
- 🔍 SEO optimized with Next.js Metadata API
- 📊 Analytics integration (Google Analytics, Vercel Analytics)
- ✉️ Contact form with Resend
- 📝 Blog with MDX support

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/livada-biotope.git
   cd livada-biotope
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `type-check` - Check TypeScript types
- `postinstall` - Runs automatically after `npm install`

## Project Structure

```
.
├── app/                    # App Router
│   ├── [locale]/           # Localized routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── messages/               # Translation files
├── public/                 # Static files
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Adding a New Language

1. Add the new locale to `src/i18n.ts`:
   ```typescript
   export const locales = ['en', 'sl', 'new-locale'] as const;
   ```

2. Create a new translation file in `src/messages/` (e.g., `new-locale.json`)

3. Update the language switcher component if needed

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Flivada-biotope)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to a Git repository
2. Import the repository to Netlify
3. Set the build command: `npm run build` or `yarn build`
4. Set the publish directory: `.next`
5. Add your environment variables
6. Deploy site

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Material-UI](https://mui.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
- And all the amazing open-source libraries we use!
