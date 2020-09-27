export enum BASE_ACTION_TYPE {
  SET_DATA,
  ADD_DATA,
  FETCHING_DATA,
  RESET_PAGE,
  ADVANCE_PAGE,
}

export interface BaseAction {
  type: BASE_ACTION_TYPE;
  data?: Array<any>;
  fetching?: boolean;
  page?: number;
}

export interface BaseData {
  data: Array<any>;
  fetching: boolean;
  page: number;
}

const baseReducer = (state: any, action: BaseAction) => {
  // console.log("in base reducer with: ", action);
  switch (action.type) {
    case BASE_ACTION_TYPE.SET_DATA:
      return { ...state, data: action.data };
    case BASE_ACTION_TYPE.ADD_DATA:
      return { ...state, data: state.data.concat(action.data) };
    case BASE_ACTION_TYPE.FETCHING_DATA:
      return { ...state, fetching: action.fetching };
    case BASE_ACTION_TYPE.RESET_PAGE:
      return { ...state, page: 0 };
    case BASE_ACTION_TYPE.ADVANCE_PAGE:
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
};

export default baseReducer;
