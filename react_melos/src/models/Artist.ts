import { Image } from './Image'

export interface Artist {
  id: string;
  name: string;
  images: Array<Image>
}