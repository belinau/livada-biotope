import React from 'react';
import { cn } from '../../lib/cn';
import { getGlassClasses } from '../glass-theme';

const GlassCard = ({ 
  children, 
  className = '',
  hoverEffect = true,
  padding = 'p-6',
  rounded = 'lg',
  ...props 
}) => {
  const baseClasses = "relative transition-all duration-300 overflow-hidden";
  
  const glassClasses = getGlassClasses({ rounded });
    
  const hoverClasses = hoverEffect 
    ? "hover:shadow-xl hover:border-[var(--primary)]" 
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