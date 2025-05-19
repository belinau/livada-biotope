import { Metadata } from 'next';
import { getInstructables } from '@/lib/api/instructables';
import { Box, Container, Grid, Typography, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Instructables',
  description: 'Step-by-step guides and tutorials for sustainable living',
};

export const revalidate = 3600; // Revalidate at most every hour

export default async function InstructablesPage() {
  const instructables = await getInstructables();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Instructables
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Step-by-step guides for sustainable living and DIY projects
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {instructables.map((instructable) => (
          <Grid item key={instructable.slug} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} href={`/instructables/${instructable.slug}`}>
                <CardMedia
                  component="img"
                  height="200"
                  image={instructable.featuredImage}
                  alt={instructable.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {instructable.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {instructable.excerpt}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
