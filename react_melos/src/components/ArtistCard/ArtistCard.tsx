import React from "react";
import { Redirect } from "react-router-dom";
import { Artist } from "../../models/Artist";
import Card from "../UI/Card/Card";

export interface ArtistCardParams extends Artist {
  clicked: () => void;
}

const artistCard = (artist: ArtistCardParams) => {
  let imgSrc;
  if (artist.images.length > 0) {
    imgSrc = artist.images[artist.images.length > 2 ? 1 : 0].url;
  }

  const cardInfo = {
    imgSrc,
    title: artist.name,
  };

  return <Card {...cardInfo} clicked={artist.clicked} />;
};

export default artistCard;
