export type Language = 'ru' | 'en';

export interface ReleasePlatformLinks {
  appleMusic?: string;
  spotify?: string;
  youtube?: string;
  youtubeMusic?: string;
  yandexMusic?: string;
  vk?: string;
  soundCloud?: string;
  deezer?: string;
  amazonMusic?: string;
  bandcamp?: string;
}

export interface Release {
  id: string;
  title: string;
  artists: string;
  year: number;
  date: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  genre: string;
  artworkUrl: string;
  description?: string;
  trackCount: number;
  featured?: boolean;
  published?: boolean;
  verified: boolean;
  verificationStatus: 'VERIFIED' | 'MANUAL' | 'UNVERIFIED';
  platforms: ReleasePlatformLinks;
  appleMusicId?: number;
  isrc?: string;
  label?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  releaseIds: string[];
  trackCount: number;
  profileUrl?: string;
  pos: [number, number, number];
}

export interface SpatialZone {
  id: string;
  nameRu: string;
  nameEn: string;
  zStart: number;
  zEnd: number;
}
