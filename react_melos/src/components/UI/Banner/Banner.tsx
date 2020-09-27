import React from "react";

import classes from "./Banner.module.css";

export enum BannerType {
  ALBUM,
  ARTIST,
}

export interface BannerParams {
  imgSrc: string;
  title: string;
  type: BannerType;
  subtitle?: string;
}

const banner = (bannerInfo: BannerParams) => {
  return (
    <div className={classes.RootContainer}>
      <div className={classes.LeftContainer}>
        <img src={bannerInfo.imgSrc} />
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
