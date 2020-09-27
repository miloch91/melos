import { AxiosError, AxiosResponse } from "axios";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SearchBar from "../../components/UI/SearchBar/SearchBar";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Artist } from "../../models/Artist";
import axios from "../../utils/axios-instance";

import classes from "./HomePage.module.css";
import artistReducer, {
  ARTIST_ACTION_TYPE,
} from "./InfiniteScroll/ArtistReducer";

const HomePage = (props: any) => {
  const [artistsData, artistDispatch] = useReducer(artistReducer, {
    artists: [],
    fetching: false,
    searchedValue: "",
    page: -1,
  });

  // implement infinite scrolling with intersection observer
  let bottomBoundaryRef = useRef(null);
  const scrollObserver = useCallback(
    (node: any) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            artistDispatch({ type: ARTIST_ACTION_TYPE.ADVANCE_PAGE });
          }
        });
      }).observe(node);
    },
    [artistDispatch]
  );
  useEffect(() => {
    if (bottomBoundaryRef.current) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver, bottomBoundaryRef]);

  useEffect(() => {
    console.log(artistsData);
    if (artistsData.page < 0) {
      // ignore first intersection with page
      return;
    }
    if (!artistsData.searchedValue || artistsData.searchedValue.length === 0) {
      artistDispatch({ type: ARTIST_ACTION_TYPE.SET_ARTISTS, artists: [] });
      return;
    }
    artistDispatch({
      type: ARTIST_ACTION_TYPE.FETCHING_ARTISTS,
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
              ? ARTIST_ACTION_TYPE.STACK_ARTISTS
              : ARTIST_ACTION_TYPE.SET_ARTISTS,
          artists: newArtists,
        });
        artistDispatch({
          type: ARTIST_ACTION_TYPE.FETCHING_ARTISTS,
          fetching: false,
        });
      })
      .catch((err: AxiosError) => {
        artistDispatch({
          type: ARTIST_ACTION_TYPE.FETCHING_ARTISTS,
          fetching: false,
        });
      });
  }, [artistsData.page, artistsData.searchedValue]);

  // on new search in url do the search
  useEffect(() => {
    console.log("test", props.location);
    const searchTermBuilder = props.location.search.split("=");

    artistDispatch({
      type: ARTIST_ACTION_TYPE.SEARCHING_ARTISTS,
      searchedValue: searchTermBuilder.length > 1 ? searchTermBuilder[1] : "",
    });
  }, [props.location.search]);

  const displayArtists = artistsData.artists.map((artist: Artist) => {
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
    <div>
      <SearchBar
        onNewSearchEvent={(searchedValue: string) => {
          props.history.push(`/home?search=${searchedValue}`);
        }}
        searchedValue={artistsData.searchedValue}
      />
      <div className={classes.ArtistContainer}>{displayArtists}</div>
      <div
        id="page-bottom-boundary"
        // style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
      {spinner}
    </div>
  );
};

export default HomePage;
