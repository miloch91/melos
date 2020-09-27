import { AxiosError } from "axios";
import React, { useEffect, useReducer, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import axios from "../../utils/axios-instance";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "../../components/InfiniteScroll/InfiniteScroll.module.css";
import { useInfiniteScroll } from "../../components/InfiniteScroll/useInfinitScroll";
import albumReducer, { ALBUM_ACTION_TYPE } from "../../Reducers/AlbumReducer";
import { Album } from "../../models/Album";
import { BASE_ACTION_TYPE } from "../../Reducers/BaseReducer";

type TParams = { artistId: string };

const ArtistPage = (props: RouteComponentProps<TParams>) => {
  const [albumsData, albumDispatch] = useReducer(albumReducer, {
    data: [],
    fetching: false,
    artistId: "",
    artist: undefined,
    page: -1,
  });

  // implement infinite scrolling with intersection observer
  let bottomBoundaryRef = useRef(null);
  useInfiniteScroll(bottomBoundaryRef, albumDispatch);

  // const fetchArtist = async () => {
  //   console.log("logic to fetch the artist");
  //   // const artist = await axios
  //   //   .get(`/artists/${albumsData.artistId}`)
  //   //   .catch((err: AxiosError) => {
  //   //     console.log("failed to fech the artist info");
  //   //   });
  // };

  useEffect(() => {
    // console.log("albums data artistId changed ...", albumsData);
    // fetchArtist();
    const fetchAlbums = async () => {
      console.log("fetching albums ;;;", albumsData);
      // return;
      if (albumsData.page < 0) {
        return;
      }

      albumDispatch({
        type: BASE_ACTION_TYPE.FETCHING_DATA,
        fetching: true,
      });

      console.log("we are about to fetch albums with this: ", albumsData);
      const apiResponse = await axios
        .get(`/artists/${albumsData.artistId}/albums`, {
          params: {
            offset: 50 * albumsData.page,
          },
        })
        .catch((err: AxiosError) => {
          console.log("failed to fech the artist info");
        });
      const albums = apiResponse ? apiResponse.data.items : [];

      albumDispatch({
        type: BASE_ACTION_TYPE.FETCHING_DATA,
        fetching: false,
      });

      albumDispatch({
        type:
          albumsData.page > 0
            ? BASE_ACTION_TYPE.ADD_DATA
            : BASE_ACTION_TYPE.SET_DATA,
        data: albums,
      });
    };
    fetchAlbums();
  }, [albumsData.artistId, albumsData.page]);

  useEffect(() => {
    const artistId: string = props.match.params.artistId;
    albumDispatch({
      type: ALBUM_ACTION_TYPE.SET_ARTIST_ID,
      artistId,
    });
  }, []);

  console.log("here is the data: ", albumsData);
  const displayAlbums = albumsData.data.map((album: Album) => {
    return (
      <AlbumCard
        key={album.id}
        {...album}
        clicked={() => {
          props.history.push(`/albums/${album.id}`);
        }}
      />
    );
  });

  let spinner = null;
  if (albumsData.fetching) {
    spinner = <Spinner />;
  }

  return (
    <>
      <div className={classes.FlexContainer}>{displayAlbums}</div>
      <div
        id="page-bottom-boundary"
        // style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
      {spinner}
    </>
  );
};

export default ArtistPage;
