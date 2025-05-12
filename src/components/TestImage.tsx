import React from 'react';
import Image from 'next/image';
import { Box, Typography, Paper } from '@mui/material';

interface TestImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const TestImage: React.FC<TestImageProps> = ({ 
  src, 
  alt, 
  width = 300, 
  height = 200 
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Image: {alt}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Source: {src}
      </Typography>
      <Box sx={{ position: 'relative', width, height, overflow: 'hidden', borderRadius: 1 }}>
        <img 
          src={src} 
          alt={alt}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
        />
      </Box>
    </Paper>
  );
};

export default TestImage;
