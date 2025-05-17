import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { getAllPosts, Post } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import BlogLayout from '@/components/layout/BlogLayout';

interface BlogIndexProps {
  posts: Post[];
}

const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => {
  return (
    <BlogLayout>
      <Head>
        <title>Blog | Livada Biotope</title>
        <meta name="description" content="Read our latest articles on regenerative agriculture and biodiversity" />
      </Head>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
          Blog
        </Typography>
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.slug}>
              <Link href={`/blog/${post.slug}`} passHref>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  {post.frontMatter.coverImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.frontMatter.coverImage}
                      alt={post.frontMatter.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {post.frontMatter.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {format(new Date(post.frontMatter.date), 'MMMM d, yyyy')}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {post.frontMatter.excerpt || post.frontMatter.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </BlogLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  return {
    props: { posts },
  };
};

export default BlogIndex;
