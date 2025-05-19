'use client';

import { Container, Grid, Card, CardContent, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                <Skeleton width="75%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="50%" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
