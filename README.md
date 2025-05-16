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
