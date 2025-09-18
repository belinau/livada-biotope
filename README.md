# Livada Biotope

The Livada Biotope web app and telemetry system for environmental data monitoring.

## Overview

Livada Biotope is a web application that displays environmental data from sensors in an interactive and visually engaging way. The application features a dynamic background with oil-like blobs that respond to user interaction and data changes.

## Features

### Environmental Data Monitoring
- Real-time sensor data visualization
- Historical data analysis with interactive charts
- Multiple sensor types support (temperature, humidity, soil moisture, etc.)

### Interactive Visualizations
- Dynamic oil blob background with physics-based animations
- Interactive data exploration

### Educational Components
- Biodiversity information cards
- Memory games for learning about local ecosystems
- Practice steps for environmental conservation

## Technical Implementation

### Oil Blob Background
The application features a sophisticated metaball background:

1. **Metaball Implementation** (`src/components/MetaballOilBlobBackground.js`)
   - Dynamic, physics-based metaball system with rich visual effects.
   - Features a custom radial gradient for vibrant, non-white blob centers.
   - Blobs display a palette of deep violet and goldenrod, with subtle micro-behaviors for a life-like feel.
   - Interactive: blobs react to pointer events with adjustable force.
   - Ambient lighting: gently rotating pink and golden light sources.
   - Optimized for smooth performance across devices, including mobile.
   - Each page refresh triggers an initial 'prod' on a random blob for dynamic entry.

### Data Visualization
- Real-time data streaming and display
- Interactive charts with zoom and pan capabilities
- Historical data comparison tools

### Responsive Design
- Mobile-first approach with adaptive layouts
- Touch-friendly interfaces for all interactive elements
- Optimized performance across devices

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
├── utils/               # Utility functions and helpers
├── data/                # Data processing and API integration
└── styles/              # CSS and styling utilities
```

## Key Components

### Background Systems
- `MetaballOilBlobBackground.js` - Advanced metaball-based system with custom rendering, physics, and interactive elements.

### Data Visualization
- `LiveSensorReadings.js` - Real-time sensor data display
- `EnhancedHistoricalVisualization.js` - Historical data charts
- `RecentSensorChart.js` - Time-series data visualization

### Educational Content
- `MemoryGame.js` - Interactive memory card game
- `ExpandableBiodiversityCard.js` - Information cards with expandable content
- `PracticesHero.js` - Conservation practices showcase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is proprietary to Livada Biotope.

## Contact

For more information, please contact the Livada Biotope team.