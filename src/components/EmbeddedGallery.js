
import React, { useState, useEffect } from 'react';

import pLimit from 'p-limit';
import * as yaml from 'yaml';
import ExpandableCard from './ExpandableCard';
import GalleryExpandedContent from './GalleryExpandedContent';
import LazyImage from './LazyImage';
import { getOptimizedImageUrl } from '../shared/image-utils';
import { translations } from '../lib/translations';

const limit = pLimit(2);

const parseMarkdown = (rawContent) => {
    try {
        const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontmatterRegex.exec(rawContent);
        if (!match) return { metadata: {}, content: rawContent };
        const metadata = yaml.parse(match[1]) || {};
        const content = rawContent.slice(match[0].length);
        return { metadata, content };
    } catch (e) {
        console.error("Error parsing markdown frontmatter:", e);
        return { metadata: {}, content: rawContent };
    }
};

function EmbeddedGallery({ galleryId, language }) {
    const [gallery, setGallery] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);
    const t = (key) => translations[language]?.[key] || key;

    useEffect(() => {
        console.log("EmbeddedGallery: useEffect called with galleryId:", galleryId, "language:", language);
        const fetchGallery = async () => {
            setIsLoading(true);
            try {
                const langFile = `${galleryId}.${language}.md`;
                const defaultLangFile = `${galleryId}.sl.md`;
                
                let metadata = null;

                // Try language-specific version first
                console.log("EmbeddedGallery: Trying to fetch:", `/content/galleries/${encodeURIComponent(langFile)}`);
                let res = await limit(() => fetch(`/content/galleries/${encodeURIComponent(langFile)}`));
                
                if (res.ok) {
                    const text = await res.text();
                    const parsed = parseMarkdown(text);
                    console.log("EmbeddedGallery: Parsed metadata from lang file:", parsed.metadata);
                    // Only accept if it has images, or if it's the default language
                    if (language === 'sl' || (parsed.metadata.images && parsed.metadata.images.length > 0)) {
                        metadata = parsed.metadata;
                    } else {
                        console.log("EmbeddedGallery: Lang file has no images, preparing to fallback.");
                    }
                }

                // If we couldn't get metadata from the language-specific file, try the default
                if (!metadata) {
                    console.log("EmbeddedGallery: Falling back to Slovenian version");
                    res = await limit(() => fetch(`/content/galleries/${encodeURIComponent(defaultLangFile)}`));
                    if (res.ok) {
                        const text = await res.text();
                        const parsed = parseMarkdown(text);
                        console.log("EmbeddedGallery: Parsed metadata from fallback file:", parsed.metadata);
                        metadata = parsed.metadata;
                    }
                }
                
                if (!metadata) {
                    console.error(`Gallery not found: ${galleryId}`);
                    throw new Error(`Gallery not found: ${galleryId}`);
                }

                console.log("EmbeddedGallery: Setting gallery state with metadata:", metadata);
                setGallery({ id: galleryId, ...metadata });
            } catch (error) {
                console.error(`Failed to load gallery: ${galleryId}`, error);
                setGallery(null);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (galleryId) {
            fetchGallery();
        } else {
            setIsLoading(false);
        }
    }, [galleryId, language]);

    const openImage = (index) => {
        setExpandedImageIndex(index);
    };

    const closeImage = () => {
        setExpandedImageIndex(null);
    };

    const goToPrev = () => {
        if (gallery === null || expandedImageIndex === null || !gallery.images) return;
        const totalImages = gallery.images.length;
        const prevIndex = (expandedImageIndex - 1 + totalImages) % totalImages;
        setExpandedImageIndex(prevIndex);
    };

    const goToNext = () => {
        if (gallery === null || expandedImageIndex === null || !gallery.images) return;
        const totalImages = gallery.images.length;
        const nextIndex = (expandedImageIndex + 1) % totalImages;
        setExpandedImageIndex(nextIndex);
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading gallery...</div>;
    }

    if (!gallery) {
        return <div className="text-center p-4 text-red-500">Gallery not found.</div>;
    }

    return (
        <div className="my-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.images && gallery.images.map((image, index) => (
                    <button
                        key={`${gallery.id}-${index}`}
                        className="relative group block w-full"
                        onClick={() => openImage(index)}
                    >
                        <LazyImage
                            src={getOptimizedImageUrl(image.image)}
                            alt={image.caption_sl || gallery.title}
                            className="aspect-square opacity-50"
                        />
                    </button>
                ))}
            </div>

            {expandedImageIndex !== null && gallery.images && (
                <ExpandableCard
                    isExpanded={expandedImageIndex !== null}
                    onToggle={(expanded) => {
                        if (!expanded) closeImage();
                    }}
                    layoutId={`gallery-${gallery.id}-${expandedImageIndex}`}
                    expandedContent={
                        <GalleryExpandedContent
                            gallery={gallery}
                            imageIndex={expandedImageIndex}
                            goToPrev={goToPrev}
                            goToNext={goToNext}
                            currentIndex={expandedImageIndex}
                            totalImages={gallery.images.length}
                            language={language}
                            t={t}
                        />
                    }
                    closeOnBackdropClick={true}
                    closeOnEscape={true}
                >
                </ExpandableCard>
            )}
        </div>
    );
}

export default EmbeddedGallery;
