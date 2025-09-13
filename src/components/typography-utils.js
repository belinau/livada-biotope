// Utility functions for consistent typography

// Standardized typography scale
export const textSizes = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl"
};

// Standardized font weights
export const fontWeights = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black"
};

// Standardized line heights
export const lineHeights = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose"
};

// Standardized letter spacing
export const letterSpacings = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest"
};

// Font family utilities
export const fontFamilies = {
  display: "font-display",
  body: "font-body",
  accent: "font-accent",
  mono: "font-mono"
};

// Text color utilities
export const textColors = {
  main: "text-text-main",
  muted: "text-text-muted",
  orange: "text-text-orange",
  sage: "text-text-sage",
  forest: "text-text-forest",
  earth: "text-text-earth",
  sky: "text-text-sky",
  sunset: "text-text-sunset",
  primary: "text-primary",
  "primary-light": "text-primary-light",
  "primary-dark": "text-primary-dark"
};

// Utility function to combine typography classes
export function getTextClasses(options = {}) {
  const {
    size,
    weight,
    lineHeight,
    letterSpacing,
    fontFamily,
    color,
    additionalClasses = ""
  } = options;

  let classes = "";

  if (size && textSizes[size]) classes += " " + textSizes[size];
  if (weight && fontWeights[weight]) classes += " " + fontWeights[weight];
  if (lineHeight && lineHeights[lineHeight]) classes += " " + lineHeights[lineHeight];
  if (letterSpacing && letterSpacings[letterSpacing]) classes += " " + letterSpacings[letterSpacing];
  if (fontFamily && fontFamilies[fontFamily]) classes += " " + fontFamilies[fontFamily];
  if (color && textColors[color]) classes += " " + textColors[color];

  if (additionalClasses) {
    classes += " " + additionalClasses;
  }

  return classes.trim();
}

// Predefined text styles
export const textStyles = {
  display: {
    fontFamily: "display",
    weight: "semibold",
    lineHeight: "tight",
    letterSpacing: "tight"
  },
  "display-lg": {
    fontFamily: "display",
    weight: "bold",
    lineHeight: "none",
    letterSpacing: "tighter"
  },
  body: {
    fontFamily: "body",
    weight: "normal",
    lineHeight: "relaxed"
  },
  "body-lg": {
    fontFamily: "body",
    weight: "normal",
    lineHeight: "relaxed",
    size: "lg"
  },
  accent: {
    fontFamily: "accent",
    weight: "medium",
    letterSpacing: "wide"
  },
  "accent-lg": {
    fontFamily: "accent",
    weight: "semibold",
    letterSpacing: "wide",
    lineHeight: "snug"
  }
};

// Utility function to get predefined text style
export function getTextStyle(styleName, overrides = {}) {
  const style = textStyles[styleName] || {};
  const mergedOptions = { ...style, ...overrides };
  return getTextClasses(mergedOptions);
}