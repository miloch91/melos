import { Image } from './Image'

export interface ArtistInfo {
  id: string;
  name: string;
}

export interface Artist extends ArtistInfo {
  images: Array<Image>
}