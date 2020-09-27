import baseReducer, { BaseAction, BASE_ACTION_TYPE } from "./BaseReducer";

enum ARTIST_ACTIONS {
  SEARCHING_ARTISTS = -1,
}

export const ARTIST_ACTION_TYPE = {
  ...ARTIST_ACTIONS,
  ...BASE_ACTION_TYPE,
};

export interface ArtistAction extends BaseAction {
  type: any;
  searchedValue?: string;
}

const artistReducer = (state: any, action: ArtistAction) => {
  // console.log("in artist reducer with: ", action);
  switch (action.type) {
    case ARTIST_ACTION_TYPE.SEARCHING_ARTISTS:
      return { ...state, searchedValue: action.searchedValue, page: 0 };
    default:
      return baseReducer(state, action);
  }
};

export default artistReducer;
