import React from "react";
import { Artist } from "../../models/Artist";
import Card from "../UI/Card/Card";

const artistCard = (props: Artist) => {
  let imgSrc;
  if (props.images.length > 0) {
    imgSrc = props.images[props.images.length > 2 ? 1 : 0].url;
  }

  const cardInfo = {
    imgSrc,
    title: props.name,
  };

  return <Card {...cardInfo} />;
};

export default artistCard;
