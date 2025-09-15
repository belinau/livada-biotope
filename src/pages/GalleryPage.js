import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import Page from '../components/layout/Page';
import { GlassSection } from '../components/ui/GlassSection';
import { getGlassVariant } from '../components/glass-theme';
import { HoverEffect } from '../components/ui/HoverEffect';
import ExpandableCard from '../components/ExpandableCard';
import GalleryExpandedContent from '../components/GalleryExpandedContent';
import pLimit from 'p-limit';
import { parse as yamlParse } from 'yaml';
import MetaTags from '../components/MetaTags';

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

const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = yamlParse(match[1]) || {};
        const content = rawContent.slice(match[0].length);
        return { metadata, content };
    } catch (e) {
        console.error("Error parsing markdown frontmatter:", e);
        return { metadata: {}, content: rawContent };
    }
};

function GalleryPage() {
    const { t, language } = useTranslation();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedGallery, setExpandedGallery] = useState(null);
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);
    
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

                      let primaryData = null;
                      let fallbackData = null;

                      // Fetch preferred language
                      const primaryRes = await limit(() => fetch(`/content/galleries/${langFile}?v=${new Date().getTime()}`, { signal }));
                      if (primaryRes.ok) {
                          const text = await primaryRes.text();
                          if (text.trim()) {
                            primaryData = parseMarkdown(text).metadata;
                          }
                      }

                      // Fetch default language if needed
                      if (language !== 'sl') {
                          const fallbackRes = await limit(() => fetch(`/content/galleries/${defaultLangFile}?v=${new Date().getTime()}`, { signal }));
                          if (fallbackRes.ok) {
                              const text = await fallbackRes.text();
                              if (text.trim()) {
                                fallbackData = parseMarkdown(text).metadata;
                              }
                          }
                      }
                      
                      if (!primaryData && !fallbackData) return null;

                      // Merge data: primaryData (e.g., EN) overrides fallbackData (SL)
                      const mergedData = { ...(fallbackData || {}), ...(primaryData || {}) };

                      // Ensure essential fields like 'images' are present from fallback if missing in primary
                      if (fallbackData && fallbackData.images && (!primaryData || !primaryData.images)) {
                        mergedData.images = fallbackData.images;
                      }

                      return { id: baseName, ...mergedData };
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

    const pageTitle = t('navGallery');
    const pageDescription = t('galleryPageDescription');

    if (isLoading) {
      return (
        <Page title={pageTitle}> 
            <MetaTags title={pageTitle} description={pageDescription} />
            <div className="container mx-auto px-4 pt-8 md:pt-12 pb-8">
                <div className="relative z-10">
                    <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
                        <div className="text-center mb-8">
                            <h2 className="text-display text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">{t('navGallery')}</h2>
                        </div>
                        <div className={`text-body text-center py-10 rounded-2xl ${getGlassVariant('card', { rounded: '2xl' })}`}>
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-pulse flex space-x-2">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-text-muted mt-4">{t('loading')}...</p>
                        </div>
                    </GlassSection>
                </div>
            </div>
        </Page>
      );
    }

    if (!isLoading && galleries.length === 0) {
        return (
            <Page title={pageTitle}> 
                <MetaTags title={pageTitle} description={pageDescription} />
                <div className="container mx-auto px-4 pt-8 md:pt-12 pb-8">
                    <div className="relative z-10">
                        <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
                            <div className="text-center mb-8">
                                <h2 className="text-display text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">{t('navGallery')}</h2>
                            </div>
                            <div className={`text-body text-center py-10 rounded-2xl ${getGlassVariant('card', { rounded: '2xl' })}`}>
                                <p className="text-text-muted">{t('noGalleriesAvailable')}</p>
                            </div>
                        </GlassSection>
                    </div>
                </div>
            </Page>
        );
    }

    // Transform gallery data for HoverEffect component
    const transformGalleryForHoverEffect = (gallery) => {
        return gallery.images.map((image, index) => {
            const caption = language === 'sl' 
                ? image.caption_sl 
                : (image.caption_en || image.caption_sl);
            
            return {
                title: caption || gallery.title,
                description: gallery.author ? `${t('photoBy')}: ${gallery.author}` : '',
                imageSrc: getOptimizedImageUrl(image.image),
                link: '#', // We'll handle clicks through onClickItem
                gallery: gallery,
                imageIndex: index
            };
        });
    };

    const handleItemClick = (item) => {
        openImage(item.gallery, item.imageIndex);
    };

    const getItemLayoutId = (item, index) => {
        return `gallery-image-${item.gallery.id}-${item.imageIndex}`;
    };

    return (
        <Page title={pageTitle}> 
            <MetaTags title={pageTitle} description={pageDescription} />
            <div className="container mx-auto px-4 pt-8 md:pt-12 pb-8">
                <div className="relative z-10">
                    <GlassSection className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-3xl">
                        <div className="text-center mb-8">
                            <h2 className="text-display text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">{t('navGallery')}</h2>
                        </div>
                        <div className="space-y-16 max-w-3xl mx-auto">
                            {galleries.map((gallery) => (
                                <article key={gallery.id}>
                                    <div className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-6 rounded-2xl mb-8">
                                        <h3 className="heading-organic text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent text-left">{gallery.title}</h3>
                                        {gallery.date && (
                                            <p className="text-sm text-text-muted mt-1 text-left">
                                                {new Date(gallery.date).toLocaleDateString(language, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                        {gallery.description && (
                                            <p className="prose mt-2 text-text-muted text-left">
                                                {gallery.description}
                                            </p>
                                        )}
                                    </div>

                                    <HoverEffect 
                                        items={transformGalleryForHoverEffect(gallery)}
                                        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                                        onClickItem={handleItemClick}
                                        getItemLayoutId={getItemLayoutId}
                                    />
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
                            expandedClassName={`w-full max-w-4xl max-h-[90vh] flex flex-col ${getGlassVariant('card', { background: 'subtle', border: true, blur: true, shadow: true, rounded: '3xl' })} overflow-auto`}
                            closeOnBackdropClick={true}
                            closeOnEscape={true}
                          />
                        )}
                    </GlassSection>
                </div>
            </div>
        </Page>
    );
}

export default GalleryPage;
