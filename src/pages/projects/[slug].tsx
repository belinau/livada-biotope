import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getProjectBySlug, getAllProjects } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Box, 
  Container, 
  Typography, 
  Chip,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import StylizedImage from '@/components/StylizedImage';

interface ProjectProps {
  project: {
    slug: string;
    frontmatter: {
      title_en: string;
      title_sl: string;
      summary_en: string;
      summary_sl: string;
      thumbnail?: string;
      details: {
        startDate: string;
        endDate?: string;
        status?: string;
        partners?: string[];
      };
    };
    content_en: MDXRemoteSerializeResult;
    content_sl: MDXRemoteSerializeResult;
  };
}

export default function ProjectPage({ project }: ProjectProps) {
  const { language } = useLanguage();
  
  // Get the appropriate content based on the current language
  const title = language === 'en' ? project.frontmatter.title_en : project.frontmatter.title_sl;
  const summary = language === 'en' ? project.frontmatter.summary_en : project.frontmatter.summary_sl;
  const content = language === 'en' ? project.content_en : project.content_sl;
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            {project.frontmatter.details.status && (
              <Chip 
                label={project.frontmatter.details.status}
                size="small"
                color={
                  project.frontmatter.details.status === 'In Progress' ? 'primary' :
                  project.frontmatter.details.status === 'Completed' ? 'success' : 'default'
                }
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {project.frontmatter.details.startDate && (
              <Chip 
                label={`${language === 'en' ? 'Started' : 'Začetek'}: ${new Date(project.frontmatter.details.startDate).toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US')}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {project.frontmatter.details.endDate && (
              <Chip 
                label={`${language === 'en' ? 'Ends' : 'Konec'}: ${new Date(project.frontmatter.details.endDate).toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US')}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4, fontStyle: 'italic' }}>
            {summary}
          </Typography>
          
          {project.frontmatter.thumbnail && (
            <Box sx={{ mb: 4, height: 400, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <StylizedImage 
                speciesName={{
                  en: project.frontmatter.title_en,
                  sl: project.frontmatter.title_sl
                }}
                backgroundColor="#f8f5e6"
                patternColor="#2e7d32"
                pattern="dots"
                height="100%"
                width="100%"
                hideLatinName={true}
              />
            </Box>
          )}
          
          {project.frontmatter.details.partners && project.frontmatter.details.partners.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'en' ? 'Partners' : 'Partnerji'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.frontmatter.details.partners.map((partner, index) => (
                  <Chip 
                    key={index}
                    label={partner}
                    size="small"
                    sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.light' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ typography: 'body1' }}>
          <MDXRemote {...content} />
        </Box>
      </Paper>
    </Container>
  );
}

// Add getLayout function to the page
ProjectPage.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = getAllProjects();
  
  const paths = projects.map((project) => ({
    params: {
      slug: project.slug,
    },
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = getProjectBySlug(params?.slug as string);
  
  // Split the content into English and Slovenian parts
  const parts = project.content.split('<!-- Slovenian Content -->');
  const englishContent = parts[0].replace('<!-- English Content -->', '').trim();
  const slovenianContent = parts.length > 1 ? parts[1].trim() : '';
  
  // Serialize both language contents
  const content_en = await serialize(englishContent);
  const content_sl = await serialize(slovenianContent);
  
  return {
    props: {
      project: {
        ...project,
        content_en,
        content_sl,
      },
    },
  };
};
