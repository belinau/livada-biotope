
import React from 'react';

const ObservationOverlay = ({ observation, description, lang, onClose }) => {
  if (!observation) {
    return null;
  }

  const wikipediaUrl = `https://${lang}.wikipedia.org/wiki/${observation.taxon.name.replace(/ /g, '_')}`;
  const iNaturalistUrl = observation.uri;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-full bg-white bg-opacity-90 p-4 slide-up-overlay flex flex-col justify-between">
      <div>
        <p className="font-bold text-lg">{observation.taxon.preferred_common_name}</p>
        <p className="text-sm mt-2 overflow-y-auto max-h-48">{description}</p>
      </div>
      <div className="flex justify-end space-x-4 mt-2">
        <a href={iNaturalistUrl} target="_blank" rel="noopener noreferrer" title="View on iNaturalist">
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
        </a>
        <a href={wikipediaUrl} target="_blank" rel="noopener noreferrer" title="Read on Wikipedia">
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
        </a>
      </div>
    </div>
  );
};

export default ObservationOverlay;
