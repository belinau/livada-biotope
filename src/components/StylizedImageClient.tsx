import React from 'react';
import Box from '@mui/material/Box';
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
  hideLatinName?: boolean;
}

const StylizedImageClient: React.FC<StylizedImageProps> = ({
  speciesName,
  latinName,
  backgroundColor = '#f8f5e6',
  patternColor = '#2e7d32',
  height = '100%',
  width = '100%',
  pattern = 'dots',
  hideLatinName = false
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
  
  // Generate pattern styles using CSS - more subtle versions
  const getPatternStyle = () => {
    // Use lower opacity values for more subtle patterns
    const color10 = hexToRgba(patternColor, 0.1); // 10% opacity
    const color15 = hexToRgba(patternColor, 0.15); // 15% opacity
    const color20 = hexToRgba(patternColor, 0.2); // 20% opacity
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${color20} 3px, transparent 3px), radial-gradient(${color15} 2px, transparent 2px)`,
          backgroundSize: '30px 30px, 20px 20px',
          backgroundPosition: '0 0, 15px 15px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color20}, ${color20} 1px, transparent 1px, transparent 10px), repeating-linear-gradient(135deg, ${color15}, ${color15} 1px, transparent 1px, transparent 15px)`,
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'waves':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${color20} 5px, transparent 5px), radial-gradient(circle at 70% 30%, ${color15} 3px, transparent 3px)`,
          backgroundSize: '40px 40px, 25px 25px',
          backgroundPosition: '0 0, 20px 20px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${color20} 25%, transparent 25%, transparent 75%, ${color15} 75%, ${color15}), linear-gradient(135deg, ${color15} 25%, transparent 25%, transparent 75%, ${color20} 75%, ${color20})`,
          backgroundSize: '30px 30px, 40px 40px',
          backgroundPosition: '0 0, 15px 15px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
      default:
        // Default pattern when none specified
        return {
          backgroundImage: `radial-gradient(${color20} 3px, transparent 3px)`,
          backgroundSize: '20px 20px',
          backgroundColor: backgroundColor, // Ensure background color is applied
        };
    }
  };

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
      {/* Only show species name and latin name if they are provided */}
      {altText && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 2,
            borderRadius: 1,
            textAlign: 'center',
            maxWidth: '80%',
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
          {latinName && !hideLatinName && (
            <div style={{ 
              fontStyle: 'italic',
              color: '#666'
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