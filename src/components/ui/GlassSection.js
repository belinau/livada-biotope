import React from 'react';
import { cn } from '../../lib/cn';
import { getGlassVariant } from '../glass-theme';

const GlassSection = ({ 
  children, 
  className = '',
  variant = 'card',
  padding = 'p-6',
  rounded = 'lg',
  ...props 
}) => {
  const glassClasses = getGlassVariant(variant, { rounded, background: 'gradient' });
  
  const paddingClass = padding;
  
  const sectionClasses = cn(
    glassClasses,
    paddingClass,
    className
  );

  return (
    <div className={sectionClasses} {...props}>
      {children}
    </div>
  );
};

export { GlassSection };