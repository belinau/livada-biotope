import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

interface StylizedImageProps {
  speciesName: string | {
    en: string;
    sl: string;
  };
  latinName?: string;
  backgroundColor?: string;
  patternColor?: string;
  height?: string | number;
  width?: string | number;
  pattern?: 'dots' | 'lines' | 'waves' | 'leaves';
  imageSrc?: string; // Optional image source URL
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // Optional object-fit property
}

const StylizedImageClient: React.FC<StylizedImageProps> = ({
  speciesName,
  latinName,
  backgroundColor = '#f8f5e6',
  patternColor = '#2e7d32',
  height = '100%',
  width = '100%',
  pattern = 'dots',
  imageSrc,
  objectFit = 'cover'
}) => {
  const { language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return rgba format
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  // Generate pattern styles using CSS - more reliable than SVG
  const getPatternStyle = () => {
    // Use stronger opacity values for better visibility
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    const color30 = hexToRgba(patternColor, 0.3); // 30% opacity
    const color50 = hexToRgba(patternColor, 0.5); // 50% opacity
    const color80 = hexToRgba(patternColor, 0.8); // 80% opacity
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${color80} 4px, transparent 4px), radial-gradient(${color50} 3px, transparent 3px)`,
          backgroundSize: '30px 30px, 20px 20px',
          backgroundPosition: '0 0, 15px 15px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color50}, ${color50} 2px, transparent 2px, transparent 10px), repeating-linear-gradient(135deg, ${color30}, ${color30} 2px, transparent 2px, transparent 15px)`,
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'waves':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${color50} 6px, transparent 6px), radial-gradient(circle at 70% 30%, ${color30} 4px, transparent 4px)`,
          backgroundSize: '40px 40px, 25px 25px',
          backgroundPosition: '0 0, 20px 20px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${color50} 25%, transparent 25%, transparent 75%, ${color30} 75%, ${color30}), linear-gradient(135deg, ${color30} 25%, transparent 25%, transparent 75%, ${color50} 75%, ${color50})`,
          backgroundSize: '30px 30px, 40px 40px',
          backgroundPosition: '0 0, 15px 15px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      default:
        // Default pattern when none specified
        return {
          backgroundImage: `radial-gradient(${color80} 4px, transparent 4px)`,
          backgroundSize: '20px 20px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
    }
  };

  // Make sure imageSrc is an absolute URL
  const ensureAbsoluteUrl = (src: string | undefined) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) {
      return `https://livada-biotope.netlify.app${src}`;
    }
    return `https://livada-biotope.netlify.app/${src}`;
  };

  const safeImageSrc = imageSrc ? ensureAbsoluteUrl(imageSrc) : '';
  const altText = typeof speciesName === 'string' ? speciesName : (language === 'en' ? speciesName.en : speciesName.sl);

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // Always apply pattern styles for reliability
        ...getPatternStyle(),
      }}
    >
      {/* Image if provided */}
      {safeImageSrc && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          <Image 
            src={safeImageSrc}
            alt={altText}
            fill
            style={{ objectFit: objectFit as any }}
            unoptimized={true}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      {/* Only show species name and latin name if they are provided */}
      {altText && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 2,
            borderRadius: 1,
            textAlign: 'center',
            maxWidth: '80%',
            position: 'absolute', 
            bottom: '20px', 
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: patternColor,
            marginBottom: '0.25rem'
          }}>
            {altText}
          </div>
          {latinName && (
            <div style={{ 
              fontSize: '1rem', 
              fontStyle: 'italic', 
              color: patternColor 
            }}>
              {latinName}
            </div>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StylizedImageClient;