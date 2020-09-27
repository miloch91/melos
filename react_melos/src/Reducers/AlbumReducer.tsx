import { Artist } from "../models/Artist";
import baseReducer, { BaseAction, BASE_ACTION_TYPE } from "./BaseReducer";

enum ALBUM_ACTIONS {
  SET_ARTIST_ID = -2,
}

export const ALBUM_ACTION_TYPE = {
  ...ALBUM_ACTIONS,
  ...BASE_ACTION_TYPE,
};

export interface AlbumAction extends BaseAction {
  type: any;
  artistId?: string;
  artist?: Artist;
}

const albumReducer = (state: any, action: AlbumAction) => {
  // console.log("in artist reducer with: ", action);
  switch (action.type) {
    case ALBUM_ACTION_TYPE.SET_ARTIST_ID:
      return { ...state, artistId: action.artistId };
    default:
      return baseReducer(state, action);
  }
};

export default albumReducer;
