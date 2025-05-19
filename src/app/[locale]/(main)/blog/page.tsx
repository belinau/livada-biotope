import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/config/i18n';
import Link from 'next/link';

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  return {
    title: 'Blog',
    description: 'Latest articles and updates',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Mock data - replace with actual data fetching
type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  // Replace with actual data fetching
  return [
    {
      slug: 'first-post',
      title: 'First Blog Post',
      excerpt: 'This is the first blog post in our new website.',
      date: '2023-01-01',
    },
    {
      slug: 'second-post',
      title: 'Second Blog Post',
      excerpt: 'Another interesting article about our projects.',
      date: '2023-01-15',
    },
  ];
}

export default async function BlogPage({ params: { locale } }: Props) {
  // This will ensure the locale is valid
  if (!locales.includes(locale as any)) notFound();
  
  const t = await getTranslations('blog');
  const posts = await getBlogPosts(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link 
                href={`/${locale}/blog/${post.slug}`}
                className="hover:text-primary-600 transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <p className="mt-2 text-gray-700">{post.excerpt}</p>
            <Link 
              href={`/${locale}/blog/${post.slug}`}
              className="inline-block mt-2 text-primary-600 hover:underline"
            >
              {t('readMore')} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
