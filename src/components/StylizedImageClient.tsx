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
  
  // Simpler implementation without SVG complexity
  
  // Generate pattern styles using CSS - more reliable than SVG
  const getPatternStyle = () => {
    // Convert opacity values to decimal
    const color10 = hexToRgba(patternColor, 0.1); // 10% opacity
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    const color30 = hexToRgba(patternColor, 0.3); // 30% opacity
    const color70 = hexToRgba(patternColor, 0.7); // 70% opacity
    
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
          backgroundImage: `radial-gradient(circle at 50% 50%, ${color30} 5px, transparent 5px), radial-gradient(circle at 70% 30%, ${color20} 3px, transparent 3px)`,
          backgroundSize: '50px 50px, 30px 30px',
          backgroundPosition: '0 0, 25px 25px',
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${color30} 25%, transparent 25%, transparent 75%, ${color20} 75%, ${color20}), linear-gradient(135deg, ${color20} 25%, transparent 25%, transparent 75%, ${color30} 75%, ${color30})`,
          backgroundSize: '30px 30px, 40px 40px',
          backgroundPosition: '0 0, 15px 15px',
        };
      default:
        // Default pattern when none specified
        return {
          backgroundImage: `radial-gradient(${color70} 3px, transparent 3px)`,
          backgroundSize: '20px 20px',
        };
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
        // Always apply pattern styles for reliability
        ...getPatternStyle(),
      }}
    >
      {/* Image if provided and loaded */}
      {imageSrc && !imageError && imageLoaded && (
        <img 
          src={imageSrc} 
          alt={typeof speciesName === 'string' ? speciesName : (language === 'en' ? speciesName.en : speciesName.sl)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            zIndex: 1
          }}
        />
      )}
      
      {/* We're using CSS patterns instead of SVG for better reliability */}
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