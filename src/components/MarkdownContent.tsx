import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.css';

interface MarkdownContentProps {
  content: string;
}

type CodeComponentProps = {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};

// Helper type for ReactMarkdown components
type ReactMarkdownComponentProps = {
  node?: unknown;
  children?: React.ReactNode;
  [key: string]: any;
};

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Initialize syntax highlighting
  useEffect(() => {
    // Apply syntax highlighting to all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  // Create styled components for markdown elements
  const components = {
    h1: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Typography variant="h3" component="h1" gutterBottom color="primary.main" {...props}>
        {children}
      </Typography>
    ),
    h2: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Typography variant="h4" component="h2" gutterBottom color="primary.main" sx={{ mt: 4, mb: 2 }} {...props}>
        {children}
      </Typography>
    ),
    h3: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3, mb: 1.5 }} {...props}>
        {children}
      </Typography>
    ),
    h4: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 2.5, mb: 1.25 }} {...props}>
        {children}
      </Typography>
    ),
    p: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Typography variant="body1" paragraph {...props}>
        {children}
      </Typography>
    ),
    a: ({ children, href, ...props }: ReactMarkdownComponentProps & { href?: string }) => (
      <MuiLink href={href} target="_blank" rel="noopener noreferrer" color="primary" {...props}>
        {children}
      </MuiLink>
    ),
    ul: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Box component="ul" sx={{ pl: 3, mb: 2 }} {...props}>
        {children}
      </Box>
    ),
    ol: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Box component="ol" sx={{ pl: 3, mb: 2 }} {...props}>
        {children}
      </Box>
    ),
    li: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <li {...props}>
        <Typography component="span" variant="body1">
          {children}
        </Typography>
      </li>
    ),
    blockquote: ({ children, ...props }: ReactMarkdownComponentProps) => (
      <Box 
        component="blockquote" 
        sx={{ 
          borderLeft: '4px solid', 
          borderColor: 'primary.main', 
          pl: 2, 
          ml: 0, 
          my: 2,
          color: 'text.secondary',
          fontStyle: 'italic'
        }} 
        {...props}
      >
        {children}
      </Box>
    ),
    code: ({ className, children, inline }: Omit<CodeComponentProps, 'node'>) => {
      if (inline) {
        return <code className={className}>{children}</code>;
      }
      
      return (
        <Box component="pre" sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <code className={className}>
            {children}
          </code>
        </Box>
      );
    },
  };

  return (
    <Box>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownContent;
