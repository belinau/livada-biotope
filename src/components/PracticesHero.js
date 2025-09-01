import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl } from '../App';
import { marked } from 'marked';
import { ImagesSlider } from './ui/images-slider';

const PracticesHero = ({ language = 'sl' }) => {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const manifestResponse = await fetch('/content/practices/manifest.json');
        if (!manifestResponse.ok) throw new Error('Practices manifest not found');
        const manifest = await manifestResponse.json();
        
        const baseFileNames = [...new Set(
          manifest.files.map(f => f.replace(/\.(sl|en)\.md$/, ''))
        )];

        const fetchedPractices = await Promise.all(
          baseFileNames.map(async baseName => {
            const langFile = `${baseName}.${language}.md`;
            const defaultLangFile = `${baseName}.sl.md`;
            let fileToFetch = langFile;
            let res = await fetch(`/content/practices/${fileToFetch}`);
            
            if (!res.ok) { 
              fileToFetch = defaultLangFile; 
              res = await fetch(`/content/practices/${fileToFetch}`); 
            } 
            
            if (!res.ok) return null;

            const text = await res.text();
            const { metadata, content } = parseMarkdown(text);
            
            // Extract first image from content if available
            const imageRegex = /!\[.*?\]\((.*?)\)/;
            const imageMatch = content.match(imageRegex);
            const firstImage = imageMatch ? imageMatch[1] : null;
            
            return { 
              id: baseName, 
              ...metadata,
              content,
              firstImage,
              date: metadata.date ? new Date(metadata.date) : new Date(0)
            };
          })
        );
        
        const validPractices = fetchedPractices
          .filter(practice => practice)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setPractices(validPractices);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load practices:", error);
        setPractices([]);
        setLoading(false);
      }
    };

    fetchPractices();
  }, [language]);

  // Parse markdown frontmatter and content
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

  // Simple YAML parser for frontmatter
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

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">
            {language === 'sl' ? 'Nalagam prakse...' : 'Loading practices...'}
          </p>
        </div>
      </div>
    );
  }

  if (practices.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
        <p className="text-text-muted">
          {language === 'sl' ? 'Ni najdenih praks' : 'No practices found'}
        </p>
      </div>
    );
  }

  // Get the most recent practice
  const latestPractice = practices[0];
  
  // Get optimized image URL if available, otherwise use fallback
  const imageUrl = latestPractice.firstImage 
    ? getOptimizedImageUrl(latestPractice.firstImage)
    : getOptimizedImageUrl('/images/uploads/deva.jpg');

  // Extract first paragraph from content and clean markdown
  let firstParagraph = '';
  if (latestPractice.content) {
    const firstParagraphRaw = latestPractice.content.split('\n\n')[0] || latestPractice.content.substring(0, 200) + '...';
    // Convert markdown to HTML and then strip tags to get plain text
    const htmlContent = marked(firstParagraphRaw);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    firstParagraph = tempDiv.textContent || tempDiv.innerText || '';
  }

  // Prepare images array for slider (use the main image and fallback)
  const sliderImages = [imageUrl];

  return (
    <ImagesSlider 
      className="h-screen rounded-2xl overflow-hidden shadow-xl"
      images={sliderImages}
      showArrows={true}
      showIndicators={true}
      autoPlay={true}
      autoPlayInterval={7000}
      imageFit="cover"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center text-center px-4"
      >
        <motion.h1
          className="font-bold text-4xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 py-4"
        >
          {latestPractice.title}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-3xl mt-4"
        >
          {firstParagraph}
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            className="px-8 py-4 backdrop-blur-sm border bg-primary/20 border-primary/30 text-white mx-auto text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.hash = '/utelesenja'}
          >
            <span className="text-lg font-medium">
              {language === 'sl' ? 'Preberi več' : 'Read more'} →
            </span>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary to-transparent" />
          </button>
          <button
            className="px-8 py-4 backdrop-blur-sm border bg-secondary/20 border-secondary/30 text-white mx-auto text-center rounded-full relative hover:bg-secondary/30 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.hash = '/utelesenja'}
          >
            <span className="text-lg font-medium">
              {language === 'sl' ? 'Vse prakse' : 'All practices'} →
            </span>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-secondary to-transparent" />
          </button>
        </div>
      </motion.div>
    </ImagesSlider>
  );
};

export default PracticesHero;