import { Box, Container, Skeleton, Grid } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={6}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={40} />
      </Box>
      
      {/* Tag Filter Skeleton */}
      <Box mb={6}>
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        <Box display="flex" gap={1} flexWrap="wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              width={Math.floor(Math.random() * 80) + 60} 
              height={32} 
            />
          ))}
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item key={item} xs={12} sm={6} lg={4}>
            <Box sx={{ position: 'relative', aspectRatio: '16/9' }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%"
                sx={{ 
                  borderRadius: 1,
                  transform: 'none',
                }} 
              />
            </Box>
            <Box mt={2}>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
              <Box display="flex" gap={1} mt={1.5}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
