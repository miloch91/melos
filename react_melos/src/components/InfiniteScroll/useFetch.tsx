import { AxiosError } from "axios";
import { useEffect } from "react";
import {
  BaseAction,
  BaseData,
  BASE_ACTION_TYPE,
} from "../../Reducers/BaseReducer";
import axios from "../../utils/axios-instance";

export const useFetch = (
  data: BaseData,
  dispatch: React.Dispatch<BaseAction>,
  urlProvider: () => string,
  elementToWatch: any
) => {
  useEffect(() => {
    const fetchData = async () => {
      // return;
      if (data.page < 0) {
        return;
      }

      dispatch({
        type: BASE_ACTION_TYPE.FETCHING_DATA,
        fetching: true,
      });

      // console.log("we are about to fetch albums with this: ", albumsData);
      const apiResponse = await axios
        .get(urlProvider(), {
          params: {
            offset: 50 * data.page,
          },
        })
        .catch((err: AxiosError) => {
          console.log("failed to fech the artist info");
        });
      const newData = apiResponse ? apiResponse.data.items : [];

      dispatch({
        type: BASE_ACTION_TYPE.FETCHING_DATA,
        fetching: false,
      });

      dispatch({
        type:
          data.page > 0 ? BASE_ACTION_TYPE.ADD_DATA : BASE_ACTION_TYPE.SET_DATA,
        data: newData,
      });
    };
    fetchData();
  }, [elementToWatch, data.page]);
};
