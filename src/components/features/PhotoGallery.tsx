import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@/components/ui/Grid'; // Using our custom Grid component
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveImage from './ResponsiveImage';

export interface GalleryImage {
  image: string;
  caption?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  title?: string;
  description?: string;
  images: GalleryImage[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ title, description, images }) => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (index: number) => {
    setCurrentImage(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Box sx={{ py: 4 }}>
      {title && (
        <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body1" sx={{ mb: 4 }}>
          {description}
        </Typography>
      )}

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                position: 'relative',
                height: 240,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleOpen(index)}
            >
              <ResponsiveImage
                src={`${image.image}?nf_resize=smartcrop&w=600&h=400`}
                alt={image.alt || `Gallery image ${index + 1}`}
                objectFit="cover"
              />
              {image.caption && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    p: 1
                  }}
                >
                  <Typography variant="body2">{image.caption}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
          }
        }}
      >
        <div>
          <Box
            sx={{
              position: 'relative',
              outline: 'none',
              width: isMobile ? '95%' : '80%',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 0,
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation controls */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            
            <IconButton
              sx={{
                position: 'absolute',
                left: isMobile ? 5 : 20,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={handlePrev}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            
            <IconButton
              sx={{
                position: 'absolute',
                right: isMobile ? 5 : 20,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={handleNext}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            {/* Main image */}
            <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '60vh' : '80vh' }}>
              <ResponsiveImage
                src={`${images[currentImage].image}?nf_resize=fit&w=1200&h=900`}
                alt={images[currentImage].alt || `Gallery image ${currentImage + 1}`}
                objectFit="contain"
                priority
                sizes="(max-width: 768px) 95vw, 80vw"
              />
            </Box>

            {/* Caption */}
            {images[currentImage].caption && (
              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white'
                }}
              >
                <Typography variant="body1" align="center">
                  {images[currentImage].caption}
                </Typography>
              </Box>
            )}
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default PhotoGallery;