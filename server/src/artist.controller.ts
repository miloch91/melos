import { AxiosRequestConfig } from "axios";
import express, { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_SPOTIFY_URL } from "./spotify";
import { Controller } from "./controller";
import Authentification from "./authentification";

class ArtistController implements Controller {
  public path = '/v1/artists';
  public router = express.Router();
  private auth = Authentification.getInstance();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getArtists);
    this.router.get(`${this.path}/:id/albums`, this.getArtistAlbums)
    this.router.get(`${this.path}/:id`, this.getArtist)
  }

  getArtists = async (req: Request, res: Response) => {
    const q = req.query.q;

    if (!q) {
      res.status(422).send('Missing mandatory parameter "q"');
      return;
    }

    const type = 'artist';
    const limit = req.query.limit ? req.query.limit : '50';
    const offset = req.query.offset ? req.query.offset : '0';

    const headers = await this.auth.getAuthHeader();

    const options: AxiosRequestConfig = {
      params: {
        q, type, limit, offset
      },
      headers
    }

    axios.get(`${BASE_SPOTIFY_URL}/search`, options).then((artists: AxiosResponse) => {
      res.status(200).json(artists.data);
    }).catch((err: AxiosError) => {
      console.log('error fetching artist: ', err);
      res.status(500).json(err.message);
    })
  }

  getArtistAlbums = async (req: Request, res: Response) => {

    const limit = req.query.limit ? req.query.limit : '50';
    const offset = req.query.offset ? req.query.offset : '0';

    const headers = await this.auth.getAuthHeader();

    const options: AxiosRequestConfig = {
      params: {
        limit, offset
      },
      headers
    }

    axios.get(`${BASE_SPOTIFY_URL}/artists/${req.params.id}/albums`, options).then((albums: AxiosResponse) => {
      const albumsData = albums.data.items.reduce((finalData: any, currentAlbum: any) => {
        finalData[currentAlbum.name] = {
          id: currentAlbum.id,
          name: currentAlbum.name,
          release_date: currentAlbum.release_date,
          images: currentAlbum.images,
          album_group: currentAlbum.album_group,
          album_type: currentAlbum.album_type,
          total_tracks: currentAlbum.total_tracks,
          type: currentAlbum.type
        }
        return finalData;
      }, {});
      const prettyData = Object.keys(albumsData).map((key: string) => {
        return albumsData[key];
      })
      res.status(200).json({ items: prettyData });
    }).catch((err: AxiosError) => {
      console.log('error fetching albums: ', err);
      res.status(500).json(err.message);
    })
  }

  getArtist = async (req: Request, res: Response) => {

    const headers = await this.auth.getAuthHeader();
    const options: AxiosRequestConfig = {
      headers
    }

    axios.get(`${BASE_SPOTIFY_URL}/artists/${req.params.id}`, options).then((artist: AxiosResponse) => {
      const artistInfo = {
        id: artist.data.id,
        name: artist.data.name,
        images: artist.data.images,
      }
      res.status(200).json(artistInfo);
    }).catch((err: AxiosError) => {
      console.log('error fetching album: ', err);
      res.status(500).json(err.message);
    })
  }

}

export default ArtistController;