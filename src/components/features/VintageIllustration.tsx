import React from 'react';
import Image from 'next/image';

interface VintageIllustrationProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width?: string;
  height?: string;
  className?: string;
}

const VintageIllustration: React.FC<VintageIllustrationProps> = ({
  src,
  alt,
  caption,
  credit,
  width = 'full',
  height = 'auto',
  className = '',
}) => {
  return (
    <figure className={`vintage-illustration my-6 ${className}`}>
      <div className="relative overflow-hidden border-2 border-sepia-300 rounded-md bg-sepia-50 p-2">
        <div className="absolute inset-0 bg-sepia-100 opacity-20"></div>
        <div className={`relative w-${width} h-${height} mx-auto`} style={{ minHeight: '200px' }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain relative z-10"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      {(caption || credit) && (
        <figcaption className="text-center mt-2 text-sm italic text-gray-600">
          {caption && <span>{caption}</span>}
          {caption && credit && <span> — </span>}
          {credit && <span className="text-gray-500">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
};

export default VintageIllustration;
