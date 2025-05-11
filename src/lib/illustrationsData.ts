export interface Illustration {
  id: string;
  src: string;
  alt: {
    en: string;
    sl: string;
  };
  caption?: {
    en: string;
    sl: string;
  };
  credit?: string;
  year?: string;
  type: 'botanical' | 'zoological';
  category?: string;
}

export const illustrations: Illustration[] = [
  {
    id: 'botanical-1',
    src: '/images/illustrations/botanical-1.jpg',
    alt: {
      en: 'Meadow plants illustration',
      sl: 'Ilustracija travniških rastlin'
    },
    caption: {
      en: 'Various meadow plants and grasses common in European wetlands',
      sl: 'Različne travniške rastline in trave, pogoste v evropskih mokriščih'
    },
    credit: 'Ernst Haeckel',
    year: '1904',
    type: 'botanical',
    category: 'meadow'
  },
  {
    id: 'botanical-2',
    src: '/images/illustrations/botanical-2.jpg',
    alt: {
      en: 'Cover plants illustration',
      sl: 'Ilustracija pokrovnih rastlin'
    },
    caption: {
      en: 'Ground cover plants with extensive root systems resistant to drought',
      sl: 'Pokrovne rastline z obsežnim koreninskim sistemom odpornim na sušo'
    },
    credit: 'Maria Sibylla Merian',
    year: '1705',
    type: 'botanical',
    category: 'cover-plants'
  },
  {
    id: 'botanical-3',
    src: '/images/illustrations/botanical-3.jpg',
    alt: {
      en: 'Root systems illustration',
      sl: 'Ilustracija koreninskih sistemov'
    },
    caption: {
      en: 'Detailed study of various plant root systems and their soil interaction',
      sl: 'Podrobna študija različnih koreninskih sistemov rastlin in njihove interakcije s tlemi'
    },
    credit: 'Franz Bauer',
    year: '1817',
    type: 'botanical',
    category: 'roots'
  },
  {
    id: 'botanical-4',
    src: '/images/illustrations/botanical-4.jpg',
    alt: {
      en: 'Drought-resistant plants illustration',
      sl: 'Ilustracija rastlin odpornih na sušo'
    },
    caption: {
      en: 'Collection of plants adapted to survive in dry conditions',
      sl: 'Zbirka rastlin prilagojenih za preživetje v suhih pogojih'
    },
    credit: 'Pierre-Joseph Redouté',
    year: '1824',
    type: 'botanical',
    category: 'drought-resistant'
  },
  {
    id: 'zoological-1',
    src: '/images/illustrations/zoological-1.jpg',
    alt: {
      en: 'Soil insects illustration',
      sl: 'Ilustracija talnih žuželk'
    },
    caption: {
      en: 'Various insects and arthropods that inhabit and maintain healthy soil',
      sl: 'Različne žuželke in členonožci, ki naseljujejo in vzdržujejo zdrava tla'
    },
    credit: 'Ernst Haeckel',
    year: '1899',
    type: 'zoological',
    category: 'insects'
  },
  {
    id: 'zoological-2',
    src: '/images/illustrations/zoological-2.jpg',
    alt: {
      en: 'Meadow ecosystem animals illustration',
      sl: 'Ilustracija živali travniškega ekosistema'
    },
    caption: {
      en: 'Animals and insects that form part of the meadow ecosystem',
      sl: 'Živali in žuželke, ki so del travniškega ekosistema'
    },
    credit: 'John James Audubon',
    year: '1827',
    type: 'zoological',
    category: 'ecosystem'
  }
];

export const getBotanicalIllustrations = (): Illustration[] => {
  return illustrations.filter(illustration => illustration.type === 'botanical');
};

export const getZoologicalIllustrations = (): Illustration[] => {
  return illustrations.filter(illustration => illustration.type === 'zoological');
};

export const getIllustrationsByCategory = (category: string): Illustration[] => {
  return illustrations.filter(illustration => illustration.category === category);
};
