import React, { useEffect, useReducer, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "../../components/InfiniteScroll/InfiniteScroll.module.css";
import { useInfiniteScroll } from "../../components/InfiniteScroll/useInfinitScroll";
import { useFetch } from "../../components/InfiniteScroll/useFetch";
import trackReducer, { TRACK_ACTION_TYPE } from "../../Reducers/TrackReducer";
import { Track } from "../../models/Track";
import TrackItem from "../../components/TrackItem/TrackItem";

type TParams = { albumId: string };

const AlbumPage = (props: RouteComponentProps<TParams>) => {
  const [tracksData, trackDispatch] = useReducer(trackReducer, {
    data: [],
    fetching: false,
    albumId: "",
    album: undefined,
    page: -1,
  });

  // implement infinite scrolling with intersection observer
  let bottomBoundaryRef = useRef(null);
  useInfiniteScroll(bottomBoundaryRef, trackDispatch);

  useFetch(
    tracksData,
    trackDispatch,
    () => `/albums/${tracksData.albumId}/tracks`,
    tracksData.albumId
  );

  useEffect(() => {
    const albumId: string = props.match.params.albumId;
    trackDispatch({
      type: TRACK_ACTION_TYPE.SET_ALBUM_ID,
      albumId,
    });
  }, []);

  const displayTracks = tracksData.data.map((track: Track) => {
    return <TrackItem key={track.id} {...track} />;
  });

  let spinner = null;
  if (tracksData.fetching) {
    spinner = <Spinner />;
  }

  return (
    <>
      <div className={classes.FlexContainer}>{displayTracks}</div>
      <div
        id="page-bottom-boundary"
        // style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
      {spinner}
    </>
  );
};

export default AlbumPage;
