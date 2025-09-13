import React from 'react';
import { getGlassVariant } from './glass-theme';
import { getTextClasses } from './typography-utils';
import FilteredImage from './ui/FilteredImage';

const PracticeCard = ({ title, coverPhoto }) => {
    return (
        <div className={`${getGlassVariant('card')} rounded-lg overflow-hidden h-full flex flex-col`}>
            <div className="flex-grow" style={{ flex: '2' }}>
                {coverPhoto && (
                    <FilteredImage src={coverPhoto} alt={title} className="w-full h-full object-cover" />
                )}
            </div>
            <div className="p-4 flex-grow" style={{ flex: '1' }}>
                <h3 className={getTextClasses({ size: 'lg', weight: 'bold', color: 'main' })}>{title}</h3>
            </div>
        </div>
    );
};

export default PracticeCard;