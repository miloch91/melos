export enum ARTIST_ACTION_TYPE {
  SET_ARTISTS,
  STACK_ARTISTS,
  FETCHING_ARTISTS,
  SEARCHING_ARTISTS,
  RESET_PAGE,
  ADVANCE_PAGE,
}

const artistReducer = (state: any, action: any) => {
  switch (action.type) {
    case ARTIST_ACTION_TYPE.SET_ARTISTS:
      return { ...state, artists: action.artists };
    case ARTIST_ACTION_TYPE.STACK_ARTISTS:
      return { ...state, artists: state.artists.concat(action.artists) };
    case ARTIST_ACTION_TYPE.FETCHING_ARTISTS:
      return { ...state, fetching: action.fetching };
    case ARTIST_ACTION_TYPE.SEARCHING_ARTISTS:
      return { ...state, searchedValue: action.searchedValue, page: 0 };
    case ARTIST_ACTION_TYPE.RESET_PAGE:
      return { ...state, page: 0 };
    case ARTIST_ACTION_TYPE.ADVANCE_PAGE:
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
};

export default artistReducer;
