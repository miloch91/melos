import { Image } from './Image'

export interface Album {
  id: string;
  name: string;
  images: Array<Image>;
  total_tracks: number;
  release_date: string;
}