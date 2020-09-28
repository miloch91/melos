import React from "react";

import classes from "./Banner.module.css";
import logo from "../../../assets/defaultImg.png";

export enum BannerType {
  ALBUM,
  ARTIST,
}

export interface BannerParams {
  imgSrc?: string;
  title: string;
  type: BannerType;
  subtitle?: string;
}

const banner = (bannerInfo: BannerParams) => {
  let imgPath = bannerInfo.imgSrc;
  if (!imgPath) {
    imgPath = logo;
  }

  return (
    <div className={classes.RootContainer}>
      <div className={classes.LeftContainer}>
        <img alt="Album" src={imgPath} />
      </div>
      <div className={classes.RightContainer}>
        {bannerInfo.type === BannerType.ALBUM ? <h6>Album</h6> : null}
        <h1>{bannerInfo.title}</h1>
        <h6>{bannerInfo.subtitle}</h6>
      </div>
    </div>
  );
};

export default banner;
