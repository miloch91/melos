import React from "react";
import { Album } from "../../models/Album";
import Card from "../UI/Card/Card";

export interface AlbumCardParams extends Album {
  clicked?: () => void;
}

const albumCard = (album: AlbumCardParams) => {
  let imgSrc;
  if (album.images.length > 0) {
    imgSrc = album.images[album.images.length > 2 ? 1 : 0].url;
  }

  const cardInfo = {
    imgSrc,
    title: album.name,
  };

  return (
    <Card
      {...cardInfo}
      clicked={() => (album.clicked ? album.clicked() : null)}
    />
  );
};

export default albumCard;
