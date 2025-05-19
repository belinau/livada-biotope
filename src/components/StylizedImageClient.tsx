'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';
import Image from 'next/image';

export interface StylizedImageClientProps {
  speciesName: string | { en: string; sl: string };
  latinName?: string;
  backgroundColor?: string;
  patternColor?: string;
  pattern?: string;
  height: string | number;
  width: string | number;
  imageSrc?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  hideLatinName?: boolean;
  hideAllText?: boolean;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

const StylizedImageClient: React.FC<StylizedImageClientProps> = ({
  speciesName,
  latinName = '',
  backgroundColor = '#f5f5f5',
  patternColor = '#e0e0e0',
  pattern = 'leaves',
  height = 300,
  width = '100%',
  imageSrc,
  className = '',
  objectFit = 'cover',
  hideLatinName = false,
  hideAllText = false,
  sx = {},
  ...boxProps
}) => {
  const getPatternStyle = () => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${patternColor},
            ${patternColor} 1px,
            transparent 1px,
            transparent 10px
          )`,
        };
      case 'waves':
        return {
          backgroundImage: `radial-gradient(circle at 100% 50%, transparent 20%, ${patternColor} 21%, ${patternColor} 34%, transparent 35%, transparent),
            radial-gradient(circle at 0% 50%, transparent 20%, ${patternColor} 21%, ${patternColor} 34%, transparent 35%, transparent) 0 -25px,
            radial-gradient(circle at 100% 50%, ${patternColor} 15%, transparent 16%, transparent 35%, ${patternColor} 36%, ${patternColor} 45%, transparent 46%),
            radial-gradient(circle at 0% 50%, ${patternColor} 15%, transparent 16%, transparent 35%, ${patternColor} 36%, ${patternColor} 45%, transparent 46%) 0 -25px`,
          backgroundSize: '70px 50px',
        };
      case 'leaves':
      default:
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        };
    }
  };

  const displayName = typeof speciesName === 'string' ? speciesName : speciesName.en;

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getPatternStyle(),
        ...sx,
      }}
      className={className}
      {...boxProps}
    >
      {imageSrc && (
        <Box
          component="img"
          src={imageSrc}
          alt={displayName}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition: 'center',
          }}
        />
      )}
      {!hideAllText && !hideLatinName && latinName && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            color: 'white',
          }}
        >
          <Typography variant="caption" component="div" sx={{ lineHeight: 1.2 }}>
            {latinName}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StylizedImageClient;