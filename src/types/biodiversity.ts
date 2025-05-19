export type BiodiversityItemType = 'plant' | 'animal' | 'fungi' | 'other';

export interface BiodiversityName {
  en: string;
  sl: string;
  scientific: string;
}

export interface BiodiversityDescription {
  en: string;
  sl: string;
}

export interface BiodiversityItem {
  id: string;
  name: BiodiversityName;
  description: BiodiversityDescription;
  type: BiodiversityItemType;
  imageUrl: string;
  inaturalistUrl?: string;
}

export interface BiodiversityShowcaseProps {
  items: BiodiversityItem[];
}

// Sensor related types
export type SensorType = 'moisture' | 'temperature' | 'humidity' | 'other';

export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface DataSource {
  id: string;
  name: string;
  endpoint: string;
  type: SensorType;
}

export interface SensorVisualizationProps {
  dataSource: DataSource;
}
