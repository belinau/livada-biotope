import { Metadata } from 'next';
import { Typography, Box, Button, Container, Grid, Card, CardContent, Divider } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import StylizedImage from '../../../components/StylizedImage';

interface ProjectsPageProps {
  params: {
    locale: string;
  };
}

interface Project {
  slug: string;
  title_en: string;
  title_sl: string;
  summary_en: string;
  summary_sl: string;
  date: string;
  status: string;
  partners: string[];
  thumbnail: string;
}

async function getProjects(): Promise<Project[]> {
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

            return {
              slug: filename.replace(/\.md$/, ''),
              title_en: data.title_en || 'Untitled Project',
              title_sl: data.title_sl || 'Neimenovan projekt',
              summary_en: data.summary_en || '',
              summary_sl: data.summary_sl || '',
              date: data.date || new Date().toISOString(),
              status: data.status || 'In Progress',
              partners: data.partners || [],
              thumbnail: data.thumbnail || '',
              ...data,
              content,
            } as Project;
          } catch (error) {
            console.error(`Error processing project file ${filename}:`, error);
            return null;
          }
        })
    );

    // Filter out any failed project loads and sort by date
    return projects
      .filter((project): project is Project => project !== null)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export async function generateMetadata({
  params: { locale },
}: ProjectsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects.metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      siteName: 'Livada Biotope',
    },
  };
}

export default async function ProjectsPage({ params: { locale } }: ProjectsPageProps) {
  // Set the request locale for this page
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('projects');
  
  const projects = await getProjects();

  const getContent = (en: string, sl: string) => (locale === 'en' ? en : sl);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom color="primary.main">
          {t('title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" maxWidth="md" mx="auto">
          {t('subtitle')}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 6 }} />
      
      {projects.length > 0 ? (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.slug}>
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
                  <Typography gutterBottom variant="h5" component="h2">
                    {getContent(project.title_en, project.title_sl)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.status}
                  </Typography>
                  <Typography paragraph>
                    {getContent(project.summary_en, project.summary_sl)}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {project.partners.map((partner) => (
                      <Box
                        key={partner}
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      >
                        {partner}
                      </Box>
                    ))}
                  </Box>
                  <Button
                    component={Link}
                    href={`/projects/${project.slug}`}
                    variant="contained"
                    color="primary"
                  >
                    {t('learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
          <Typography variant="body1">
            {t('noProjects')}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
