import React from 'react';
import { cn } from '../../lib/cn';
import { getGlassVariant } from '../glass-theme';

const GlassCard = ({ 
  children, 
  className = '',
  variant = 'card',
  hoverEffect = true,
  padding = 'p-6',
  rounded = 'lg',
  ...props 
}) => {
  const baseClasses = "relative transition-all duration-300 overflow-hidden";
  
  const glassClasses = getGlassVariant(variant, { rounded });
    
  const hoverClasses = hoverEffect 
    ? "hover:shadow-xl hover:border-[var(--glass-icon-outline)]" 
    : "";
    
  const paddingClass = padding;
    
  const cardClasses = cn(
    baseClasses,
    glassClasses,
    hoverClasses,
    paddingClass,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export { GlassCard };