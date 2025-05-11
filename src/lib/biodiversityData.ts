export interface BiodiversityItem {
  id: string;
  name: {
    en: string;
    sl: string;
    scientific: string;
  };
  description: {
    en: string;
    sl: string;
  };
  type: 'plant' | 'animal' | 'fungi' | 'other';
  imageUrl: string;
  inaturalistUrl?: string;
}

export const biodiversityItems: BiodiversityItem[] = [
  {
    id: 'snakes-head-fritillary',
    name: {
      en: "Snake's Head Fritillary",
      sl: "Močvirska logarica",
      scientific: "Fritillaria meleagris"
    },
    description: {
      en: "A protected species in Slovenia, this distinctive checkered flower thrives in the wet meadows of Livada Biotope.",
      sl: "Zaščitena vrsta v Sloveniji, ta prepoznavna šahovnica cveti na mokrih travnikih Biotopa Livada."
    },
    type: 'plant',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482516600/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438476"
  },
  {
    id: 'european-nursery-web-spider',
    name: {
      en: "European Nursery Web Spider",
      sl: "Navadni pisanec",
      scientific: "Pisaura mirabilis"
    },
    description: {
      en: "This spider species is common in meadows and plays an important role in controlling insect populations at Livada Biotope.",
      sl: "Ta vrsta pajka je pogosta na travnikih in ima pomembno vlogo pri nadzoru populacij žuželk v Biotopu Livada."
    },
    type: 'animal',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482516123/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438466"
  },
  {
    id: 'lesser-celandine',
    name: {
      en: "Lesser Celandine",
      sl: "Navadna kurja češnjica",
      scientific: "Ficaria verna"
    },
    description: {
      en: "One of the first spring flowers to appear at Livada Biotope, with bright yellow flowers that provide early nectar for pollinators.",
      sl: "Ena prvih pomladnih cvetlic, ki se pojavijo v Biotopu Livada, z živorumenimi cvetovi, ki zagotavljajo zgodnji nektar za opraševalce."
    },
    type: 'plant',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482516928/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438472"
  },
  {
    id: 'meadow-foxtail',
    name: {
      en: "Meadow Foxtail",
      sl: "Travniški lisičji rep",
      scientific: "Alopecurus pratensis"
    },
    description: {
      en: "A common grass species in the wet meadows of Livada Biotope, providing habitat for many insects and small animals.",
      sl: "Pogosta travna vrsta na vlažnih travnikih Biotopa Livada, ki zagotavlja habitat za številne žuželke in majhne živali."
    },
    type: 'plant',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482516525/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438469"
  },
  {
    id: 'meadowsweet',
    name: {
      en: "Meadowsweet",
      sl: "Brestovolistni oslad",
      scientific: "Filipendula ulmaria"
    },
    description: {
      en: "A fragrant meadow plant with clusters of creamy-white flowers that thrives in the damp conditions of Livada Biotope.",
      sl: "Dišeča travniška rastlina z grozdi kremasto belih cvetov, ki uspeva v vlažnih razmerah Biotopa Livada."
    },
    type: 'plant',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482516617/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438471"
  },
  {
    id: 'hairy-bittercress',
    name: {
      en: "Hairy Bittercress",
      sl: "Dlakava grenkuljica",
      scientific: "Cardamine hirsuta"
    },
    description: {
      en: "A small flowering plant that appears early in spring, providing an important early food source for pollinators at Livada Biotope.",
      sl: "Majhna cvetoča rastlina, ki se pojavi zgodaj spomladi in zagotavlja pomemben zgodnji vir hrane za opraševalce v Biotopu Livada."
    },
    type: 'plant',
    imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/482517046/medium.jpeg",
    inaturalistUrl: "https://www.inaturalist.org/observations/268438479"
  }
];
