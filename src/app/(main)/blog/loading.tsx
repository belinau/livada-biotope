import { Box, Skeleton, Container, Grid, Card, CardContent } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={6}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} />
      </Box>
      
      {/* Tag Filter Skeleton */}
      <Box mb={4}>
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton 
                variant="rectangular" 
                height={200} 
                sx={{ 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }} 
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
                
                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                  <Skeleton variant="rounded" width={70} height={24} />
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </Box>
                
                <Skeleton 
                  variant="text" 
                  width={120} 
                  height={20} 
                  sx={{ mt: 2, display: 'block' }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}