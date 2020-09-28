import { AxiosRequestConfig } from "axios";
import express, { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import Authentification from "./authentification";
import { BASE_SPOTIFY_URL } from "./spotify";
import { Controller } from "./controller";

class AlbumController implements Controller {
  public path = '/v1/albums';
  public router = express.Router();
  private auth = Authentification.getInstance();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/:id/tracks`, this.getAlbumTracks);
    this.router.get(`${this.path}/:id`, this.getAlbum);
  }

  getAlbumTracks = async (req: Request, res: Response) => {

    const limit = req.query.limit ? req.query.limit : '50';
    const offset = req.query.offset ? req.query.offset : '0';

    const headers = await this.auth.getAuthHeader();

    const options: AxiosRequestConfig = {
      params: {
        limit, offset
      },
      headers
    }

    axios.get(`${BASE_SPOTIFY_URL}/albums/${req.params.id}/tracks`, options).then((albumTracks: AxiosResponse) => {
      const prettyData = albumTracks.data.items.map((item: any) => {
        return {
          id: item.id,
          artists: item.artists,
          track_number: item.track_number,
          duration_ms: item.duration_ms,
          name: item.name
        }
      })
      res.status(200).json({ items: prettyData });
    }).catch((err: AxiosError) => {
      console.log('error fetching album tracks: ', err);
      res.status(500).json(err.message);
    })
  }

  getAlbum = async (req: Request, res: Response) => {

    const headers = await this.auth.getAuthHeader();
    const options: AxiosRequestConfig = {
      headers
    }

    axios.get(`${BASE_SPOTIFY_URL}/albums/${req.params.id}`, options).then((album: AxiosResponse) => {
      const albumInfo = {
        id: album.data.id,
        name: album.data.name,
        images: album.data.images,
        total_tracks: album.data.total_tracks,
        release_date: album.data.release_date
      }
      res.status(200).json(albumInfo);
    }).catch((err: AxiosError) => {
      console.log('error fetching album: ', err);
      res.status(500).json(err.message);
    })
  }

}

export default AlbumController;