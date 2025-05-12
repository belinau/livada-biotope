import React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

// Define the props interface
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

// Create a placeholder component for server-side rendering
const StylizedImagePlaceholder: React.FC<StylizedImageProps> = ({
  backgroundColor = '#f8f5e6',
  height = '100%',
  width = '100%',
}) => {
  return (
    <Box
      sx={{
        height,
        width,
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

// Use dynamic import with ssr: false to completely skip server-side rendering
const StylizedImageClient = dynamic(
  () => import('./StylizedImageClient'),
  { 
    ssr: false,
    loading: () => <StylizedImagePlaceholder 
      speciesName={{en: "", sl: ""}}
      backgroundColor="#f8f5e6"
      height="100%"
      width="100%"
    />
  }
);

// Main component that delegates to the client-only component
const StylizedImage: React.FC<StylizedImageProps> = (props) => {
  return <StylizedImageClient {...props} />;
};

export default StylizedImage;
