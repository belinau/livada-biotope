"use client";

import React, { useId, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HoverEffect } from "../components/ui/HoverEffect";
import ExpandableCard from "./ExpandableCard";
import FilteredImage from "./ui/FilteredImage";


export function ExpandableBiodiversityCard({ observations, fetchObservationDetails, language, t }) {
  const [activeObservation, setActiveObservation] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const id = useId();

  const fetchWikipediaLink = useCallback(async (scientificName, lang) => {
    try {
      const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(scientificName)}&limit=1&namespace=0&format=json&origin=*`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      if (data && data[3] && data[3][0]) {
        return data[3][0]; // Returns the first URL found
      }
    } catch (error) {
      console.error("Error fetching Wikipedia link:", error);
    }
    return null;
  }, []);

  const handleCardClick = useCallback(async (item) => {
    console.log('handleCardClick called. isFetchingDetails:', isFetchingDetails);
    if (isFetchingDetails) {
      console.log('Already fetching details, returning.');
      return;
    }

    const obs = item.originalObservation;

    // Set initial active state
    const initialContent = {
      description: new Date(obs.observed_on_string).toLocaleDateString(language),
      iNaturalistLink: obs.uri,
      wikipediaLink: null,
      content: <p>{t('loadingDescription')}</p>,
    };

    setActiveObservation(obs);
    setActiveContent(initialContent);
    setIsFetchingDetails(true);
    console.log('setIsFetchingDetails(true) called.');

    try {
      const details = await fetchObservationDetails(obs);
      const wikipediaLink = await fetchWikipediaLink(obs.taxon?.name, language);

      // Update content with fetched details
      const updatedContent = {
        description: new Date(obs.observed_on_string).toLocaleDateString(language),
        iNaturalistLink: obs.uri,
        wikipediaLink: wikipediaLink,
        content: (
          <p>
            {details[language]?.description || details['sl']?.description || t('noDescriptionAvailable')}
          </p>
        ),
      };

      setActiveContent(updatedContent);
    } finally {
      setIsFetchingDetails(false);
      console.log('setIsFetchingDetails(false) called in finally block.');
    }
  }, [fetchObservationDetails, language, t, isFetchingDetails, fetchWikipediaLink]);

  const items = observations
    ? observations.filter(obs => obs).map(obs => ({
        link: obs.uri,
        title: obs.taxon?.preferred_common_name || obs.taxon?.name || "Unknown",
        description: new Date(obs.observed_on_string).toLocaleDateString(language),
        imageSrc: obs.photos[0]?.url?.replace('square', 'medium') || `https://placehold.co/500x500/2d3748/a0aec0?text=No+Image`,
        originalObservation: obs,
      }))
    : [];

  // Expanded content component
  const BiodiversityExpandedContent = () => (
    <>
      <div>
        <FilteredImage
          src={activeObservation?.photos[0]?.url?.replace('square', 'large') || `https://placehold.co/500x500/2d3748/a0aec0?text=No+Image`}
          alt={activeObservation?.taxon?.preferred_common_name || activeObservation?.taxon?.name || "Unknown"}
          className="w-full h-[560px] lg:h-[560px] sm:rounded-tr-lg sm:rounded-tl-lg object-contain"
          filterType="glass"
        />
      </div>

      <div>
        <div className="flex justify-between items-start p-4 bg-black/50 rounded-lg">
          <div>
            <motion.h3
              className="font-medium text-[var(--text-muted)] text-base">
              {activeObservation?.taxon?.preferred_common_name || activeObservation?.taxon?.name || "Unknown"}
            </motion.h3>
            <motion.p
              className="text-[var(--text-muted)] text-base">
              {activeContent?.description}
            </motion.p>
          </div>

          <div className="flex gap-2">
            {activeContent?.iNaturalistLink && (
              <motion.a
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                href={activeContent.iNaturalistLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm rounded-full font-bold bg-[var(--glass-icon-bg)] text-[var(--primary)] border-2 border-[var(--glass-icon-outline)] shadow-sm backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                aria-label={t('openInINaturalist')}
              >
                <INaturalistIcon />
                <div className="absolute inset-0 rounded-full shadow-[0_0_0_1px_var(--glass-icon-outline)] pointer-events-none"></div>
              </motion.a>
            )}
            {activeContent?.wikipediaLink && (
              <motion.a
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                href={activeContent.wikipediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm rounded-full font-bold bg-[var(--glass-icon-bg)] text-[var(--primary)] border-2 border-[var(--glass-icon-outline)] shadow-sm backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                aria-label={t('openInWikipedia')}
              >
                <WikipediaIcon />
                <div className="absolute inset-0 rounded-full shadow-[0_0_0_1px_var(--glass-icon-outline)] pointer-events-none"></div>
              </motion.a>
            )}
          </div>
        </div>
        <div className="pt-4 relative px-4">
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[var(--text-muted)] text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-white bg-primary-light/50 p-4 rounded-lg [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
          >
            {activeContent?.content}
          </motion.div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <HoverEffect 
        items={items} 
        onClickItem={handleCardClick} 
        getItemLayoutId={(item, idx) => `card-${item.originalObservation.id}-${id}`}
        filterType="glass"
      />
      
      {activeObservation && activeContent && (
        <ExpandableCard
          isExpanded={!!activeObservation}
          onToggle={(expanded) => {
            if (!expanded) {
              setActiveObservation(null);
              setActiveContent(null);
            }
          }}
          layoutId={`card-${activeObservation.id}-${id}`}
          expandedContent={<BiodiversityExpandedContent />}
          className="relative group block p-2 h-full w-full"
          expandedClassName="w-full max-w-2xl max-h-[90vh] flex flex-col bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] border-[var(--glass-border)] backdrop-blur-sm sm:rounded-3xl overflow-auto"
          closeOnBackdropClick={true}
          closeOnEscape={true}
        />
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export const INaturalistIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4 w-4">
      <path fill="currentColor" d="m 169.40915,63.999998 c 2.01925,14.333521 9.00815,36.639412 14.43815,50.219642 5.93219,14.83571 12.37705,28.9286 23.53,40.70928 0,0 33.17635,24.81688 33.17635,24.81688 14.67878,11.02739 28.86582,22.97549 41.84969,35.95934 2.81439,2.8144 11.73884,13.56977 15.47392,13.14081 4.16405,-0.4708 3.38982,-8.07698 3.35844,-11.04832 -0.17786,-15.26468 -8.62104,-37.61242 -15.43208,-51.26588 -8.99769,-18.0372 -19.67982,-35.64548 -33.83547,-50.17778 C 241.71497,105.82877 224.87047,93.796982 212.3051,85.918777 203.16094,80.185369 179.16013,65.830923 169.40915,63.999998 Z M 7.2416018,107.94218 c 1.203174,13.36052 9.7405092,23.3312 18.8323542,32.43352 15.5367,15.55762 31.115252,25.29814 49.173386,37.31945 7.2714,4.83365 24.984258,16.42601 32.433508,19.17764 -7.752648,2.20756 -11.226168,0.0942 -18.832348,0 -12.29336,-0.13601 -23.70785,0.75329 -35.572238,4.18496 3.630462,9.48941 11.68653,17.08513 18.832358,24.05312 18.38247,17.92213 56.298298,36.75449 81.606898,41.86015 0,0 -18.83236,2.38543 -18.83236,2.38543 0,0 -32.43351,5.98451 -32.43351,5.98451 3.07595,7.85728 12.71184,17.48271 18.39293,24.06357 25.35047,29.35756 50.79507,46.49502 90.41627,46.03468 0,0 26.15606,-2.09248 26.15606,-2.09248 4.01757,-0.0418 11.52959,-0.6173 13.02573,4.30005 1.01485,3.31659 -2.7307,8.78843 -4.56163,11.39358 -4.89642,6.94704 -16.07028,20.30756 -22.06524,26.11421 -24.32514,23.54045 -63.88356,45.54293 -98.34678,47.12276 3.35842,4.39421 11.57143,5.76479 16.73987,7.34463 13.7267,4.2268 34.87126,8.1816 49.1734,8.349 18.7905,0.21971 37.07882,-0.74283 55.45084,-5.10566 64.11373,-15.22284 112.57568,-56.48662 139.87214,-116.25845 16.58294,-36.31508 15.48439,-76.31293 29.38894,-105.67049 4.43608,-9.37433 8.81984,-15.6204 16.97007,-22.16988 2.34358,-1.89369 8.55826,-5.50323 7.59571,-9.01862 -0.86837,-3.15964 -6.92612,-4.11171 -9.68821,-4.74992 -8.43271,-1.93556 -20.70513,-3.80833 -29.29478,-3.81879 0,0 -14.64739,0 -14.64739,0 -25.00519,0.29295 -48.51427,13.24543 -64.03003,32.43352 0,0 -17.47225,25.10981 -17.47225,25.10981 -2.25988,2.92948 -5.32538,6.95752 -9.52081,6.41346 -3.35844,-0.44987 -7.08306,-4.16404 -9.41618,-6.43438 0,0 -15.98658,-16.5411 -15.98658,-16.5411 -17.28393,-17.73381 -37.5915,-33.37513 -58.29663,-46.90304 -47.13323,-30.77 -101.6843,-50.47074 -156.936362,-60.43097 0,0 -48.1271362,-6.88427 -48.1271362,-6.88427 z M 379.70388,202.5748 c 13.7267,-1.33919 14.64739,15.32746 4.18496,17.89075 -9.90791,2.43774 -17.51409,-12.60722 -4.18496,-17.89075 z"/>
    </svg>
  );
};

export const WikipediaIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-4 w-4">
      <path fill="currentColor" d="M 120.85 29.21 C 120.85 29.62 120.72 29.99 120.47 30.33 C 120.21 30.66 119.94 30.83 119.63 30.83 C 117.14 31.07 115.09 31.87 113.51 33.24 C 111.92 34.6 110.29 37.21 108.6 41.05 L 82.8 99.19 C 82.63 99.73 82.16 100 81.38 100 C 80.77 100 80.3 99.73 79.96 99.19 L 65.49 68.93 L 48.85 99.19 C 48.51 99.73 48.04 100 47.43 100 C 46.69 100 46.2 99.73 45.96 99.19 L 20.61 41.05 C 19.03 37.44 17.36 34.92 15.6 33.49 C 13.85 32.06 11.4 31.17 8.27 30.83 C 8 30.83 7.74 30.69 7.51 30.4 C 7.27 30.12 7.15 29.79 7.15 29.42 C 7.15 28.47 7.42 28 7.96 28 C 10.22 28 12.58 28.1 15.05 28.3 C 17.34 28.51 19.5 28.61 21.52 28.61 C 23.58 28.61 26.01 28.51 28.81 28.3 C 31.74 28.1 34.34 28 36.6 28 C 37.14 28 37.41 28.47 37.41 29.42 C 37.41 30.36 37.24 30.83 36.91 30.83 C 34.65 31 32.87 31.58 31.57 32.55 C 30.27 33.53 29.62 34.81 29.62 36.4 C 29.62 37.21 29.89 38.22 30.43 39.43 L 51.38 86.74 L 63.27 64.28 L 52.19 41.05 C 50.2 36.91 48.56 34.23 47.28 33.03 C 46 31.84 44.06 31.1 41.46 30.83 C 41.22 30.83 41 30.69 40.78 30.4 C 40.56 30.12 40.45 29.79 40.45 29.42 C 40.45 28.47 40.68 28 41.16 28 C 43.42 28 45.49 28.1 47.38 28.3 C 49.2 28.51 51.14 28.61 53.2 28.61 C 55.22 28.61 57.36 28.51 59.62 28.3 C 61.95 28.1 64.24 28 66.5 28 C 67.04 28 67.31 28.47 67.31 29.42 C 67.31 30.36 67.15 30.83 66.81 30.83 C 62.29 31.14 60.03 32.42 60.03 34.68 C 60.03 35.69 60.55 37.26 61.6 39.38 L 68.93 54.26 L 76.22 40.65 C 77.23 38.73 77.74 37.11 77.74 35.79 C 77.74 32.69 75.48 31.04 70.96 30.83 C 70.55 30.83 70.35 30.36 70.35 29.42 C 70.35 29.08 70.45 28.76 70.65 28.46 C 70.86 28.15 71.06 28 71.26 28 C 72.88 28 74.87 28.1 77.23 28.3 C 79.49 28.51 81.35 28.61 82.8 28.61 C 83.84 28.61 85.38 28.52 87.4 28.35 C 89.96 28.12 92.11 28 93.83 28 C 94.23 28 94.43 28.4 94.43 29.21 C 94.43 30.29 94.06 30.83 93.32 30.83 C 90.69 31.1 88.57 31.83 86.97 33.01 C 85.37 34.19 83.37 36.87 80.98 41.05 L 71.26 59.02 L 84.42 85.83 L 103.85 40.65 C 104.52 39 104.86 37.48 104.86 36.1 C 104.86 32.79 102.6 31.04 98.08 30.83 C 97.67 30.83 97.47 30.36 97.47 29.42 C 97.47 28.47 97.77 28 98.38 28 C 100.03 28 101.99 28.1 104.25 28.3 C 106.34 28.51 108.1 28.61 109.51 28.61 C 111 28.61 112.72 28.51 114.67 28.3 C 116.7 28.1 118.52 28 120.14 28 C 120.61 28 120.85 28.4 120.85 29.21 Z"/>
    </svg>
  );
};