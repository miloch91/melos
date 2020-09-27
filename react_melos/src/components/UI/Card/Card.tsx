import React from "react";

import classes from "./Card.module.css";

import logo from "../../../assets/defaultImg.png";

export enum CARD_TYPE {
  ARTIST,
  ALBUM,
}

const card = (props: {
  type?: CARD_TYPE;
  imgSrc?: string;
  title: string;
  subtitle?: string;
  clicked: () => void;
}) => {
  let imgPath = props.imgSrc;
  if (!imgPath) {
    imgPath = logo;
  }

  let type = CARD_TYPE.ALBUM;
  if (props.type !== undefined) {
    type = props.type;
  }

  const imgStyle =
    type === CARD_TYPE.ALBUM
      ? {
          width: "100%",
        }
      : {
          borderRadius: "50%",
          marginTop: "8px",
        };

  return (
    <div className={classes.Card} onClick={props.clicked}>
      <img src={imgPath} alt="Avatar" style={imgStyle} />
      <div className="container">
        <h4>
          <b>{props.title}</b>
        </h4>
        <p>{props.subtitle}</p>
      </div>
    </div>
  );
};

export default card;
