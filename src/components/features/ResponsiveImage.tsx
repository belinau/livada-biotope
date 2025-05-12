import React from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
}

/**
 * ResponsiveImage component that leverages Netlify Image CDN for optimized images
 * 
 * Usage examples:
 * 
 * Basic usage:
 * <ResponsiveImage src="/images/uploads/example.jpg" alt="Example image" />
 * 
 * With Netlify transformations:
 * <ResponsiveImage src="/images/uploads/example.jpg?nf_resize=fit&w=800&h=600" alt="Example image" />
 * 
 * Common transformations:
 * - Resize: ?nf_resize=fit&w=800&h=600
 * - Crop: ?nf_resize=smartcrop&w=400&h=400
 * - Format conversion: ?fm=webp
 * - Quality adjustment: ?q=80
 * - Grayscale: ?monochrome=true
 * 
 * Full documentation: https://docs.netlify.com/image-cdn/overview/
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'cover',
  onClick
}) => {
  // Default dimensions if not provided
  const defaultWidth = 800;
  const defaultHeight = 600;

  // Check if the image URL already has Netlify transformations
  const hasNetlifyParams = src.includes('?nf_resize=') || src.includes('&nf_resize=');

  // If no transformations are present, add default responsive settings
  const imageSrc = hasNetlifyParams 
    ? src 
    : `${src}?nf_resize=fit&w=${width || defaultWidth}&h=${height || defaultHeight}`;

  return (
    <div 
      className={`responsive-image-container ${className}`} 
      style={{ 
        position: 'relative',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill={!width || !height}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        style={{ objectFit }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export default ResponsiveImage;
