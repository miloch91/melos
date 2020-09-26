import express, { Request, response, Response } from "express";
import cors from "cors";
import axios, { AxiosError, AxiosResponse } from "axios";

require('dotenv').config()

const app = express()

app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let access_token = undefined;

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
    setTimeout(getAuthTokenCron, refreshTimer);
  }).catch((err: AxiosError) => {
    access_token = undefined;
    console.log(`Error couldn't fetch authorisation token : ${err.message}`);
  });
}

getAuthTokenCron()

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
})

app.listen(8000, () => {
  console.log('Server Started at Port, 8000')
})