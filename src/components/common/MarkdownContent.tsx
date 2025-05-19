'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import { Chunks } from '@/types/markdown';

interface MarkdownContentProps {
  content: string;
}

const components = {
  p: ({ children }: { children?: Chunks }) => (
    <Typography paragraph>{children}</Typography>
  ),
  strong: ({ children }: { children?: Chunks }) => (
    <strong>{children}</strong>
  ),
  em: ({ children }: { children?: Chunks }) => (
    <em>{children}</em>
  ),
  h1: ({ children }: { children?: Chunks }) => (
    <Typography variant="h1" gutterBottom>{children}</Typography>
  ),
  h2: ({ children }: { children?: Chunks }) => (
    <Typography variant="h2" gutterBottom>{children}</Typography>
  ),
  h3: ({ children }: { children?: Chunks }) => (
    <Typography variant="h3" gutterBottom>{children}</Typography>
  ),
  h4: ({ children }: { children?: Chunks }) => (
    <Typography variant="h4" gutterBottom>{children}</Typography>
  ),
  h5: ({ children }: { children?: Chunks }) => (
    <Typography variant="h5" gutterBottom>{children}</Typography>
  ),
  h6: ({ children }: { children?: Chunks }) => (
    <Typography variant="h6" gutterBottom>{children}</Typography>
  ),
  a: ({ href, children }: { href?: string; children?: Chunks }) => (
    <MuiLink href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </MuiLink>
  ),
  ul: ({ children }: { children?: Chunks }) => (
    <Box component="ul" sx={{ pl: 2, mb: 2 }}>{children}</Box>
  ),
  ol: ({ children }: { children?: Chunks }) => (
    <Box component="ol" sx={{ pl: 2, mb: 2 }}>{children}</Box>
  ),
  li: ({ children }: { children?: Chunks }) => (
    <Box component="li" sx={{ mb: 1 }}>{children}</Box>
  ),
  blockquote: ({ children }: { children?: Chunks }) => (
    <Box 
      component="blockquote" 
      sx={{ 
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        pl: 2,
        my: 2,
        fontStyle: 'italic',
        color: 'text.secondary'
      }}
    >
      {children}
    </Box>
  ),
  code: ({ children }: { children?: Chunks }) => (
    <Box 
      component="code" 
      sx={{
        backgroundColor: 'action.hover',
        px: 0.5,
        borderRadius: 0.5,
        fontFamily: 'monospace',
        fontSize: '0.9em'
      }}
    >
      {children}
    </Box>
  ),
  pre: ({ children }: { children?: Chunks }) => (
    <Box 
      component="pre" 
      sx={{
        backgroundColor: 'background.paper',
        p: 2,
        borderRadius: 1,
        overflowX: 'auto',
        my: 2
      }}
    >
      {children}
    </Box>
  ),
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
