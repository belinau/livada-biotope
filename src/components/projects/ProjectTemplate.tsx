import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Typography, Paper, Grid, Button, Divider, Chip, Card, CardContent, CardActions } from '@mui/material';
import { Project } from '@/types/project';
import TranslationLoader from '@/components/TranslationLoader';
import StylizedImage from '@/components/StylizedImage';
import MarkdownContent from '@/components/MarkdownContent';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

interface ProjectTemplateProps {
  project: Project;
  projects: Project[];
}

export default function ProjectTemplate({ project, projects }: ProjectTemplateProps) {
  const router = useRouter();
  const { locale } = router;
  
  const getContent = (en: string, sl: string) => (locale === 'en' ? en : sl);
  
  // Extract content based on language
  const title = getContent(project.title_en, project.title_sl);
  const summary = getContent(project.summary_en, project.summary_sl);
  
  // Parse the markdown content
  const content = project.content;
  
  // Find related projects (excluding current project)
  const relatedProjects = projects
    .filter(p => p.slug !== project.slug)
    .slice(0, 2); // Show max 2 related projects

  return (
    <>
      <TranslationLoader />
      <Head>
        <title>{`${title} | Livada Biotope`}</title>
        <meta name="description" content={summary} />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" component="nav">
            <StyledLink href="/">
              {locale === 'en' ? 'Home' : 'Domov'}
            </StyledLink>
            {' / '}
            <StyledLink href="/projects">
              {locale === 'en' ? 'Projects' : 'Projekti'}
            </StyledLink>
            {' / '}
            <Typography component="span" color="primary.main" fontWeight="medium" display="inline">
              {title}
            </Typography>
          </Typography>
        </Box>
        
        {/* Project Header */}
        <Paper elevation={2} sx={{ mb: 6, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary.main">
              {title}
            </Typography>
            
            {project.status && (
              <Chip 
                label={project.status} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mb: 2 }}
              />
            )}
            
            <Typography variant="body1" paragraph>
              {summary}
            </Typography>
            
            {project.partners && project.partners.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {locale === 'en' ? 'Partners:' : 'Partnerji:'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {project.partners.map((partner, index) => (
                    <Chip 
                      key={index} 
                      label={partner} 
                      variant="outlined" 
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
          
          {project.thumbnail && (
            <Box sx={{ width: '100%', height: { xs: 300, md: 500 }, position: 'relative' }}>
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                <StylizedImage
                  speciesName={{
                    en: project.title_en || 'Project',
                    sl: project.title_sl || 'Projekt'
                  }}
                  latinName="Project"
                  backgroundColor="#f8f5e6"
                  patternColor="#2e7d32"
                  pattern="lines"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  imageSrc={project.thumbnail}
                />
              </Box>
            </Box>
          )}
        </Paper>
        
        {/* Project Content */}
        <Box sx={{ mb: 8 }}>
          <MarkdownContent content={content} />
        </Box>
        
        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" component="h2" gutterBottom color="primary.main">
              {locale === 'en' ? 'Related Projects' : 'Sorodni projekti'}
            </Typography>
            <Divider sx={{ mb: 4 }} />
            
            <Grid container spacing={4}>
              {relatedProjects.map((relatedProject) => (
                <Grid item xs={12} md={6} key={relatedProject.slug}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: 200, overflow: 'hidden' }}>
                      <StylizedImage 
                        speciesName={{ en: "Project Image", sl: "Slika projekta" }}
                        latinName="Project"
                        backgroundColor="#f8f5e6"
                        patternColor="#2e7d32"
                        pattern="lines"
                        height="100%"
                        width="100%"
                        imageSrc={relatedProject.thumbnail || "/images/illustrations/botanical-placeholder.jpg"}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                        {getContent(relatedProject.title_en, relatedProject.title_sl)}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {getContent(relatedProject.summary_en, relatedProject.summary_sl)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined"
                        component={StyledLink}
                        href={`/projects/${relatedProject.slug}`}
                        sx={{ fontWeight: 'medium' }}
                      >
                        {locale === 'en' ? 'Learn More' : 'Več o tem'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Back to Projects */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="outlined" 
            component={StyledLink}
            href="/projects"
            sx={{ fontWeight: 'medium' }}
          >
            {locale === 'en' ? 'Back to All Projects' : 'Nazaj na vse projekte'}
          </Button>
        </Box>
      </Container>
    </>
  );
}
