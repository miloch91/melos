import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useReducer, useRef } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SearchBar from "../../components/UI/SearchBar/SearchBar";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Artist } from "../../models/Artist";
import axios from "../../utils/axios-instance";

import classes from "../../components/InfiniteScroll/InfiniteScroll.module.css";
import artistReducer, {
  ARTIST_ACTION_TYPE,
} from "../../Reducers/ArtistReducer";
import { useInfiniteScroll } from "../../components/InfiniteScroll/useInfinitScroll";
import { RouteComponentProps } from "react-router-dom";

const HomePage = (props: RouteComponentProps) => {
  const [artistsData, artistDispatch] = useReducer(artistReducer, {
    data: [],
    fetching: false,
    searchedValue: "",
    page: -1,
  });

  // implement infinite scrolling with intersection observer
  let bottomBoundaryRef = useRef(null);
  useInfiniteScroll(bottomBoundaryRef, artistDispatch);

  useEffect(() => {
    // console.log(artistsData);
    if (artistsData.page < 0) {
      // ignore first intersection with page
      return;
    }
    if (!artistsData.searchedValue || artistsData.searchedValue.length === 0) {
      artistDispatch({ type: ARTIST_ACTION_TYPE.SET_DATA, data: [] });
      return;
    }
    artistDispatch({
      type: ARTIST_ACTION_TYPE.FETCHING_DATA,
      fetching: true,
    });
    axios
      .get("/artists", {
        params: {
          q: artistsData.searchedValue,
          offset: 50 * artistsData.page,
        },
      })
      .then((res: AxiosResponse) => {
        const newArtists: Array<Artist> = res.data.artists.items;
        artistDispatch({
          type:
            artistsData.page > 0
              ? ARTIST_ACTION_TYPE.ADD_DATA
              : ARTIST_ACTION_TYPE.SET_DATA,
          data: newArtists,
        });
        artistDispatch({
          type: ARTIST_ACTION_TYPE.FETCHING_DATA,
          fetching: false,
        });
      })
      .catch((err: AxiosError) => {
        artistDispatch({
          type: ARTIST_ACTION_TYPE.FETCHING_DATA,
          fetching: false,
        });
      });
  }, [artistsData.page, artistsData.searchedValue]);

  // on new search in url do the search
  useEffect(() => {
    const searchTermBuilder = props.location.search.split("=");

    artistDispatch({
      type: ARTIST_ACTION_TYPE.SEARCHING_ARTISTS,
      searchedValue: searchTermBuilder.length > 1 ? searchTermBuilder[1] : "",
    });
  }, [props.location.search]);

  const displayArtists = artistsData.data.map((artist: Artist) => {
    return (
      <ArtistCard
        key={artist.id}
        {...artist}
        clicked={() => {
          props.history.push(`/artists/${artist.id}`);
        }}
      />
    );
  });

  let spinner = null;
  if (artistsData.fetching) {
    spinner = <Spinner />;
  }

  return (
    <>
      <SearchBar
        onNewSearchEvent={(searchedValue: string) => {
          props.history.push(`/home?search=${searchedValue}`);
        }}
        searchedValue={artistsData.searchedValue}
      />
      <div className={classes.FlexContainer}>{displayArtists}</div>
      <div
        id="page-bottom-boundary"
        // style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
      {spinner}
    </>
  );
};

export default HomePage;
