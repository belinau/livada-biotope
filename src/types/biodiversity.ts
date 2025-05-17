export interface BiodiversityItem {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: {
    en: string;
    sl: string;
  };
  type: string;
  imageUrl: string;
}
