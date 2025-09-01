import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { parse } from 'yaml';
import mermaid from 'mermaid';

export const parseMarkdown = (rawContent) => {
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

// 2️⃣  Custom short-code renderer
export function enhanceHTML(html) {
  return html
    // :::details Title
    // content
    // :::
    .replace(/:::details\s+(.+?)\n([\s\S]*?)\n:::/g, '<details><summary>$1</summary><div class="mt-2">$2</div></details>')
    // {{youtube ID}}
    .replace(/{{youtube\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>`)
    // {{vimeo ID}}
    .replace(/{{vimeo\s+(.+?)}}/g, `<div class="aspect-video"><iframe class="w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div>`);
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
  
  // Process the remaining markdown to HTML
  const html = marked(processedContent);
  
  // Apply custom shortcodes
  return enhanceHTML(html);
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
