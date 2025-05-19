'use client';

import { useTranslations } from 'next-intl';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  useTheme, 
  useMediaQuery,
  alpha
} from '@mui/material';

export default function HomeContent() {
  const t = useTranslations('common');
  const tNav = useTranslations('navigation');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 4 : 6,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box 
        textAlign="center" 
        mb={isMobile ? 4 : 6}
        sx={{
          opacity: 0,
          animation: 'fadeIn 0.8s ease-out forwards',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'primary.main',
          }}
        >
          {t('welcome')}
        </Typography>
        <Typography 
          variant={isMobile ? 'body1' : 'h6'} 
          color="text.secondary"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          {t('landBasedPractices')}
        </Typography>
      </Box>
      
      <Grid 
        container 
        spacing={isMobile ? 2 : 4} 
        justifyContent="center"
        sx={{
          opacity: 0,
          animation: 'fadeIn 0.8s ease-out 0.3s forwards',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {['about', 'projects', 'events'].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Paper 
              component="a"
              href={`#${item}`}
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
                background: isDark 
                  ? alpha(theme.palette.background.paper, 0.7) 
                  : alpha(theme.palette.background.default, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark 
                  ? alpha(theme.palette.divider, 0.3) 
                  : alpha(theme.palette.divider, 0.1)
                }`,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                {tNav(item as any)}
              </Typography>
              <Typography 
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  lineHeight: 1.6,
                }}
              >
                {t(`${item}.description` as any)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
