import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <Typography variant="h3" component="h1" gutterBottom color="primary.main" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <Typography variant="h4" component="h2" gutterBottom color="primary.main" sx={{ mt: 4, mb: 2 }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3, mb: 1.5 }} {...props} />
        ),
        h4: ({ node, ...props }) => (
          <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 2.5, mb: 1.25 }} {...props} />
        ),
        p: ({ node, ...props }) => (
          <Typography variant="body1" paragraph {...props} />
        ),
        a: ({ node, href, ...props }) => (
          <MuiLink href={href} target="_blank" rel="noopener noreferrer" color="primary" {...props} />
        ),
        ul: ({ node, ordered, ...props }) => (
          <Box component="ul" sx={{ pl: 3, mb: 2 }} {...props} />
        ),
        ol: ({ node, ordered, ...props }) => (
          <Box component="ol" sx={{ pl: 3, mb: 2 }} {...props} />
        ),
        li: ({ node, ordered, ...props }) => (
          <li>
            <Typography component="span" variant="body1">
              {props.children}
            </Typography>
          </li>
        ),
        blockquote: ({ node, ...props }) => (
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
          />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={atomDark}
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
