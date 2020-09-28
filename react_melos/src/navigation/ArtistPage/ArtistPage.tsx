import React, { useEffect, useReducer, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "../../components/InfiniteScroll/InfiniteScroll.module.css";
import { useInfiniteScroll } from "../../components/InfiniteScroll/useInfinitScroll";
import albumReducer, { ALBUM_ACTION_TYPE } from "../../Reducers/AlbumReducer";
import { Album } from "../../models/Album";
import { useFetch } from "../../components/InfiniteScroll/useFetch";

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

  useFetch(
    albumsData,
    albumDispatch,
    () => `/artists/${albumsData.artistId}/albums`,
    albumsData.artistId
  );

  useEffect(() => {
    const artistId: string = props.match.params.artistId;
    albumDispatch({
      type: ALBUM_ACTION_TYPE.SET_ARTIST_ID,
      artistId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
