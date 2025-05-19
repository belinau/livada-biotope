'use client';

import { useState, KeyboardEvent } from 'react';
import { Box, Grid, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon, NavigateBefore, NavigateNext } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import { GalleryImage } from '@/types/gallery';
import ResponsiveImage from '@/components/features/ResponsiveImage';

interface GalleryImageGridProps {
  images: GalleryImage[];
}

export function GalleryImageGrid({ images }: GalleryImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3; // Desktop
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(prev => (prev === 0 ? images.length - 1 : (prev || 1) - 1));
    } else {
      setSelectedImage(prev => (prev === images.length - 1 ? 0 : (prev || 0) + 1));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedImage === null) return;
    
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      default:
        break;
    }
  };

  // Close modal when clicking outside the image
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const gridColumns = getGridColumns();

  const getImageSrc = (src: string | StaticImageData): string => {
    return typeof src === 'string' ? src : src.src;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Box
              onClick={() => handleImageClick(index)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover .image-overlay': {
                  opacity: 1,
                },
              }}
            >
              <ResponsiveImage
                src={getImageSrc(image.src)}
                alt={image.alt}
                width={800}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                }}
              />
              <Box
                className="image-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <FullscreenIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              
              {image.title && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  }}
                >
                  <Typography variant="caption" component="div" sx={{ color: 'white' }}>
                    {image.title}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Fullscreen Modal */}
      {selectedImage !== null && (
        <Box
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                maxHeight: 'calc(90vh - 60px)',
                overflow: 'hidden',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ResponsiveImage
                src={getImageSrc(images[selectedImage].src)}
                alt={images[selectedImage].alt}
                width={1200}
                height={900}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 60px)',
                  objectFit: 'contain',
                }}
              />
              
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <FullscreenExitIcon />
              </IconButton>
              
              <IconButton
                onClick={() => navigateImage('prev')}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <NavigateBefore />
              </IconButton>
              
              <IconButton
                onClick={() => navigateImage('next')}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <NavigateNext />
              </IconButton>
            </Box>
            
            {(images[selectedImage].title || images[selectedImage].description) && (
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  p: 2,
                  borderRadius: 1,
                  maxWidth: '100%',
                }}
              >
                {images[selectedImage].title && (
                  <Typography variant="h6" gutterBottom>
                    {images[selectedImage].title}
                  </Typography>
                )}
                {images[selectedImage].description && (
                  <Typography variant="body2" color="text.secondary">
                    {images[selectedImage].description}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default GalleryImageGrid;
