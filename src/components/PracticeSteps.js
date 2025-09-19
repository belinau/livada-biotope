import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl } from '../shared/image-utils';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { getGlassVariant } from './glass-theme';

const PracticeSteps = ({ steps, language, t }) => {
    const [imageDimensions, setImageDimensions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDimensions = async () => {
            setLoading(true);
            const dimensions = {};
            const promises = steps.map(step => {
                return new Promise(resolve => {
                    if (step.image) {
                        const img = new Image();
                        img.src = getOptimizedImageUrl(step.image);
                        img.onload = () => {
                            dimensions[step.image] = { width: img.width, height: img.height };
                            resolve();
                        };
                        img.onerror = () => resolve(); // resolve even if image fails to load
                    } else {
                        resolve();
                    }
                });
            });
            await Promise.all(promises);
            setImageDimensions(dimensions);
            setLoading(false);
        };
        getDimensions();
    }, [steps]);

    if (!steps || steps.length === 0) {
        return null;
    }

    if (loading) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">{t('steps')}</h2>
                <div>Loading images...</div> {/* Simple loader */}
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('steps')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-auto-rows-fr">
                {steps.map((step, index) => {
                    const dims = imageDimensions[step.image];
                    let colSpan = 'col-span-1';
                    let rowSpan = 'row-span-1';

                    if (dims) {
                        const aspectRatio = dims.width / dims.height;
                        if (aspectRatio > 1.2) { // Wide image
                            colSpan = 'md:col-span-2';
                        } else if (aspectRatio < 0.8) { // Tall image
                            rowSpan = 'md:row-span-2';
                        }
                    }

                    return (
                        <div key={index} className={`${colSpan} ${rowSpan}`}>
                            <PracticeStepCard step={step} index={index} language={language} t={t} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PracticeStepCard = ({ step, index, language, t }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    
    const isInteracted = isHovered || isTouched;
    
    const handleTouchStart = () => {
        setIsTouched(true);
    };
    
    const handleTouchEnd = () => {
        // Delay the removal of touch state to allow for better interaction
        setTimeout(() => setIsTouched(false), 300);
    };

    const caption = step.caption;
    const htmlCaption = caption ? marked(caption) : '';

    const ArtNouveauFloralBorder = () => (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
            <img 
                src="/images/pattern1.svg" 
                alt="decorative pattern" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
        </div>
    );

    return (
        <motion.div
            className="border border-black/[0.2] dark:border-white/[0.2] rounded-lg p-4 relative cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            initial="initial"
        >
            {/* Background on hover/touch */}
            <motion.div
                variants={{
                    initial: { opacity: 0, scale: 0.98 },
                    hovered: { opacity: 1, scale: 1 },
                }}
                animate={isInteracted ? "hovered" : "initial"}
                className={`absolute inset-0 ${getGlassVariant('card', { 
                    rounded: 'lg', 
                    blur: !step.image, // only blur if no image
                    shadow: false,
                    background: !!step.image 
                })}`}
            />

            {/* Image */}
            {step.image && (
                <motion.div
                    variants={{
                        initial: { opacity: 0, scale: 1 },
                        hovered: { opacity: 1, scale: 1, zIndex: 20, transition: { duration: 0.5, ease: "easeInOut" } },
                    }}
                    animate={isInteracted ? "hovered" : "initial"}
                    className="absolute inset-0"
                >
                    <img
                        src={getOptimizedImageUrl(step.image)}
                        alt={caption || `${t('step')} ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </motion.div>
            )}

            {/* Art Nouveau floral border for steps without images - shows on hover/touch */}
            {!step.image && (
                <motion.div
                    variants={{
                        initial: { opacity: 0 },
                        hovered: { opacity: 1, transition: { duration: 0.3 } },
                    }}
                    animate={isInteracted ? "hovered" : "initial"}
                    className="absolute inset-0"
                >
                    <ArtNouveauFloralBorder />
                </motion.div>
            )}

            {/* Text - hides on hover/touch for steps without images, disappears on hover/touch for steps with images */}
            <motion.div
                variants={{
                    initial: { opacity: 1 },
                    hovered: { opacity: step.image ? 0 : 0, transition: { duration: 0.3 } },
                }}
                animate={isInteracted ? "hovered" : "initial"}
                className="text-center relative z-10"
            >
                <div className="text-6xl font-bold font-display text-[--primary-dark]">
                    {index + 1}
                </div>
                <div
                    className="prose-organic max-w-none mt-4"
                    dangerouslySetInnerHTML={{ __html: htmlCaption }}
                />
            </motion.div>
        </motion.div>
    );
};

export default PracticeSteps;