// Utility functions for consistent responsive design

// Standard breakpoints (matching Tailwind's default breakpoints)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
};

// Common responsive utility classes
export const responsiveUtils = {
  // Responsive flex utilities
  "flex-col-to-row": "flex flex-col md:flex-row",
  "flex-row-to-col": "flex flex-row md:flex-col",
  
  // Responsive grid utilities
  "grid-cols-responsive": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  "grid-cols-auto": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  
  // Responsive spacing utilities
  "responsive-padding": "px-4 sm:px-6 lg:px-8",
  "responsive-margin": "mx-4 sm:mx-6 lg:mx-8",
  
  // Responsive text alignment
  "center-on-mobile": "text-left sm:text-center",
  
  // Responsive width constraints
  "max-width-container": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Responsive hiding
  "hide-on-mobile": "hidden sm:block",
  "hide-on-desktop": "block sm:hidden"
};

// Utility function to get responsive classes
export function getResponsiveClasses(className) {
  return responsiveUtils[className] || className;
}

// Utility function to create custom responsive grid
export function getResponsiveGridCols(breakpointCols) {
  const { sm = 1, md = 2, lg = 3, xl = 4, "2xl": xxl = 5 } = breakpointCols;
  
  return [
    `grid-cols-${sm}`,
    `sm:grid-cols-${md}`,
    `md:grid-cols-${lg}`,
    `lg:grid-cols-${xl}`,
    `xl:grid-cols-${xxl}`
  ].join(" ");
}

// Utility function to create responsive padding
export function getResponsivePadding(options = {}) {
  const {
    x = { base: 4, sm: 6, lg: 8 },
    y = { base: 4, sm: 6, lg: 8 }
  } = options;
  
  return [
    `px-${x.base} py-${y.base}`,
    `sm:px-${x.sm} sm:py-${y.sm}`,
    `lg:px-${x.lg} lg:py-${y.lg}`
  ].join(" ");
}

// Utility function to create responsive margin
export function getResponsiveMargin(options = {}) {
  const {
    x = { base: 4, sm: 6, lg: 8 },
    y = { base: 4, sm: 6, lg: 8 }
  } = options;
  
  return [
    `mx-${x.base} my-${y.base}`,
    `sm:mx-${x.sm} sm:my-${y.sm}`,
    `lg:mx-${x.lg} lg:my-${y.lg}`
  ].join(" ");
}