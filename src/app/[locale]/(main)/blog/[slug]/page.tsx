import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';
import Link from 'next/link';

type Props = {
  params: { 
    locale: string;
    slug: string;
  };
};

export function generateMetadata({ params: { locale, slug } }: Props): Metadata {
  // In a real app, you would fetch the post data here
  const post = {
    title: 'Blog Post Title',
    description: 'Blog post description',
    // Add other metadata fields as needed
  };

  return {
    title: post.title,
    description: post.description,
  };
}

export function generateStaticParams() {
  // In a real app, you would fetch all blog post slugs here
  const posts = [
    { slug: 'first-post' },
    { slug: 'second-post' },
  ];

  return locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}

// Mock function to fetch blog post data
async function getBlogPost(slug: string, locale: string) {
  // Replace with actual data fetching
  return {
    title: 'Blog Post Title',
    content: '<p>This is the blog post content.</p>',
    date: '2023-01-01',
    author: 'Author Name',
  };
}

export default async function BlogPostPage({ params: { locale, slug } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('blog');
  const post = await getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link 
        href={`/${locale}/blog`}
        className="inline-flex items-center text-primary-600 hover:underline mb-6"
      >
        ← {t('backToBlog')}
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      
      <div className="mt-12 pt-6 border-t">
        <Link 
          href={`/${locale}/blog`}
          className="inline-flex items-center text-primary-600 hover:underline"
        >
          ← {t('backToBlog')}
        </Link>
      </div>
    </div>
  );
}
