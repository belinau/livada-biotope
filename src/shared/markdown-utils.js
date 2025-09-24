import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { load as yamlLoad } from 'yaml';
import mermaid from 'mermaid';
import React from 'react';
import ReactDOM from 'react-dom/client';
import EmbeddedGallery from '../components/EmbeddedGallery';


export const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = yamlLoad(match[1]) || {};
        const content = rawContent.slice(match[0].length);
        return { metadata, content };
    } catch (e) {
        console.error("Error parsing markdown frontmatter:", e);
        return { metadata: {}, content: rawContent };
    }
};

// 2️⃣  Custom short-code renderer
function replaceShortcodes(markdown) {
  return markdown
    // :::details Title
    // content
    // :::
    .replace(/:::details\s+(.+?)\n([\s\S]*?)\n:::/g, '<details><summary>$1</summary><div class="mt-2">$2</div></details>')
    // {{youtube ID}}
    .replace(/{{youtube\s+(.+?)}}/g, `<div class="aspect-video video-filter-overlay"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1?rel=0&modestbranding=1&showinfo=0" frameborder="0" allowfullscreen></iframe></div>`)
    // {{vimeo ID}}
    .replace(/{{vimeo\s+(.+?)}}/g, `<div class="aspect-video video-filter-overlay"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1?byline=0&portrait=0&title=0&badge=0" frameborder="0" allowfullscreen></iframe></div>`)
    // {{button "text" "url"}}
    .replace(/{{button\s+"([^"]+)"\s+"([^"]+)"}}/g, '<a href="$2" class="markdown-button-glassmorphic">$1</a>')
    // {{gallery "gallery-id"}}
    .replace(/{{gallery\s+"(.+?)"}}/g, '<div class="gallery-placeholder" data-gallery-id="$1"></div>');
}

// Function to render markdown with Mermaid and custom shortcodes
export const renderMarkdown = (content) => {
  if (!content) return '';
  
  // First, process any Mermaid code blocks to prevent markdown processing
  let processedContent = content.replace(
    /```mermaid\n([\s\S]*?)\n```/g, 
    (match, diagram) => {
      // Replace with a placeholder that will be processed by renderMermaid
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      return `<div class="mermaid-placeholder" data-diagram="${encodeURIComponent(diagram)}" id="${id}"></div>`;
    }
  );
  
  // Process other shortcodes before markdown rendering
  processedContent = replaceShortcodes(processedContent);

  // Process the remaining markdown to HTML
  let html = marked(processedContent);
  
  // Convert all links to glassmorphic buttons (but not already styled buttons)
  html = html.replace(
    /<a href="([^"]+)"([^>]*?)>(.*?)<\/a>/g,
    (match, href, existingAttributes, text) => {
      // Check if this link already has our button class or is part of our custom button
      if (existingAttributes.includes('markdown-button-glassmorphic') || 
          existingAttributes.includes('inline-block')) { // This catches our custom buttons
        return match; // Don't modify if already has button styling
      }
      // Add our glassmorphic button class
      const classAttr = existingAttributes.includes('class=') 
        ? existingAttributes.replace(/class="(.*?)"/, 'class="markdown-button-glassmorphic $1"')
        : `class="markdown-button-glassmorphic" ${existingAttributes}`;
      return `<a href="${href}" ${classAttr}>${text}</a>`;
    }
  );
  
  return html;
};




// Function to render Mermaid diagrams within a given container
export const renderMermaid = (container) => {
  if (!container) return;

  try {
    // First, handle mermaid placeholders
    const placeholders = container.querySelectorAll('.mermaid-placeholder');
    placeholders.forEach(placeholder => {
      const diagram = decodeURIComponent(placeholder.getAttribute('data-diagram') || '');
      if (diagram) {
        const id = placeholder.id || `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = diagram;
        div.id = id;
        
        // Replace the placeholder with our div
        placeholder.parentNode.replaceChild(div, placeholder);
      }
    });
    
    // Then handle any direct mermaid code blocks
    const mermaidElements = container.querySelectorAll('code.language-mermaid');
    mermaidElements.forEach((element) => {
      const graphDefinition = element.textContent;
      
      // Create a div for the diagram
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = graphDefinition;
      
      // Replace the code block with our div
      const parent = element.parentElement;
      if (parent) {
        parent.parentNode.replaceChild(div, parent);
      }
    });
    
    // Render all mermaid diagrams found in the container
    mermaid.run({
      nodes: container.querySelectorAll('.mermaid'),
    });
    
  } catch (error) {
    console.error('Error rendering Mermaid diagrams:', error);
  }
};

export function renderGalleries(container, language) {
    if (!container) return;
    console.log('renderGalleries called');
    const placeholders = container.querySelectorAll('.gallery-placeholder');
    console.log('found placeholders:', placeholders.length);
    placeholders.forEach(placeholder => {
        const galleryId = placeholder.dataset.galleryId;
        if (galleryId) {
            const root = ReactDOM.createRoot(placeholder);
            root.render(
                <React.StrictMode>
                    <EmbeddedGallery galleryId={galleryId} language={language} />
                </React.StrictMode>
            );
        }
    });
}

// Main function to process and render content
export const processAndRenderContent = (content, contentRef, language) => {
  if (contentRef.current) {
    console.log('processAndRenderContent called');
    const html = renderMarkdown(content);
    console.log('html:', html);
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe', 'details', 'summary', 'div'],
      ADD_ATTR: ['allowfullscreen', 'frameborder', 'class', 'data-gallery-id', 'data-diagram', 'id'],
    });
    console.log('sanitizedHtml:', sanitizedHtml);
    contentRef.current.innerHTML = sanitizedHtml;
    
    // Use a timeout to ensure the DOM is updated before rendering
    setTimeout(() => {
      renderMermaid(contentRef.current);
      renderGalleries(contentRef.current, language);
    }, 0);
  }
};
