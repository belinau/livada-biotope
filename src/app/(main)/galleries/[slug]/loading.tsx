import { Box, Container, Skeleton, Grid, Button } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="rectangular" width={120} height={40} sx={{ mb: 3, borderRadius: 1 }} />
      
      <Box mb={6}>
        <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
        
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Skeleton variant="text" width={200} height={24} />
          <Box display="flex" gap={1} ml="auto">
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={70} height={24} />
          </Box>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <Grid item key={item} xs={12} sm={6} md={4}>
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
          </Grid>
        ))}
      </Grid>
      
      <Box mt={6} pt={4} borderTop={1} borderColor="divider">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item>
            <Skeleton variant="rectangular" width={180} height={36} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
