import { ArtistInfo } from "./Artist";

export interface Track {
  id: string;
  artists: Array<ArtistInfo>;
  track_number: number;
  duration_ms: number;
  name: string;
}