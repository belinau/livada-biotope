import React from 'react';
import VintageIllustration from './VintageIllustration';
import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryItem {
  id: string;
  src: string;
  alt: {
    en: string;
    sl: string;
  };
  caption?: {
    en: string;
    sl: string;
  };
  credit?: string;
  year?: string;
}

interface VintageGalleryProps {
  items: GalleryItem[];
  title?: {
    en: string;
    sl: string;
  };
  description?: {
    en: string;
    sl: string;
  };
  columns?: 1 | 2 | 3 | 4;
}

const VintageGallery: React.FC<VintageGalleryProps> = ({
  items,
  title,
  description,
  columns = 2,
}) => {
  const { language, t } = useLanguage();

  const getColumnClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 2:
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className="vintage-gallery my-12">
      {title && (
        <h3 className="text-2xl font-serif text-center mb-4 text-sepia-800">
          {title[language]}
        </h3>
      )}
      
      {description && (
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          {description[language]}
        </p>
      )}
      
      <div className={`grid ${getColumnClass()} gap-6`}>
        {items.map((item) => (
          <VintageIllustration
            key={item.id}
            src={item.src}
            alt={item.alt[language]}
            caption={item.caption ? item.caption[language] : undefined}
            credit={item.credit ? `${item.credit}${item.year ? `, ${item.year}` : ''}` : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default VintageGallery;
