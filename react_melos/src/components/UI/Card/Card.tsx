import React from "react";

import classes from "./Card.module.css";

import logo from "../../../assets/defaultImg.png";

const card = (props: {
  imgSrc?: string;
  title: string;
  subtitle?: string;
  clicked: () => void;
}) => {
  let imgPath = props.imgSrc;
  if (!imgPath) {
    imgPath = logo;
  }

  return (
    <div className={classes.Card} onClick={props.clicked}>
      <img src={imgPath} alt="Avatar" style={{ width: "100%" }} />
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
