import React from "react";
import { Link } from "react-router-dom";
import { Track } from "../../models/Track";

import classes from "./TrackItem.module.css";

const trackItem = (track: Track) => {
  const displayArtists = track.artists.map((artist) => {
    return (
      <Link
        key={artist.id}
        to={`/artists/${artist.id}`}
        style={{
          color: "lightgrey",
          fontSize: "0.7em",
          marginTop: "2px",
          marginRight: "8px",
        }}
      >
        {artist.name}
      </Link>
    );
  });

  const millisToMinutesAndSeconds = (millis: number) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds === "60"
      ? minutes + 1 + ":00"
      : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
  };

  return (
    <div className={classes.RootContainer}>
      <div className={classes.LeftContainer}>
        <div className={classes.NumberContainer}>{track.track_number}</div>
        <div className={classes.TitleContainer}>
          {track.name}
          <div className={classes.ArtistContainer}>{displayArtists}</div>
        </div>
      </div>
      <div>{millisToMinutesAndSeconds(track.duration_ms)}</div>
    </div>
  );
};

export default trackItem;
