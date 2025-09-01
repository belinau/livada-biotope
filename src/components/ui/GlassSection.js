import React from 'react';
import { cn } from '../../lib/cn';
import { getGlassClasses } from '../glass-theme';

const GlassSection = ({ 
  children, 
  className = '',
  padding = 'p-6',
  rounded = true,
  ...props 
}) => {
  const glassClasses = getGlassClasses({ rounded });
  
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