import { Chunks } from '@/types/markdown';
import { TypographyProps } from '@mui/material';

/**
 * Processes markdown content and returns HTML with proper typography components
 */
export function processMarkdown(
  content: string,
  options: {
    variant?: TypographyProps['variant'];
    color?: TypographyProps['color'];
    paragraph?: boolean;
  } = {}
): string {
  if (!content) return '';

  // Simple markdown processing - you can extend this as needed
  let processed = content
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Links
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Lists
    .replace(/^\s*[-*+]\s(.*$)/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^>\s(.*$)/gm, '<blockquote>$1</blockquote>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Horizontal rules
    .replace(/^[-*_]{3,}$/gm, '<hr />')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newline to <br>
    .replace(/\n/g, '<br />');

  // Wrap in paragraph if needed
  if (options.paragraph !== false) {
    processed = `<p>${processed}</p>`;
  }

  // Apply typography variant
  if (options.variant) {
    processed = `<span class="MuiTypography-${options.variant}">${processed}</span>`;
  }

  // Apply color
  if (options.color) {
    processed = `<span style="color: ${options.color};">${processed}</span>`;
  }

  return processed;
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Counts words in a text
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}
