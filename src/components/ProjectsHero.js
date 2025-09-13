import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import pLimit from 'p-limit';
import { getGlassVariant } from './glass-theme';
import FilteredImage from './ui/FilteredImage';

const limit = pLimit(2);

const ProjectsHero = ({ language = 'sl' }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const { t } = useTranslation();

  // Simple YAML parser for frontmatter
  const parseYAML = useCallback((yamlString) => {
    try {
      const obj = {};
      const lines = yamlString.split('\n').filter(line => line.trim() !== '');
      let currentKey = null;
      let currentValue = '';
      let inArray = false;
      
      // Helper function to strip quotes from strings
      const stripQuotes = (str) => {
        if (typeof str !== 'string') return str;
        str = str.trim();
        if ((str.startsWith('"') && str.endsWith('"')) || 
            (str.startsWith("'") && str.endsWith("'"))) {
          return str.substring(1, str.length - 1);
        }
        return str;
      };
      
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
            // Strip quotes from array items
            const itemValue = stripQuotes(line.trim().substring(1).trim());
            obj[currentKey].push(itemValue);
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
              // Strip quotes from string values
              obj[currentKey] = stripQuotes(currentValue);
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
          obj[currentKey] = stripQuotes(currentValue);
        }
      }
      
      return obj;
    } catch (e) {
      console.error("Error parsing YAML:", e);
      return {};
    }
  }, []);

  // Parse markdown frontmatter and content
  const parseMarkdown = useCallback((rawContent) => {
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
  }, [parseYAML]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const manifestResponse = await limit(() => fetch('/content/projects/manifest.json'));
        if (!manifestResponse.ok) throw new Error('Projects manifest not found');
        const manifest = await manifestResponse.json();
        
        const baseFileNames = [...new Set(
          manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, ''))
        )];

        const fetchedProjects = await Promise.all(
          baseFileNames.map(async baseName => {
            const langFile = `${baseName}.${language}.md`;
            const defaultLangFile = `${baseName}.sl.md`;
            let fileToFetch = langFile;
            let res = await limit(() => fetch(`/content/projects/${fileToFetch}`));
            
            if (!res.ok) { 
              fileToFetch = defaultLangFile; 
              res = await limit(() => fetch(`/content/projects/${fileToFetch}`)); 
            } 
            
            if (!res.ok) return null;

            const text = await res.text();
            const { metadata, content } = parseMarkdown(text);
            
            let firstImage = null;
            if (metadata.image) {
              // Resolve image path relative to the markdown file
              const markdownPath = `/content/projects/${fileToFetch}`;
              try {
                const imageUrl = new URL(metadata.image, `http://dummybase${markdownPath}`);
                firstImage = imageUrl.pathname;
              } catch (e) {
                console.error(`Invalid image URL for ${fileToFetch}:`, e);
              }
            } else {
              // Fallback to first image in content
              const imageRegex = /!\[.*?\]\((.*?)\)/;
              const imageMatch = content.match(imageRegex);
              if (imageMatch && imageMatch[1]) {
                const markdownPath = `/content/projects/${fileToFetch}`;
                try {
                  const imageUrl = new URL(imageMatch[1], `http://dummybase${markdownPath}`);
                  firstImage = imageUrl.pathname;
                } catch (e) {
                  console.error(`Invalid image URL in content for ${fileToFetch}:`, e);
                }
              }
            }

            return { 
              id: baseName, 
              ...metadata,
              content,
              firstImage,
              date: metadata.date ? new Date(metadata.date) : new Date(0)
            };
          })
        );
        
        const validProjects = fetchedProjects
          .filter(project => project)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setProjects(validProjects);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setProjects([]);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language, parseMarkdown]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['All', ...Array.from(tags).sort()];
  }, [projects]);

  // Filter projects by selected tag
  const filteredProjects = useMemo(() => {
    if (!selectedTag || selectedTag === 'All') {
      return projects.slice(0, 6); // Show only first 6 projects
    }
    return projects.filter(project => project.tags && project.tags.includes(selectedTag)).slice(0, 6);
  }, [projects, selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="heading-organic text-3xl md:text-4xl text-center text-primary mb-8">
            {language === 'sl' ? 'Projekti' : 'Projects'}
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="heading-organic text-3xl md:text-4xl text-center text-primary mb-8">
            {language === 'sl' ? 'Projekti' : 'Projects'}
          </h2>
          <div className="text-center py-12">
            <p className="text-text-muted">
              {language === 'sl' ? 'Ni najdenih projektov' : 'No projects found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="heading-organic text-3xl md:text-4xl text-center text-primary mb-8">
          {language === 'sl' ? 'Projekti' : 'Projects'}
        </h2>
        
        {/* Tag Filter */}
        <div className="flex flex-wrap justify-center items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full ${
                  selectedTag === tag || (tag === 'All' && !selectedTag)
                    ? 'text-white shadow-md'
                    : `${getGlassVariant('button', { rounded: 'full' })} text-text-muted hover:bg-primary/20 hover:text-primary hover:shadow-md`
                }`}
                style={
                  selectedTag === tag || (tag === 'All' && !selectedTag) 
                    ? { backgroundColor: 'var(--glass-icon-bg)' } 
                    : {}
                }
              >
                {t(tag === 'All' ? 'allTags' : tag) || tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <Link 
                to={`/projekti/${project.id}`} 
                key={project.id} 
                className="block group"
              >
                <div 
                  className={getGlassVariant('card', { rounded: 'xl', shadow: true })}
                >
                  <div className="aspect-video overflow-hidden rounded-t-xl">
                    {project.firstImage ? (
                      <div className="relative w-full h-full">
                        <FilteredImage
                          src={project.firstImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          filterType="grid"
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
                      {project.date && (
                        <p className="text-accent text-sm text-text-muted">
                          {new Date(project.date).toLocaleDateString(language)}
                        </p>
                      )}
                      {project.author && (
                        <p className="text-accent text-sm text-text-muted">
                          {language === 'sl' ? 'Avtor: ' : 'by '}{project.author}
                        </p>
                      )}
                    </div>
                    <h3 className="heading-organic text-xl text-primary mb-3 flex-grow">
                      {project.title}
                    </h3>
                    
                    {project.description && (
                      <p className="text-text-muted mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    
                    {project.tags && (
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-text-muted col-span-full">
              {language === 'sl' ? 'Ni najdenih projektov za izbrano oznako' : 'No projects found for selected tag'}
            </p>
          )}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <button
            className="px-8 py-4 backdrop-blur-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] text-white mx-auto text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/projekti')}
          >
            <span className="text-lg font-medium">
              {language === 'sl' ? 'Vsi projekti' : 'All projects'} →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero;