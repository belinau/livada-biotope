import { Box, Skeleton, Container, Divider, Grid, Stack, Avatar } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={120} height={40} sx={{ mb: 3 }} />
      
      <Box mb={6}>
        <Skeleton variant="text" width="80%" height={80} sx={{ mb: 3 }} />
        
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={3} mb={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} height={24} />
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={150} height={24} />
          </Box>
          
          <Box flexGrow={1} />
          
          <Box display="flex" gap={1}>
            <Skeleton variant="rounded" width={70} height={32} />
            <Skeleton variant="rounded" width={60} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </Box>
        </Box>
        
        <Skeleton 
          variant="rectangular" 
          height={400} 
          sx={{ 
            borderRadius: 2, 
            mb: 4,
            boxShadow: 3,
          }} 
        />
        
        <Box sx={{ '& > *': { mb: 3 } }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" width={`${100 - i * 2}%`} />
          ))}
          
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, my: 4 }} />
          
          {[...Array(3)].map((_, i) => (
            <Skeleton key={`p2-${i}`} variant="text" width={`${95 - i * 3}%`} />
          ))}
          
          <Skeleton variant="text" width="60%" height={40} sx={{ mt: 4 }} />
          <Skeleton variant="text" width="50%" />
          
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`p3-${i}`} variant="text" width={`${90 - i * 2}%`} />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ my: 6 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto' }} />
      </Divider>
      
      <Grid container spacing={4}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ 
                borderRadius: 2,
                mb: 2,
              }} 
            />
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}