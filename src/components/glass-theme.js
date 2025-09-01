// Utility functions for consistent glass-themed styling

export const glassColors = {
  background: "bg-[var(--glass-bg)]",
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
  
  if (background) classes += " " + glassColors.background;
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