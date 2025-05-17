import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '@/components/TranslationLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@/components/ui/Grid'; // Updated to use our custom Grid
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Project } from '@/types/project';

interface ProjectsPageProps {
  projects: Project[];
}

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function Projects({ projects }: ProjectsPageProps) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const getContent = (en: string, sl: string) => (language === 'en' ? en : sl);

  return (
    <>
      <TranslationLoader />
      <Head>
        <title>{t('projects.title')} | Livada Biotope</title>
        <meta name="description" content={t('projects.description')} />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom color="primary.main">
            {t('projects.title')}
          </Typography>
          <Typography variant="h5" color="text.secondary" maxWidth="md" mx="auto">
            {t('projects.subtitle')}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 6 }} />
        
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.slug} component="div">
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 200, overflow: 'hidden' }}>
                  <StylizedImage 
                    speciesName={project.thumbnail ? 
                      { en: "Project Image", sl: "Slika projekta" } : 
                      { en: "Project Placeholder", sl: "Ogrodna slika projekta" }
                    }
                    latinName="Project"
                    backgroundColor="#f8f5e6"
                    patternColor="#2e7d32"
                    pattern="lines"
                    height="100%"
                    width="100%"
                    imageSrc={project.thumbnail || "/images/illustrations/botanical-placeholder.jpg"}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom color="primary.main">
                    {getContent(project.title_en, project.title_sl)}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {getContent(project.summary_en, project.summary_sl)}
                  </Typography>
                  {project.status && (
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Status: {project.status}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="outlined"
                    component={StyledLink}
                    href={`/projects/${project.slug}`}
                    sx={{ fontWeight: 'medium' }}
                  >
                    {language === 'en' ? 'Learn More' : 'Več o tem'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const matter = (await import('gray-matter')).default;
    
    const projectsDirectory = path.join(process.cwd(), 'src/content/projects');
    const filenames = await fs.readdir(projectsDirectory);

    const projects = await Promise.all(
      filenames
        .filter((filename) => filename.endsWith('.md') && filename !== 'example-bilingual-project.md')
        .map(async (filename) => {
          try {
            const filePath = path.join(projectsDirectory, filename);
            const fileContents = await fs.readFile(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            // Ensure all required fields have default values
            return {
              title_en: data.title_en || 'Untitled Project',
              title_sl: data.title_sl || 'Neimenovan projekt',
              summary_en: data.summary_en || '',
              summary_sl: data.summary_sl || '',
              date: data.date || new Date().toISOString(),
              status: data.status || 'In Progress',
              partners: data.partners || [],
              thumbnail: data.thumbnail || '',
              ...data,
              slug: filename.replace(/\.md$/, ''),
              content,
            } as Project;
          } catch (error) {
            console.error(`Error processing project file ${filename}:`, error);
            return null;
          }
        })
    );

    // Filter out any failed project loads and sort by date
    const validProjects = projects
      .filter((project): project is Project => project !== null)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

    return {
      props: {
        projects: validProjects,
      },
      revalidate: 3600 // Revalidate at most once per hour
    };
  } catch (error) {
    console.error('Error loading projects:', error);
    return {
      props: {
        projects: []
      },
      revalidate: 60 // Retry after 1 minute on error
    };
  }
};
