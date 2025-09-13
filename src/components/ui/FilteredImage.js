import React from 'react';

const FilteredImage = ({ 
  src, 
  srcSet,
  sizes,
  alt, 
  className = '', 
  filterType = 'glass', // 'glass', 'subtle', 'grid', 'matching', or 'none'
  ...props 
}) => {
  // Different filter options for various use cases
  const filterStyles = {
    glass: 'saturate(0.8) brightness(0.85)', // More noticeable glass effect
    subtle: 'saturate(0.8) brightness(0.90)',
    grid: 'saturate(0.6) brightness(0.75)', // Stronger filter for grid cards
    matching: 'saturate(0.9) brightness(0.90)', // Slight filter for matching cards
    none: ''
  };

  const appliedFilter = filterStyles[filterType] || filterStyles.glass;

  return (
    <img 
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      style={{ filter: appliedFilter }}
      {...props}
    />
  );
};

export default FilteredImage;