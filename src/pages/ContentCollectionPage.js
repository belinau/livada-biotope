import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import { marked } from 'marked';
import mermaid from 'mermaid';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import FilteredImage from '../components/ui/FilteredImage';
import ReactDOM from 'react-dom/client';
import EmbeddedGallery from '../components/EmbeddedGallery';
import Hero from '../components/Hero';
import MetaTags from '../components/MetaTags';
import ForOurKinForm from '../components/ForOurKinForm';
import { normalizeImagePath } from '../utils/path-utils';
import { parse } from 'yaml';

const limit = pLimit(2);

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

function enhanceHTML(html) {
  return html
    .replace(/:::details\s+(.+?)\n([\s\S]*?)\n:::/g, '<details><summary>$1</summary><div class="mt-2">$2</div></details>')
    .replace(/{{youtube\s+(.+?)}}/g, '<div class="aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>')
    .replace(/{{vimeo\s+(.+?)}}/g, '<div class="aspect-video"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div>')
    .replace(/{{gallery\s+"(.+?)"}}/g, '<div class="gallery-placeholder" data-gallery-id="$1"></div>')
    .replace(/<p><a href="([^_"].+?)">([^<]+)<\/a><\/p>/g, '<a href="$1" class="inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors">$2</a>');
}

const renderMarkdown = (content) => {
  if (!content) return '';
  
  let processedContent = content.replace(
    /```mermaid\n([\s\S]*?)\n```/g, 
    (match, diagram) => {
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      return `<div class="mermaid-placeholder" data-diagram="${encodeURIComponent(diagram)}" id="${id}"></div>`;
    }
  );
  
  const html = marked(processedContent);
  
  return enhanceHTML(html);
};

const renderMermaid = (container) => {
  if (!container) return;

  try {
    const placeholders = container.querySelectorAll('.mermaid-placeholder');
    placeholders.forEach(placeholder => {
      const diagram = decodeURIComponent(placeholder.getAttribute('data-diagram') || '');
      if (diagram) {
        const id = placeholder.id || `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = diagram;
        div.id = id;
        
        placeholder.parentNode.replaceChild(div, placeholder);
      }
    });
    
    const mermaidElements = container.querySelectorAll('code.language-mermaid');
    mermaidElements.forEach((element) => {
      const graphDefinition = element.textContent;
      
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = graphDefinition;
      
      const parent = element.parentElement;
      if (parent) {
        parent.parentNode.replaceChild(div, parent);
      }
    });
    
    mermaid.run({
      nodes: container.querySelectorAll('.mermaid'),
    });
    
  } catch (error) {
    console.error('Error rendering Mermaid diagrams:', error);
  }
};

const renderGalleries = (container) => {
    if (!container) return;
    const placeholders = container.querySelectorAll('.gallery-placeholder');
    placeholders.forEach(placeholder => {
        const galleryId = placeholder.dataset.galleryId;
        if (galleryId) {
            const root = ReactDOM.createRoot(placeholder);
            root.render(<EmbeddedGallery galleryId={galleryId} />);
        }
    });
};

function ContentCollectionPage({ contentPath, collection, pagePath }) {
    const [items, setItems] = useState([]);
    const [heroData, setHeroData] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const { t, language } = useTranslation();
    const contentRef = useRef({});
    const [scrollContainerRef] = useState(null);

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchHeroData = async () => {
        // Handle projects collection with Intertwinings content
        if (collection === 'projects') {
          const langFile = `/content/pages/intertwinings.${language}.md`;
          const defaultLangFile = `/content/pages/intertwinings.sl.md`;
          try {
            let response = await limit(() => fetch(langFile, { signal }));
            if (!response.ok) {
              response = await limit(() => fetch(defaultLangFile, { signal }));
            }
            if (response.ok) {
              const text = await response.text();
              const { metadata, content } = parseMarkdown(text);
              setHeroData({
                title: metadata.title || t('projects'), 
                description: metadata.description || t('projectsDescription'),
                hero_title: metadata.hero_title || metadata.title || t('projects'),
                hero_subtitle: metadata.hero_subtitle || metadata.description || t('projectsDescription'),
                content: content
              });
            }
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Failed to fetch intertwinings content:', error);
            }
          }
        } 
        // Handle practices collection with Practices content
        else if (collection === 'practices') {
          const langFile = `/content/pages/practices.${language}.md`;
          const defaultLangFile = `/content/pages/practices.sl.md`;
          try {
            let response = await limit(() => fetch(langFile, { signal }));
            if (!response.ok) {
              response = await limit(() => fetch(defaultLangFile, { signal }));
            }
            if (response.ok) {
              const text = await response.text();
              const { metadata, content } = parseMarkdown(text);
              setHeroData({
                title: metadata.title || t('practices'), 
                description: metadata.description || t('practicesDescription'),
                hero_title: metadata.hero_title || metadata.title || t('practices'),
                hero_subtitle: metadata.hero_subtitle || metadata.description || t('practicesDescription'),
                content: content
              });
            }
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Failed to fetch practices content:', error);
            }
          }
        }
        // Handle for-our-kin collection with For Our Kin content
        else if (collection === 'kinships') {
          const langFile = `/content/pages/kinships.${language}.md`;
          const defaultLangFile = `/content/pages/kinships.sl.md`;
          try {
            let response = await limit(() => fetch(langFile, { signal }));
            if (!response.ok) {
              response = await limit(() => fetch(defaultLangFile, { signal }));
            }
            if (response.ok) {
              const text = await response.text();
              const { metadata, content } = parseMarkdown(text);
              setHeroData({
                title: metadata.title || t('forOurKin'), 
                description: metadata.description,
                hero_title: metadata.hero_title || metadata.title,
                hero_subtitle: metadata.hero_subtitle || metadata.description,
                content: content
              });
            }
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Failed to fetch kinships content:', error);
            }
          }
        } else {
          // For other collections, use default hero data
          setHeroData({
            title: t(collection), 
            description: t(`${collection}Description`),
            hero_title: t(collection),
            hero_subtitle: t(`${collection}Description`)
          });
        }
      };

      fetchHeroData();

      return () => {
        controller.abort();
      };
    }, [collection, language, t]);

    // Enhanced scroll snapping behavior
    useEffect(() => {
        const container = scrollContainerRef;
        if (!container) return;

        let isScrolling = false;
        let scrollTimeout;

        const handleScroll = () => {
            if (!isScrolling) {
                isScrolling = true;
                container.classList.add('scrolling');
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                container.classList.remove('scrolling');
            }, 150);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [scrollContainerRef]);

    const handleTagClick = (tag) => {
        if (tag === selectedTag) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedTag(tag);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 300);
    };

    const processedItems = useMemo(() => {
      return items.map(item => ({
        ...item,
        processedContent: renderMarkdown(item.content)
      }));
    }, [items]);

    const allTags = useMemo(() => {
        const tags = new Set();
        items.forEach(item => {
            if (item.metadata.tags) {
                item.metadata.tags.forEach(tag => tags.add(tag));
            }
        });
        return ['All', ...Array.from(tags).sort()];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (!selectedTag || selectedTag === 'All') {
            return processedItems;
        }
        return processedItems.filter(item => item.metadata.tags && item.metadata.tags.includes(selectedTag));
    }, [processedItems, selectedTag]);
  
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const manifestResponse = await limit(() => fetch(`/${contentPath}/manifest.json`, { signal }));
          if (!manifestResponse.ok) throw new Error('Manifest not found');
          const manifest = await manifestResponse.json();
  
          const langSuffix = `.${language}.md`;
          const baseNames = [...new Set(manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, '')))];
  
          const fetchedItems = await Promise.all(
            baseNames.map(async baseName => {
              const langFile = `${baseName}${langSuffix}`;
              const defaultFile = `${baseName}.sl.md`;
              let file = langFile;
              let res = await limit(() => fetch(`/${contentPath}/${file}`, { signal }));
              if (!res.ok) { file = defaultFile; res = await limit(() => fetch(`/${contentPath}/${file}`, { signal })); } 
              if (!res.ok) return null;
  
              const text = await res.text();
              return { ...parseMarkdown(text), id: baseName };
            })
          );
  
          const validItems = fetchedItems.filter(Boolean);
          validItems.sort((a, b) => (a.metadata.date && b.metadata.date) ? new Date(b.metadata.date) - new Date(a.metadata.date) : 0);
          setItems(validItems);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error(`Error fetching ${contentPath}:`, err);
            setItems([]);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();

      return () => {
        controller.abort();
      };
    }, [contentPath, language]);

    useEffect(() => {
        if (isLoading) return;
        filteredItems.forEach(item => {
            if (contentRef.current[item.id] && contentRef.current[item.id].innerHTML !== item.processedContent) {
                contentRef.current[item.id].innerHTML = item.processedContent;
                setTimeout(() => {
                    renderMermaid(contentRef.current[item.id]);
                    renderGalleries(contentRef.current[item.id]);
                }, 0); 
            }
        });
    }, [filteredItems, isLoading]);
  
    if (isLoading) {
      return (
        <Section title={heroData.title}> 
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </Section>
      );
    }
  
    return (
      <Page title={heroData.title}> 
        <MetaTags title={heroData.title} description={heroData.description} />
        <div className="pt-4 md:pt-8 lg:pt-12">
          <Hero 
            title={heroData.hero_title || heroData.title} 
            subtitle={heroData.hero_subtitle || heroData.description} 
          />
          {collection !== 'utelešenja' && (
            <div className="text-center">
                <div className="inline-block bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] p-4 px-8 rounded-full mb-8 backdrop-blur-sm border border-[var(--glass-border)] shadow-xl">
                    <h2 className="text-display text-3xl text-center bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent">
                        {heroData.hero_title || heroData.title}
                    </h2>
                </div>
            </div>
          )}
          <Section> 
            <div className="flex flex-wrap justify-center items-center mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                  {allTags.map(tag => (
                      <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full ${selectedTag === tag || (tag === 'All' && !selectedTag)
                              ? 'text-[var(--muted)] shadow-md bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-full hover:text-[var(--text-sage)]'
                              : `bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-full text-[var(--primary)] hover:bg-primary/20 hover:text-[var(--text-sage)] hover:shadow-md`
                          }`}
                      >
                          {t(tag === 'All' ? 'allTags' : tag) || tag}
                      </button>
                  ))}
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {filteredItems.length ? filteredItems.map(item => (
                  <Link to={`${pagePath}/${item.id}`} key={item.id} className="block group">
                    <div 
                      className={`bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] border border-[var(--glass-border)] backdrop-blur-sm shadow-xl rounded-xl`}
                    >
                      <div className="aspect-video overflow-hidden rounded-t-xl">
                        {item.metadata.image ? (
                          <div className="relative w-full h-full">
                            <FilteredImage
                              src={normalizeImagePath(item.metadata.image)}
                              alt={item.metadata.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                            <div className="text-primary/30 text-4xl">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {item.metadata.date && (
                            <p className="text-accent text-sm text-text-muted">
                              {new Date(item.metadata.date).toLocaleDateString(language)}
                            </p>
                          )}
                          {item.metadata.author && (
                            <p className="text-accent text-sm text-text-muted">
                              {language === 'sl' ? 'Avtor: ' : 'by '}{item.metadata.author}
                            </p>
                          )}
                        </div>
                        <h3 className="heading-organic text-xl text-primary mb-3 flex-grow">{item.metadata.title}</h3>
                        
                        {item.metadata.description && (
                          <p className="text-text-muted mb-4 line-clamp-3">
                            {item.metadata.description}
                          </p>
                        )}
                        
                        {item.metadata.tags && (
                          <div className="mt-auto flex flex-wrap gap-2">
                            {item.metadata.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-block bg-primary/10 text-muted text-xs font-semibold px-2.5 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-center text-text-muted col-span-full">{t('noMoreObservations')}</p>
                )}
              </div>
          </Section>
          {/* Display content body from markdown file for kinships collection */}
          {collection === 'kinships' && heroData.content && (
            <Section>
              <div 
                className="text-text-main prose prose-lg max-w-none"
                ref={el => {
                  if (el) {
                    el.innerHTML = renderMarkdown(heroData.content);
                    setTimeout(() => {
                      renderMermaid(el);
                      renderGalleries(el);
                    }, 0);
                  }
                }}
              />
            </Section>
          )}
          {/* For Our Kin Form - only show for kinships collection */}
          {collection === 'kinships' && (
            <div className="max-w-4xl mx-auto w-full px-4 py-8">
              <ForOurKinForm />
            </div>
          )}
        </div>
      </Page>
    );
  }

export default ContentCollectionPage;
