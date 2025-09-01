import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import { parse } from 'yaml';
import { motion, AnimatePresence } from 'framer-motion';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import ExpandableCard from '../components/ExpandableCard';
import GalleryExpandedContent from '../components/GalleryExpandedContent';

const limit = pLimit(2);

const isLocalDevelopment = process.env.NODE_ENV === 'development';

const getOptimizedImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  if (isLocalDevelopment) {
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  const url = new URL('https://livada.bio');
  url.pathname = `/.netlify/images`;
  url.searchParams.append('url', imagePath);
  url.searchParams.append('w', '1200');
  url.searchParams.append('q', '80');
  return url.toString();
};

const getResponsiveSrcSet = (imagePath) => {
  if (!imagePath || isLocalDevelopment) {
    return imagePath;
  }

  const widths = [400, 600, 800, 1000, 1200, 1600, 2000];
  const url = new URL('https://livada.bio');
  
  return widths.map(width => {
    url.pathname = `/.netlify/images`;
    const params = new URLSearchParams();
    params.append('url', imagePath);
    params.append('w', width.toString());
    params.append('q', '80');
    return `${url.toString()}?${params.toString()} ${width}w`;
  }).join(', ');
};

const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = parse(match[1]) || {};
        const content = rawContent.slice(match[0].length);
        return { metadata, content };
    } catch (e) {
        console.error("Error parsing markdown frontmatter:", e);
        return { metadata: {}, content: rawContent };
    }
};

const LazyImage = ({ src, srcSet, sizes, alt, className, layoutId }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className} style={{ position: 'relative', paddingBottom: '100%' }}>
            {isLoaded && (
                <motion.img
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layoutId={layoutId}
                />
            )}
        </div>
    );
};

function GalleryPage() {
    const { t, language } = useTranslation();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedGallery, setExpandedGallery] = useState(null);
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);
    const [hoveredGalleryItem, setHoveredGalleryItem] = useState(null);
    
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchGalleries = async () => {
          setIsLoading(true);
          try {
              const manifestResponse = await limit(() => fetch('/content/galleries/manifest.json', { signal }));
              if (!manifestResponse.ok) throw new Error('Gallery manifest not found');
              const manifest = await manifestResponse.json();
              const baseFileNames = [...new Set(
                  manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, ''))
              )];

              const fetchedGalleries = await Promise.all(
                  baseFileNames.map(async baseName => {
                      const langFile = `${baseName}.${language}.md`;
                      const defaultLangFile = `${baseName}.sl.md`;
                      let fileToFetch = langFile;
                      let res = await limit(() => fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`, { signal }));
                      
                      if (!res.ok) { fileToFetch = defaultLangFile; res = await limit(() => fetch(`/content/galleries/${fileToFetch}?v=${new Date().getTime()}`, { signal })); } 
                      if (!res.ok) return null;

                      const text = await res.text();
                      const { metadata } = parseMarkdown(text);
                      return { id: baseName, ...metadata };
                  })
              );
              
              const validGalleries = fetchedGalleries.filter(gallery => 
                  gallery && gallery.images && gallery.images.length > 0
              ).sort((a, b) => new Date(b.date) - new Date(a.date));
              
              setGalleries(validGalleries);
          } catch (error) {
              if (error.name !== 'AbortError') {
                console.error("Failed to load galleries:", error);
                setGalleries([]);
              }
          } finally {
              setIsLoading(false);
          }
      };
      
      fetchGalleries();

      return () => {
        controller.abort();
      };
    }, [language]);

    const openImage = (gallery, imageIndex) => {
      setExpandedGallery(gallery);
      setExpandedImageIndex(imageIndex);
    };

    const closeImage = () => {
      setExpandedGallery(null);
      setExpandedImageIndex(null);
    };

    const goToPrev = () => {
      if (!expandedGallery || expandedImageIndex === null) return;
      const totalImages = expandedGallery.images.length;
      const prevIndex = (expandedImageIndex - 1 + totalImages) % totalImages;
      setExpandedImageIndex(prevIndex);
    };

    const goToNext = () => {
      if (!expandedGallery || expandedImageIndex === null) return;
      const totalImages = expandedGallery.images.length;
      const nextIndex = (expandedImageIndex + 1) % totalImages;
      setExpandedImageIndex(nextIndex);
    };

    useEffect(() => {
      if (!expandedGallery || expandedImageIndex === null) return; 
      
      const { images } = expandedGallery;
      const totalImages = images.length;
      const nextIndex = (expandedImageIndex + 1) % totalImages;
      const prevIndex = (expandedImageIndex - 1 + totalImages) % totalImages;
      
      const preloadImage = (url) => {
        const img = new Image();
        img.src = url;
      };
      
      preloadImage(images[nextIndex].image);
      preloadImage(images[prevIndex].image);
    }, [expandedGallery, expandedImageIndex]);

    if (isLoading) {
      return (
        <Page title={t('navGallery')}> 
            <Section title={t('navGallery')}> 
                <div className="text-body text-center py-10 text-text-muted">{t('loading')}...</div>
            </Section>
        </Page>
      );
    }

    if (!isLoading && galleries.length === 0) {
        return (
            <Page title={t('navGallery')}> 
                <Section title={t('navGallery')}> 
                    <p className="text-body text-center text-text-muted">{t('noGalleriesAvailable')}</p>
                </Section>
            </Page>
        );
    }

    return (
        <Page title={t('navGallery')}> 
            <Section title={t('navGallery')}> 
                <div className="space-y-16 max-w-3xl mx-auto">
                    {galleries.map((gallery) => (
                        <article key={gallery.id}>
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-mono text-primary">{gallery.title}</h3>
                                {gallery.date && (
                                    <p className="text-sm text-text-muted mt-1">
                                        {new Date(gallery.date).toLocaleDateString(language, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                                {gallery.description && (
                                    <p className="prose mt-2 max-w-2xl mx-auto text-text-muted">
                                        {gallery.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {gallery.images.map((image, index) => {
                                    const caption = language === 'sl' 
                                        ? image.caption_sl 
                                        : (image.caption_en || image.caption_sl);
                                    
                                    return (
                                        <a
                                            key={`${gallery.id}-${index}`}
                                            className="relative group block p-2 h-full w-full"
                                            onMouseEnter={() => setHoveredGalleryItem(`${gallery.id}-${index}`)}
                                            onMouseLeave={() => setHoveredGalleryItem(null)}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openImage(gallery, index);
                                            }}
                                            layoutId={`gallery-${gallery.id}-${index}`}
                                        >
                                            <AnimatePresence>
                                                {hoveredGalleryItem === `${gallery.id}-${index}` && (
                                                    <motion.span
                                                        className="absolute inset-0 h-full w-full bg-[var(--ch-border)] block rounded-3xl opacity-70"
                                                        layoutId="hoverBackground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.7 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.15 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                            
                                            <motion.div 
                                              layoutId={`gallery-img-${gallery.id}-${index}`}
                                              className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden group relative text-left w-full h-full border-2 border-transparent group-hover:border-[var(--ch-border)]"
                                            >
                                                <LazyImage
                                                    src={getOptimizedImageUrl(image.image)}
                                                    srcSet={getResponsiveSrcSet(image.image)}
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    alt={caption || gallery.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                
                                                {(caption || gallery.author) && (
                                                    <div className="p-3 text-sm">
                                                        {caption && (
                                                            <p className="text-text-main line-clamp-2" title={caption}>
                                                                {caption}
                                                            </p>
                                                        )}
                                                        {gallery.author && (
                                                            <p className="text-xs text-text-muted mt-1 flex items-center">
                                                                <svg 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    className="h-4 w-4 mr-1.5 opacity-70"
                                                                    viewBox="0 0 20 20" 
                                                                    fill="currentColor"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path 
                                                                        fillRule="evenodd" 
                                                                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" 
                                                                        clipRule="evenodd" 
                                                                    />
                                                                </svg>
                                                                <span>
                                                                    {t('photoBy')}: {gallery.author}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        </a>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>

                {expandedGallery && expandedImageIndex !== null && (
                  <ExpandableCard
                    isExpanded={!!expandedGallery}
                    onToggle={(expanded) => {
                      if (!expanded) {
                        closeImage();
                      }
                    }}
                    layoutId={`gallery-${expandedGallery.id}-${expandedImageIndex}`}
                    expandedContent={
                      <GalleryExpandedContent
                        gallery={expandedGallery}
                        imageIndex={expandedImageIndex}
                        goToPrev={goToPrev}
                        goToNext={goToNext}
                        currentIndex={expandedImageIndex}
                        totalImages={expandedGallery.images.length}
                        t={t}
                        language={language}
                      />
                    }
                    className="relative group block p-2 h-full w-full"
                    expandedClassName="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-sm sm:rounded-3xl overflow-auto"
                    closeOnBackdropClick={true}
                    closeOnEscape={true}
                  />
                )}
            </Section>
        </Page>
    );
}

export default GalleryPage;
