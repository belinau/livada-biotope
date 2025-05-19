import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInstructableBySlug, getInstructables } from '@/lib/api/instructables';
import { Box, Container, Typography, Grid, Paper, Divider, Chip, Stack, Avatar } from '@mui/material';
import { MarkdownContent } from '@/components/MarkdownContent';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const instructable = await getInstructableBySlug(params.slug);
  
  if (!instructable) {
    return {
      title: 'Instructable Not Found',
    };
  }

  return {
    title: `${instructable.title} | Instructables`,
    description: instructable.excerpt,
    openGraph: {
      title: instructable.title,
      description: instructable.excerpt,
      images: [instructable.featuredImage],
    },
  };
}

export async function generateStaticParams() {
  const instructables = await getInstructables();
  return instructables.map((instructable) => ({
    slug: instructable.slug,
  }));
}

export default async function InstructablePage({ params }: PageProps) {
  const instructable = await getInstructableBySlug(params.slug);

  if (!instructable) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          {instructable.title}
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          {instructable.author?.avatar && (
            <Avatar src={instructable.author.avatar} alt={instructable.author.name} />
          )}
          <Box>
            <Typography variant="subtitle1">By {instructable.author?.name || 'Livada Team'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(instructable.createdAt).toLocaleDateString()} • {instructable.timeRequired}
            </Typography>
          </Box>
        </Stack>

        <Box mb={4}>
          <Chip 
            label={instructable.difficulty} 
            color={
              instructable.difficulty === 'beginner' ? 'success' : 
              instructable.difficulty === 'intermediate' ? 'warning' : 'error'
            } 
            sx={{ mr: 1 }}
          />
          {instructable.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" size="small" sx={{ mr: 1, mt: 1 }} />
          ))}
        </Box>

        <Box 
          component="img" 
          src={instructable.featuredImage} 
          alt={instructable.title}
          sx={{ 
            width: '100%', 
            maxHeight: '500px', 
            objectFit: 'cover',
            borderRadius: 2,
            mb: 4
          }} 
        />

        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography paragraph>{instructable.excerpt}</Typography>
          
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Materials</Typography>
              <ul>
                {instructable.materials.map((material, index) => (
                  <li key={index}>
                    <Typography>{material}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Tools</Typography>
              <ul>
                {instructable.tools.map((tool, index) => (
                  <li key={index}>
                    <Typography>{tool}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Paper>

        <Box component="section" mb={6}>
          <Typography variant="h4" gutterBottom>Instructions</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {instructable.steps.map((step, index) => (
            <Box key={index} mb={4}>
              <Typography variant="h5" gutterBottom>
                {index + 1}. {step.title}
              </Typography>
              {step.image && (
                <Box 
                  component="img" 
                  src={step.image} 
                  alt={`Step ${index + 1}: ${step.title}`}
                  sx={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: 2,
                    mb: 2
                  }} 
                />
              )}
              <MarkdownContent content={step.content} />
            </Box>
          ))}
        </Box>

        {instructable.relatedInstructables && instructable.relatedInstructables.length > 0 && (
          <Box component="aside" mt={6}>
            <Typography variant="h5" gutterBottom>You Might Also Like</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {instructable.relatedInstructables.map((relatedSlug) => (
                <Grid item xs={12} sm={6} md={4} key={relatedSlug}>
                  {/* You might want to fetch and display related instructables here */}
                  <Typography component={Link} href={`/instructables/${relatedSlug}`}>
                    {relatedSlug}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}
