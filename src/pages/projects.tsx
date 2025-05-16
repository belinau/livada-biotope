import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '@/components/TranslationLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import StylizedImage from '@/components/StylizedImage';
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
          {projects.map((project, index) => (
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
  const projectsDirectory = path.join(process.cwd(), 'src/content/projects');
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames
    .filter((filename) => filename.endsWith('.md') && filename !== 'example-bilingual-project.md')
    .map((filename) => {
      const filePath = path.join(projectsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        ...data,
        slug: filename.replace(/\.md$/, ''),
        content,
      } as Project;
    })
    // Sort by date in descending order
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return {
    props: {
      projects,
    },
  };
};
