import { Album } from "../models/Album";
import baseReducer, { BaseAction, BASE_ACTION_TYPE } from "./BaseReducer";

enum TRACK_ACTIONS {
  SET_ALBUM_ID = -2,
}

export const TRACK_ACTION_TYPE = {
  ...TRACK_ACTIONS,
  ...BASE_ACTION_TYPE,
};

export interface TrackAction extends BaseAction {
  type: any;
  albumId?: string;
  album?: Album;
}

const trackReducer = (state: any, action: TrackAction) => {
  // console.log("in artist reducer with: ", action);
  switch (action.type) {
    case TRACK_ACTION_TYPE.SET_ALBUM_ID:
      return { ...state, albumId: action.albumId };
    default:
      return baseReducer(state, action);
  }
};

export default trackReducer;
