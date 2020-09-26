import { AxiosError, AxiosResponse } from "axios";
import React, { ChangeEvent, useState } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SearchBar from "../../components/UI/SearchBar/SearchBar";
import { Artist } from "../../models/Artist";
import axios from "../../utils/axios-instance";

import classes from "./HomePage.module.css";

const HomePage = () => {
  const [artists, setArtists] = useState<Array<Artist>>([]);

  // const setNewArtists = (artists: Array<Artist>) => {

  // };

  const onNewSearchEvent = (searchedValue: string) => {
    if (!searchedValue && searchedValue.length === 0) {
      setArtists([]);
      return;
    }
    axios
      .get("/artists", {
        params: {
          q: searchedValue,
        },
      })
      .then((res: AxiosResponse) => {
        const newArtists: Array<Artist> = res.data.artists.items;
        setArtists(newArtists);
      })
      .catch((err: AxiosError) => {
        console.log("failed to fetch artists ...");
      });
  };

  console.log("artists are :", artists);

  const displayArtists = artists.map((artist) => {
    return <ArtistCard key={artist.id} {...artist} />;
  });

  return (
    <div>
      <SearchBar onNewSearchEvent={onNewSearchEvent} />
      <div className={classes.ArtistContainer}>{displayArtists}</div>
    </div>
  );
};

export default HomePage;
