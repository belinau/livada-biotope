import dynamic from 'next/dynamic';
import { Box, Skeleton } from '@mui/material';
import type { StylizedImageClientProps } from './StylizedImageClient';

const StylizedImageComponent = dynamic<StylizedImageClientProps>(
  () => import('./StylizedImageClient').then(mod => mod.default as any),
  {
    loading: () => (
      <Box sx={{ 
        width: '100%', 
        height: 300, 
        bgcolor: 'grey.200',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    ),
    ssr: false,
  }
);

export default StylizedImageComponent;