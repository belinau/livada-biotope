import React from 'react';
import { cn } from '../../lib/cn';
import { getGlassClasses } from '../../lib/glass-theme';

const GlassPage = ({ 
  children, 
  className = '',
  padding = 'p-6',
  rounded = 'lg',
  ...props 
}) => {
  const glassClasses = getGlassClasses({ rounded });
  
  const paddingClass = padding;
  
  const pageClasses = cn(
    glassClasses,
    paddingClass,
    className
  );

  return (
    <div className={pageClasses} {...props}>
      {children}
    </div>
  );
};

export { GlassPage };