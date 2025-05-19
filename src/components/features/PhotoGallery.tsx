import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Modal, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  Grid // Import Grid from MUI
} from '@mui/material';
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
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
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
        aria-labelledby="image-modal"
        aria-describedby="image-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {!isMobile && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                bgcolor: 'black',
              }}
            >
              <ResponsiveImage
                src={`${images[currentImage].image}?nf_resize=smartcrop&w=1200&h=800`}
                alt={images[currentImage].alt || `Gallery image ${currentImage + 1}`}
                objectFit="contain"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  width: 'auto',
                  height: 'auto',
                }}
              />
            </Box>
            
            {(images[currentImage].caption || images.length > 1) && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {images[currentImage].caption && (
                    <Typography variant="body1">
                      {images[currentImage].caption}
                    </Typography>
                  )}
                  {images.length > 1 && (
                    <Typography variant="body2" color="text.secondary">
                      {currentImage + 1} / {images.length}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PhotoGallery;