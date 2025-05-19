'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Using dynamic import for the map component to avoid SSR issues
const Map = dynamic(
  () => import('@/components/maps/MapComponent'),
  { ssr: false }
);

interface BiodiversityMapProps {
  // Add any props you need for the map
  className?: string;
}

export default function BiodiversityMap({ className = '' }: BiodiversityMapProps) {
  return (
    <div className={`biodiversity-map ${className}`}>
      <h2>Biodiversity Map</h2>
      <div style={{ height: '500px', width: '100%' }}>
        <Map />
      </div>
    </div>
  );
}
