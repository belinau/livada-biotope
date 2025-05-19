import { Box, Skeleton, Container, Grid, Divider } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Skeleton variant="text" width="80%" height={80} />
        
        <Box display="flex" alignItems="center" mb={3}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box ml={2}>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
        </Box>
        
        <Box mb={4}>
          <Skeleton variant="text" width={100} height={32} />
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={60} height={32} />
            <Skeleton variant="rounded" width={70} height={32} />
          </Box>
        </Box>
        
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 4 }} />
        
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={120} height={40} />
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="text" width={`${90 - item * 10}%`} />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={40} />
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="text" width={`${85 - item * 10}%`} />
            ))}
          </Grid>
        </Grid>
        
        <Skeleton variant="text" width={200} height={48} />
        <Divider sx={{ my: 2 }} />
        
        {[1, 2, 3, 4].map((step) => (
          <Box key={step} mb={4}>
            <Skeleton variant="text" width={`${70 - step * 5}%`} height={40} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mt: 2, mb: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="90%" />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
