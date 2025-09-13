// Utility functions for consistent glass-themed styling

export const glassColors = {
  background: "bg-[var(--glass-bg)]",
  'background-hero': "bg-[var(--glass-bg-hero)]",
  'background-gradient': "bg-gradient-to-t from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]",
  border: "border-[var(--glass-border)]",
  text: {
    primary: "text-[var(--text-main)]",
    muted: "text-[var(--text-muted)]",
    orange: "text-[var(--text-orange)]",
    sage: "text-[var(--text-sage)]"
  }
};

export const glassEffects = {
  blur: "backdrop-blur-sm",
  shadow: "shadow-xl",
  rounded: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full"
  }
};

// Standardized glass component variants
export const glassVariants = {
  card: {
    background: true,
    border: true,
    blur: true,
    shadow: true,
    rounded: "lg"
  },
  'card-gradient': {
    background: 'gradient',
    border: true,
    blur: true,
    shadow: true,
    rounded: "lg"
  },
  navbar: {
    background: true,
    border: true,
    blur: true,
    shadow: false,
    rounded: false
  },
  modal: {
    background: true,
    border: true,
    blur: true,
    shadow: true,
    rounded: "2xl"
  },
  button: {
    background: true,
    border: true,
    blur: true,
    shadow: false,
    rounded: "lg"
  },
  'hero-transparent': {
    background: true,
    border: true,
    blur: true,
    shadow: false,
    rounded: "lg"
  }
};

// Utility function to combine glass styling classes
export function getGlassClasses(options = {}) {
  const { 
    background = true, 
    border = true, 
    blur = true, 
    shadow = true, 
    rounded = "lg",
    additionalClasses = "" 
  } = options;
  
  let classes = "";
  
  if (background === 'hero') {
    classes += " " + glassColors['background-hero'];
  } else if (background === 'gradient') {
    classes += " " + glassColors['background-gradient'];
  } else if (background === true || background === 'default') {
    classes += " " + glassColors.background;
  }
  
  if (border) classes += " border " + glassColors.border;
  if (blur) classes += " " + glassEffects.blur;
  if (shadow) classes += " " + glassEffects.shadow;
  if (rounded && typeof rounded === 'string') {
    classes += " " + (glassEffects.rounded[rounded] || glassEffects.rounded.lg);
  } else if (rounded === true) {
    classes += " " + glassEffects.rounded.lg;
  }
  
  if (additionalClasses) {
    classes += " " + additionalClasses;
  }
  
  return classes.trim();
}

// Utility function to get standardized glass component classes
export function getGlassVariant(variant, overrides = {}) {
  const variantOptions = glassVariants[variant] || {};
  const mergedOptions = { ...variantOptions, ...overrides };
  return getGlassClasses(mergedOptions);
}