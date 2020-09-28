
import axios, { AxiosError, AxiosResponse } from "axios";

require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

class Authentification {

  private static instance: Authentification;
  private static access_token: string | undefined;

  public startAuthTokenCron = () => {
    console.log('start auth token');

    const authorisation: string = Buffer.from(clientId + ':' + clientSecret).toString('base64');

    axios.post('https://accounts.spotify.com/api/token',
      `${encodeURIComponent('grant_type')}=${encodeURIComponent('client_credentials')}`, {
      headers: {
        'Authorization': 'Basic ' + authorisation,
      }
    }).then((res: AxiosResponse) => {
      Authentification.access_token = res.data.access_token;
      // before expire refresh the token
      const refreshTimer = (res.data.expires_in - 60) * 1000;
      setTimeout(this.startAuthTokenCron, refreshTimer);
    }).catch((err: AxiosError) => {
      Authentification.access_token = undefined;
      console.log(`Error couldn't fetch authorisation token : ${err.message}`);
    });
  }

  private waitForToken = (resolve?: any) => {
    return new Promise(_resolve => {
      if (Authentification.access_token) {
        resolve ? resolve() : _resolve();
      } else {
        setTimeout(() => {
          this.waitForToken(_resolve);
        }, 500);
      }
    })
  }

  public getAuthHeader = async () => {
    await this.waitForToken();
    return {
      'Authorization': `Bearer ${Authentification.access_token}`,
    }
  }

  public static getInstance(): Authentification {
    if (!Authentification.instance) {
      Authentification.instance = new Authentification();
    }
    return Authentification.instance;
  }
}

export default Authentification;