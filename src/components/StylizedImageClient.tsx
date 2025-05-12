import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  
  // Check if the image exists and can be loaded
  useEffect(() => {
    if (!imageSrc) return;
    
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = imageSrc;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);
  
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
  
  // Generate SVG pattern based on the species type
  const getSvgPattern = () => {
    // Generate a unique ID for each pattern instance to avoid conflicts
    const uniqueId = Math.random().toString(36).substring(2, 9);
    
    // Convert opacity values to decimal
    const color10 = hexToRgba(patternColor, 0.1); // 10% opacity
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    const color30 = hexToRgba(patternColor, 0.3); // 30% opacity
    const color40 = hexToRgba(patternColor, 0.4); // 40% opacity
    
    switch (pattern) {
      case 'dots':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <defs>
              <pattern id={`dots-${uniqueId}`} width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="3" fill={patternColor} />
                <circle cx="20" cy="20" r="2" fill={color30} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${uniqueId})`} />
          </svg>
        );
      case 'lines':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <defs>
              <pattern id={`lines-${uniqueId}`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke={color20} strokeWidth="1" />
              </pattern>
              <pattern id={`lines2-${uniqueId}`} width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
                <line x1="0" y1="0" x2="0" y2="15" stroke={color10} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#lines-${uniqueId})`} />
            <rect width="100%" height="100%" fill={`url(#lines2-${uniqueId})`} />
          </svg>
        );
      case 'waves':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <defs>
              <pattern id={`waves-${uniqueId}`} width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 25C5 15, 15 5, 25 5S45 15, 50 25S35 45, 25 45S5 35, 0 25" stroke={color30} strokeWidth="2" fill="none" />
                <path d="M0 25C5 35, 15 45, 25 45S45 35, 50 25S35 5, 25 5S5 15, 0 25" stroke={color20} strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#waves-${uniqueId})`} />
          </svg>
        );
      case 'leaves':
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <defs>
              <pattern id={`leaves-${uniqueId}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0,0 L20,20 L40,0 L20,-20 Z" fill={color20} transform="translate(0, 20)" />
                <path d="M0,0 L20,20 L40,0 L20,-20 Z" fill={color30} transform="translate(20, 0)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#leaves-${uniqueId})`} />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Generate a unique pattern based on the species (keep this as fallback)
  const getPatternStyle = () => {
    // Convert opacity values to decimal
    const color10 = hexToRgba(patternColor, 0.1); // 10% opacity
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    const color30 = hexToRgba(patternColor, 0.3); // 30% opacity
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 3px, transparent 3px), radial-gradient(${color30} 2px, transparent 2px)`,
          backgroundSize: '30px 30px, 20px 20px',
          backgroundPosition: '0 0, 15px 15px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color20}, ${color20} 1px, transparent 1px, transparent 10px), repeating-linear-gradient(135deg, ${color10}, ${color10} 1px, transparent 1px, transparent 15px)`,
        };
      case 'waves':
        return {
          backgroundImage: `repeating-radial-gradient(${color30}, ${color30} 10px, transparent 10px, transparent 20px), repeating-radial-gradient(${color20}, ${color20} 5px, transparent 5px, transparent 25px)`,
          backgroundSize: '50px 50px, 60px 60px',
          backgroundPosition: '0 0, 25px 25px',
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${color20} 25%, transparent 25%, transparent 75%, ${color20} 75%, ${color20}), linear-gradient(135deg, ${color30} 25%, transparent 25%, transparent 75%, ${color30} 75%, ${color30})`,
          backgroundSize: '30px 30px, 40px 40px',
          backgroundPosition: '0 0, 15px 15px',
        };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        width,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // Apply pattern styles as fallback
        ...getPatternStyle(),
      }}
    >
      {/* Add SVG pattern overlay */}
      {getSvgPattern()}
      {/* Only show species name and latin name if they are provided */}
      {(typeof speciesName === 'string' ? speciesName : (language === 'en' ? speciesName.en : speciesName.sl)) && (
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
            {typeof speciesName === 'string' 
              ? speciesName 
              : (language === 'en' ? speciesName.en : speciesName.sl)}
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