import AlbumController from './album.controller';
import App from './app';
import ArtistController from './artist.controller';

const app = new App(
  [
    new AlbumController(),
    new ArtistController(),
  ],
  8000,
);

app.listen();