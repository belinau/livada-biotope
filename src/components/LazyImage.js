import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className} style={{ position: 'relative', paddingBottom: '100%' }}>
            {isLoaded && (
                <motion.img
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layoutId={layoutId}
                />
            )}
        </div>
    );
};

export default LazyImage;
