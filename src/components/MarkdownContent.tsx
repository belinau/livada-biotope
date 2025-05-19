'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import Image from 'next/image';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const components = {
  // Customize heading styles
  h1: ({ node, ...props }: any) => (
    <Typography variant="h3" component="h1" gutterBottom {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <Typography variant="h4" component="h2" gutterBottom mt={4} mb={2} {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <Typography variant="h5" component="h3" gutterBottom mt={3} mb={1.5} {...props} />
  ),
  h4: ({ node, ...props }: any) => (
    <Typography variant="h6" component="h4" gutterBottom mt={2} mb={1} {...props} />
  ),
  // Style paragraphs
  p: ({ node, ...props }: any) => (
    <Typography variant="body1" paragraph {...props} />
  ),
  // Style links
  a: ({ node, ...props }: any) => (
    <MuiLink href={props.href} target="_blank" rel="noopener noreferrer" color="primary">
      {props.children}
    </MuiLink>
  ),
  // Style lists
  ul: ({ node, ...props }: any) => (
    <Box component="ul" sx={{ pl: 3, mb: 2 }} {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <Box component="ol" sx={{ pl: 3, mb: 2 }} {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <Typography component="li" variant="body1" {...props}>
      {props.children}
    </Typography>
  ),
  // Style code blocks
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={materialDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  // Style images
  img: ({ node, ...props }: any) => (
    <Box 
      component="div" 
      sx={{ 
        my: 3,
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          boxShadow: 1,
        }
      }}
    >
      <img 
        src={props.src} 
        alt={props.alt || ''} 
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {props.alt && (
        <Typography variant="caption" component="div" sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}>
          {props.alt}
        </Typography>
      )}
    </Box>
  ),
  // Style blockquotes
  blockquote: ({ node, ...props }: any) => (
    <Box
      component="blockquote"
      sx={{
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        pl: 2,
        py: 0.5,
        my: 2,
        backgroundColor: 'action.hover',
        borderRadius: '0 4px 4px 0',
      }}
      {...props}
    />
  ),
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <Box className={className}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default MarkdownContent;
