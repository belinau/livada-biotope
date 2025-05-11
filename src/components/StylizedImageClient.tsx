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
}

const StylizedImageClient: React.FC<StylizedImageProps> = ({
  speciesName,
  latinName,
  backgroundColor = '#f8f5e6',
  patternColor = '#2e7d32',
  height = '100%',
  width = '100%',
  pattern = 'dots'
}) => {
  const { language } = useLanguage();
  
  // Generate a unique pattern based on the species
  const getPatternStyle = () => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 3px, transparent 3px)`,
          backgroundSize: '30px 30px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${patternColor}20, ${patternColor}20 1px, transparent 1px, transparent 10px)`,
        };
      case 'waves':
        return {
          backgroundImage: `repeating-radial-gradient(${patternColor}30, ${patternColor}30 10px, transparent 10px, transparent 20px)`,
        };
      case 'leaves':
        return {
          backgroundImage: `linear-gradient(45deg, ${patternColor}20 25%, transparent 25%, transparent 75%, ${patternColor}20 75%, ${patternColor}20)`,
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
        ...getPatternStyle(),
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 2,
          borderRadius: 1,
          textAlign: 'center',
          maxWidth: '80%',
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
    </Box>
  );
};

export default StylizedImageClient;
