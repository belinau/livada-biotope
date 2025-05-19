import React from 'react';
import Image from 'next/image';
import { SxProps, Theme, Box } from '@mui/material';

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
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
}

/**
 * ResponsiveImage component that leverages Netlify Image CDN for optimized images
 * and integrates with MUI's styling system
 * 
 * Usage examples:
 * 
 * Basic usage:
 * <ResponsiveImage src="/images/uploads/example.jpg" alt="Example image" />
 * 
 * With MUI sx prop:
 * <ResponsiveImage 
 *   src="/images/example.jpg" 
 *   alt="Example" 
 *   sx={{ maxWidth: '100%', height: 'auto' }} 
 * />
 * 
 * With Netlify transformations:
 * <ResponsiveImage src="/images/uploads/example.jpg?nf_resize=fit&w=800&h=600" alt="Example" />
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
  onClick,
  sx = {},
  style = {}
}) => {
  // Default dimensions if not provided
  const defaultWidth = 800;
  const defaultHeight = 600;

  // Check if the image URL already has Netlify transformations
  const hasTransformations = src.includes('?');
  const imageUrl = hasTransformations ? src : `${src}?nf_resize=fit&w=${width || defaultWidth}&h=${height || defaultHeight}`;

  return (
    <Box 
      component="span"
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '100%',
        ...sx,
      }}
      className={className}
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit,
          ...style,
        }}
      />
    </Box>
  );
};

export default ResponsiveImage;
