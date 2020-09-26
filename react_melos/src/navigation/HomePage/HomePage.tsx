import { AxiosError, AxiosResponse } from "axios";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SearchBar from "../../components/UI/SearchBar/SearchBar";
import { Artist } from "../../models/Artist";
import axios from "../../utils/axios-instance";

import classes from "./HomePage.module.css";

const HomePage = () => {
  const artistReducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_ARTISTS":
        return { ...state, artists: action.artists };
      case "STACK_ARTISTS":
        return { ...state, artists: state.artists.concat(action.artists) };
      case "FETCHING_ARTISTS":
        return { ...state, fetching: action.fetching };
      case "SEARCHING_ARTISTS":
        return { ...state, searchedValue: action.searchedValue };
      default:
        return state;
    }
  };
  const [artistsData, artistDispatch] = useReducer(artistReducer, {
    artists: [],
    fetching: true,
    searchedValue: "",
  });
  // next code block goes here

  const pageReducer = (state: any, action: any) => {
    switch (action.type) {
      case "RESET_PAGE":
        return { ...state, page: -1 };
      case "ADVANCE_PAGE":
        return { ...state, page: state.page + 1 };
      default:
        return state;
    }
  };
  const [pager, pagerDispatch] = useReducer(pageReducer, { page: -1 });

  // implement infinite scrolling with intersection observer
  let bottomBoundaryRef = useRef(null);
  const scrollObserver = useCallback(
    (node: any) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            pagerDispatch({ type: "ADVANCE_PAGE" });
          }
        });
      }).observe(node);
    },
    [pagerDispatch]
  );

  useEffect(() => {
    if (bottomBoundaryRef.current) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver, bottomBoundaryRef]);

  const onNewSearchEvent = (searchedValue: string) => {
    artistDispatch({ type: "SEARCHING_ARTISTS", searchedValue });
    if (!searchedValue && searchedValue.length === 0) {
      artistDispatch({ type: "SET_ARTISTS", artists: [] });
      pagerDispatch({ type: "RESET_PAGE" });
      return;
    }
    artistDispatch({ type: "FETCHING_ARTISTS", fetching: true });
    axios
      .get("/artists", {
        params: {
          q: searchedValue,
        },
      })
      .then((res: AxiosResponse) => {
        const newArtists: Array<Artist> = res.data.artists.items;
        artistDispatch({ type: "SET_ARTISTS", artists: newArtists });
        artistDispatch({ type: "FETCHING_ARTISTS", fetching: false });
      })
      .catch((err: AxiosError) => {
        artistDispatch({ type: "FETCHING_ARTISTS", fetching: false });
      });
  };

  useEffect(() => {
    if (pager.page <= 0) {
      // we already loaded the first time so do nothing
      return;
    }
    artistDispatch({ type: "FETCHING_ARTISTS", fetching: true });
    axios
      .get("/artists", {
        params: {
          q: artistsData.searchedValue,
          offset: 50 * pager.page,
        },
      })
      .then((res: AxiosResponse) => {
        const newArtists: Array<Artist> = res.data.artists.items;
        artistDispatch({ type: "STACK_ARTISTS", artists: newArtists });
        artistDispatch({ type: "FETCHING_ARTISTS", fetching: false });
      })
      .catch((err: AxiosError) => {
        artistDispatch({ type: "FETCHING_ARTISTS", fetching: false });
      });
  }, [pager.page]);

  const displayArtists = artistsData.artists.map((artist: Artist) => {
    return <ArtistCard key={artist.id} {...artist} />;
  });

  return (
    <div>
      <SearchBar onNewSearchEvent={onNewSearchEvent} />
      <div className={classes.ArtistContainer}>{displayArtists}</div>
      <div
        id="page-bottom-boundary"
        // style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
    </div>
  );
};

export default HomePage;
