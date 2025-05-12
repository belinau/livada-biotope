import React from 'react';
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
  
  // Generate a unique pattern based on the species
  const getPatternStyle = () => {
    // Convert opacity values to decimal
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    const color30 = hexToRgba(patternColor, 0.3); // 30% opacity
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 3px, transparent 3px)`,
          backgroundSize: '30px 30px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color20}, ${color20} 1px, transparent 1px, transparent 10px)`,
        };
      case 'waves':
        return {
          backgroundImage: `repeating-radial-gradient(${color30}, ${color30} 10px, transparent 10px, transparent 20px)`,
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${color20} 25%, transparent 25%, transparent 75%, ${color20} 75%, ${color20})`,
          backgroundSize: '30px 30px',
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
        ...(imageSrc ? {} : getPatternStyle()),
        ...(imageSrc ? {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: objectFit,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {}),
      }}
    >
      {/* Only show species name and latin name if they are provided */}
      {(typeof speciesName === 'string' ? speciesName : (language === 'en' ? speciesName.en : speciesName.sl)) && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: 2,
            borderRadius: 1,
            textAlign: 'center',
            maxWidth: '80%',
            ...(imageSrc ? { position: 'absolute', bottom: '20px', zIndex: 2 } : {}),
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