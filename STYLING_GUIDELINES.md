# Livada.bio Styling System Documentation

This document explains the standardized styling system implemented for the Livada.bio application.

## 1. Color System

Colors are defined as CSS variables in `src/index.css` and mapped in `tailwind.config.js`. All colors should be referenced through these variables to ensure consistency.

### Primary Colors
- `--primary`: #d4691a (Burnt orange)
- `--primary-light`: #e89547 (Amber orange)
- `--primary-dark`: #a85216 (Dark orange)
- `--bg-main`: #2a241e (Dark brown background)

### Text Colors
- `--text-main`: #f4f0ea (Off-white for primary text)
- `--text-muted`: #d1c7b8 (Light brown for secondary text)
- `--text-orange`: #ebc8ae (Light orange accent)
- `--text-sage`: #87a96b (Sage green)

### Glass Effect Colors
- `--glass-bg`: rgba(74, 63, 53, 0.6)
- `--glass-bg-nav`: rgba(121, 104, 88, 0.6)
- `--glass-border`: rgba(33, 17, 6, 0.7)

### Blob Colors
- `--blob-orange`: #d4691a (Burnt orange)
- `--blob-violet`: #9b59b6 (Softer violet)
- `--blob-yellow`: #f1c40f (Brighter yellow)
- `--blob-teal`: #1abc9c (Teal for better contrast)

## 2. Typography System

The typography system is defined in `src/typography.css` and extended with utility functions in `src/components/typography-utils.js`.

### Font Families
- `--font-display`: 'Comfortaa' (Organic, rounded display font)
- `--font-body`: 'Inter' (Clean, readable body text)
- `--font-accent`: 'Quicksand' (Light, airy accent font)
- `--font-mono`: 'JetBrains Mono' (Modern monospace)

### Text Classes
Use the `getTextClasses()` and `getTextStyle()` utility functions to ensure consistent typography:

```javascript
import { getTextClasses, getTextStyle } from './typography-utils';

// Using getTextClasses for custom combinations
const customText = getTextClasses({
  size: 'xl',
  weight: 'semibold',
  color: 'primary'
});

// Using getTextStyle for predefined styles
const displayText = getTextStyle('display-lg');
const bodyText = getTextStyle('body');
```

## 3. Glass Components

Glass components are standardized in `src/components/glass-theme.js` with predefined variants:

### Variants
- `card`: Standard glass card
- `navbar`: Glass navbar
- `modal`: Glass modal
- `button`: Glass button

### Usage
```javascript
import { getGlassVariant } from './glass-theme';

const cardClasses = getGlassVariant('card');
const navbarClasses = getGlassVariant('navbar');
```

### Customization
You can override any variant with custom options:
```javascript
const customCard = getGlassVariant('card', {
  rounded: '2xl',
  shadow: false
});
```

## 4. Animated Blob Background

To enhance the visual experience, we've implemented an advanced animated blob background using Framer Motion. The background consists of colorful blobs of varying sizes that move organically around the screen, creating a dynamic, fluid feel.

The animation is implemented in `src/components/BlobBackground.js` and is automatically included in the main App component.

### Features:
- 30 blobs of varying sizes (0.5vmax to 50vmax) for rich visual texture
- Three distinct size categories with unique movement patterns:
  - Large blobs (30-50vmax): Dramatic sweeping motions, erratic bouncing, and circular swirling
  - Medium blobs (8-25vmax): Moderate movements with influence from large blobs
  - Small blobs (0.5-8vmax): Subtle pulses with cascading influence from larger elements
- Interconnected movement system where large blobs drive the animation of smaller blobs
- Size-appropriate blur effects (15px to 35px) for visual depth and definition
- Oil-like blending modes for natural color mixing
- Optimized performance using Framer Motion

### Implementation Details:
- Large blobs initiate movement patterns 70% of the time
- When large blobs move, they increase animation probability of smaller blobs by 50%
- Directional influence flows from large to small blobs (30px to 100px influence)
- Each blob size category has distinct movement characteristics:
  - Large: Emphasis on translation over scaling, complex multi-keyframe paths
  - Medium: Balanced movement with moderate scale variation
  - Small: Subtle pulsing with occasional larger movements
- Variable animation probabilities based on size (tiny dots animate rarely, large blobs more frequently)

## 5. Page-Specific Glassmorphic Effects

Certain pages have been enhanced with additional glassmorphic backgrounds:

### Biodiversity Page
- Added a subtle glassmorphic overlay to enhance the background pattern visibility
- Uses a gradient from `--bg-main` to `--bg-secondary` with low opacity
- Applied `backdrop-blur-sm` for frosted glass effect

## 6. Responsive Design

Responsive utilities are defined in `src/components/responsive-utils.js`:

### Grid Utilities
```javascript
import { getResponsiveGridCols } from './responsive-utils';

const gridClasses = getResponsiveGridCols({
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 5
});
```

### Predefined Responsive Classes
- `flex-col-to-row`: Flex column on mobile, row on desktop
- `grid-cols-responsive`: Responsive grid columns
- `grid-cols-auto`: Auto-responsive grid columns
- `responsive-padding`: Responsive padding
- `responsive-margin`: Responsive margin

### Spacing Utilities
```javascript
import { getResponsivePadding, getResponsiveMargin } from './responsive-utils';

const paddingClasses = getResponsivePadding({
  x: { base: 4, sm: 6, lg: 8 },
  y: { base: 4, sm: 6, lg: 8 }
});
```

## 7. Updated Components

The following components have been updated to use the new styling system:

1. `GlassCard` - Now supports variants and uses `getGlassVariant()`
2. `GlassSection` - Now supports variants and uses `getGlassVariant()`
3. `BedCard` - Uses glass variants and typography utilities
4. `MetricCard` - Uses typography utilities
5. `PracticeCard` - Uses glass variants and typography utilities
6. `FundingLogos` - Uses glass variants, typography utilities, and responsive utilities
7. `Navbar` - Uses glass variants
8. `MobileNavMenu` - Uses glass variants
9. `ChartWrapper` - Uses typography utilities
10. `BlobBackground` - New component for advanced animated background
11. `BiodiversityPage` - Enhanced with glassmorphic background overlay

## 8. Best Practices

1. **Always use CSS variables** for colors instead of hardcoded values
2. **Use typography utilities** for consistent text styles
3. **Apply glass variants** for UI components instead of manual classes
4. **Use responsive utilities** for consistent breakpoint behavior
5. **Test color contrast** to ensure accessibility compliance
6. **Document new components** in this file when adding them

## 9. Migration Guide

When updating existing components:

1. Replace manual glass effect classes with `getGlassVariant()`
2. Replace custom text classes with `getTextClasses()` or `getTextStyle()`
3. Use responsive utilities for grid and spacing
4. Ensure all colors reference CSS variables