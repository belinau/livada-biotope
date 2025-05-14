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
Create a `.env.local` file in the root directory and add:
```
NEXT_PUBLIC_SENSOR_API_URL=your-sensor-api-url
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
