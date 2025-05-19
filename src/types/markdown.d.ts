import React from 'react';

declare module 'react-markdown' {
  interface Components {
    p?: React.FC<{ children?: React.ReactNode }>;
    strong?: React.FC<{ children?: React.ReactNode }>;
    em?: React.FC<{ children?: React.ReactNode }>;
    h1?: React.FC<{ children?: React.ReactNode }>;
    h2?: React.FC<{ children?: React.ReactNode }>;
    h3?: React.FC<{ children?: React.ReactNode }>;
    h4?: React.FC<{ children?: React.ReactNode }>;
    h5?: React.FC<{ children?: React.ReactNode }>;
    h6?: React.FC<{ children?: React.ReactNode }>;
    a?: React.FC<{ href?: string; children?: React.ReactNode }>;
    ul?: React.FC<{ children?: React.ReactNode }>;
    ol?: React.FC<{ children?: React.ReactNode }>;
    li?: React.FC<{ children?: React.ReactNode }>;
    blockquote?: React.FC<{ children?: React.ReactNode }>;
    code?: React.FC<{ children?: React.ReactNode }>;
    pre?: React.FC<{ children?: React.ReactNode }>;
    // Add other components as needed
  }
}

export type Chunks = React.ReactNode;
