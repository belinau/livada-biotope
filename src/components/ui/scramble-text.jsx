import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const ScatterText = ({ content, className = '', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Convert markdown to HTML and then to text
  const markdownToText = (markdown) => {
    try {
      const html = marked(markdown);
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || '';
    } catch (e) {
      console.error("Error converting markdown:", e);
      return markdown;
    }
  };

  // Split text into words
  const getTextWords = (text) => {
    return text.split(/(\s+)/).filter(word => word.length > 0);
  };

  const plainText = content ? markdownToText(content) : '';
  const words = getTextWords(plainText);

  return (
    <div 
      className={className}
      style={{ 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.7',
        fontSize: '1.1rem',
        color: 'var(--text-main)',
        cursor: 'default',
        padding: '2rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', marginRight: word.includes(' ') ? 0 : '0.25rem' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              style={{ 
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal'
              }}
              initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              animate={isHovered ? {
                opacity: [1, 0],
                y: [0, (Math.random() - 0.5) * 200 - 50],
                x: [0, (Math.random() - 0.5) * 300],
                rotate: [0, (Math.random() - 0.5) * 720],
                scale: [1, 0],
              } : { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: isHovered ? Math.random() * 0.5 : 0,
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default ScatterText;