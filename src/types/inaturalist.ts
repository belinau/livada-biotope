// Base interfaces for iNaturalist API responses
export interface INaturalistUser {
  id?: number;
  login?: string;
  name?: string;
  icon_url?: string;
}

export interface INaturalistPhoto {
  id?: number;
  url?: string;
  original_dimensions?: {
    width?: number;
    height?: number;
  };
  license_code?: string;
}

export interface INaturalistTaxon {
  id?: number;
  name?: string;
  preferred_common_name?: string;
  rank?: string;
  rank_level?: number;
  default_photo?: INaturalistPhoto;
  wikipedia_url?: string;
  is_active?: boolean;
  iconic_taxon_name?: string;
}

export interface INaturalistObservation {
  id: number;
  uuid?: string;
  observed_on_string?: string;
  observed_on?: string;
  time_observed_at?: string;
  user_id?: number;
  user?: INaturalistUser;
  quality_grade?: 'research' | 'needs_id' | 'casual' | string;
  license?: string;
  url?: string;
  place_guess?: string;
  latitude?: number;
  longitude?: number;
  positional_accuracy?: number;
  geoprivacy?: string;
  taxon_geoprivacy?: string;
  coordinates_obscured?: boolean;
  photos: INaturalistPhoto[];
  taxon?: INaturalistTaxon;
  community_taxon_id?: number;
  community_taxon?: INaturalistTaxon;
  identifications_count?: number;
  comments_count?: number;
  faves_count?: number;
  mappable?: boolean;
  captive?: boolean;
  oauth_application_id?: number;
  created_at?: string;
  updated_at?: string;
  time_zone?: string;
  uri?: string;
}

export interface INaturalistResponse {
  total_results?: number;
  page?: number;
  per_page?: number;
  results: INaturalistObservation[];
}
