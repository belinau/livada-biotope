import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import { marked } from 'marked';
import mermaid from 'mermaid';
import Page from '../components/layout/Page';
import Section from '../components/layout/Section';
import { GlassCard } from '../components/ui/GlassCard';

const limit = pLimit(2);

const parseYAML = (yamlString) => {
  try {
    const obj = {};
    const lines = yamlString.split('\n').filter(line => line.trim() !== '');
    let currentKey = null;
    let currentValue = '';
    let inArray = false;
    
    lines.forEach(line => {
      // Skip empty lines
      if (line.trim() === '') return;
      
      // Check if line starts with a dash (list item)
      if (line.trim().startsWith('-')) {
        // Handle array items
        if (currentKey) {
          if (!obj[currentKey]) {
            obj[currentKey] = [];
          }
          obj[currentKey].push(line.trim().substring(1).trim());
        }
        inArray = true;
        return;
      }
      
      // Check if line has a colon (key-value pair)
      if (line.includes(':')) {
        // Save previous key-value pair
        if (currentKey) {
          if (inArray && Array.isArray(obj[currentKey])) {
            // Keep as array
          } else {
            obj[currentKey] = currentValue.trim();
          }
        }
        
        // Reset array flag
        inArray = false;
        
        // Start new key-value pair
        const [key, ...valueParts] = line.split(':');
        currentKey = key.trim();
        currentValue = valueParts.join(':').trim();
      } else if (currentKey && (line.startsWith(' ') || line.startsWith('\t'))) {
        // Multiline value continuation
        if (!inArray) {
          currentValue += '\n' + line.trim();
        }
      }
    });
    
    // Save last key-value pair
    if (currentKey) {
      if (inArray && obj[currentKey] && Array.isArray(obj[currentKey])) {
        // Keep as array
      } else {
        obj[currentKey] = currentValue.trim();
      }
    }
    
    return obj;
  } catch (e) {
    console.error("Error parsing YAML:", e);
    return {};
  }
};

const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = parseYAML(match[1]) || {};
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
    .replace(/{{youtube\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>`)
    .replace(/{{vimeo\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div>`);
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

function ContentCollectionPage({ t, title, contentPath }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { language } = useTranslation();
    const contentRef = useRef({});

    const processedItems = useMemo(() => {
      return items.map(item => ({
        ...item,
        processedContent: renderMarkdown(item.content)
      }));
    }, [items]);
  
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
        processedItems.forEach(item => {
            if (contentRef.current[item.id] && contentRef.current[item.id].innerHTML !== item.processedContent) {
                contentRef.current[item.id].innerHTML = item.processedContent;
                setTimeout(() => {
                    renderMermaid(contentRef.current[item.id]);
                }, 0); 
            }
        });
    }, [processedItems, isLoading]);
  
    if (isLoading) {
      return (
        <Section title={title}> 
          <div className="text-body text-center text-text-muted">{t('loading')}…</div>
        </Section>
      );
    }
  
    return (
      <Page title={title}> 
        <Section title={title}> 
          <div className="space-y-8 max-w-3xl mx-auto">
                        {processedItems.length ? processedItems.map(item => (
              <GlassCard key={item.id}> 
                <div className="flex flex-wrap items-center gap-2 mb-2">
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
                <h3 className="heading-organic text-2xl text-primary mb-3">{item.metadata.title}</h3>
                
                <div
                  className="prose-organic max-w-none mb-4"
                  ref={node => {
                    if (node && !contentRef.current[item.id]) {
                        contentRef.current[item.id] = node;
                        node.innerHTML = item.processedContent;
                    }
                  }}
                />
  
                {item.metadata.tags && (
                  <div className="mt-4">
                    {item.metadata.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block bg-primary/10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            )) : (
              <p className="text-center text-text-muted">{t('noMoreObservations')}</p>
            )}
          </div>
        </Section>
      </Page>
    );
  }

export default ContentCollectionPage;