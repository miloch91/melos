import express, { Request, Response } from "express";
import cors from "cors";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

require('dotenv').config();

const app = express();

app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let access_token: string | undefined;

const getAuthTokenCron = () => {

  console.log('fetching authentication token');

  const authorisation: string = Buffer.from(clientId + ':' + clientSecret).toString('base64');

  axios.post('https://accounts.spotify.com/api/token',
    `${encodeURIComponent('grant_type')}=${encodeURIComponent('client_credentials')}`, {
    headers: {
      'Authorization': 'Basic ' + authorisation,
    }
  }).then((res: AxiosResponse) => {
    access_token = res.data.access_token;
    console.log(res.data)
    // before expire refresh the token
    const refreshTimer = (res.data.expires_in - 60) * 1000;
    console.log('timer to refresh is: ', refreshTimer);
    setTimeout(getAuthTokenCron, refreshTimer);
  }).catch((err: AxiosError) => {
    access_token = undefined;
    console.log(`Error couldn't fetch authorisation token : ${err.message}`);
  });
}

getAuthTokenCron()

const baseSpotifyUrl = "https://api.spotify.com/v1";

const waitForToken = (resolve?: any) => {
  return new Promise(_resolve => {
    if (access_token) {
      resolve ? resolve() : _resolve();
    } else {
      setTimeout(() => {
        waitForToken(_resolve);
      }, 500);
    }
  })
}

const getAuthHeader = async () => {
  await waitForToken();
  return {
    'Authorization': `Bearer ${access_token}`,
  }
}

app.get("/v1/artists", async (req: Request, res: Response) => {
  const q = req.query.q;

  if (!q) {
    res.status(422).send('Missing mandatory parameter "q"');
    return;
  }

  const type = 'artist';
  const limit = req.query.limit ? req.query.limit : '50';
  const offset = req.query.offset ? req.query.offset : '0';

  const headers = await getAuthHeader();

  const options: AxiosRequestConfig = {
    params: {
      q, type, limit, offset
    },
    headers
  }

  axios.get(`${baseSpotifyUrl}/search`, options).then((artists: AxiosResponse) => {
    console.log(artists.data);
    res.status(200).json(artists.data);
  }).catch((err: AxiosError) => {
    console.log('error fetching artist: ', err);
    res.status(500).json(err.message);
  })
})

app.get("/v1/artists/:id/albums", async (req: Request, res: Response) => {

  const limit = req.query.limit ? req.query.limit : '50';
  const offset = req.query.offset ? req.query.offset : '0';

  const headers = await getAuthHeader();

  const options: AxiosRequestConfig = {
    params: {
      limit, offset
    },
    headers
  }

  axios.get(`${baseSpotifyUrl}/artists/${req.params.id}/albums`, options).then((albums: AxiosResponse) => {
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
});

app.get("/v1/albums/:id/tracks", async (req: Request, res: Response) => {

  const limit = req.query.limit ? req.query.limit : '50';
  const offset = req.query.offset ? req.query.offset : '0';

  const headers = await getAuthHeader();

  const options: AxiosRequestConfig = {
    params: {
      limit, offset
    },
    headers
  }

  axios.get(`${baseSpotifyUrl}/albums/${req.params.id}/tracks`, options).then((albumTracks: AxiosResponse) => {
    console.log(albumTracks.data);
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
})

app.listen(8000, () => {
  console.log('Server Started at Port, 8000')
})