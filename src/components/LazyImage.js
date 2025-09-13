import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FilteredImage from './ui/FilteredImage';

const LazyImage = ({ src, srcSet, sizes, alt, className, layoutId }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className} style={{ position: 'relative', paddingBottom: '100%' }}>
            {isLoaded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <FilteredImage
                        src={src}
                        srcSet={srcSet}
                        sizes={sizes}
                        alt={alt}
                        className="w-full h-full object-cover"
                        layoutId={layoutId}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default LazyImage;