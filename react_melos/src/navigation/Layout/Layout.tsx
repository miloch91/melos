import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AlbumPage from "../AlbumPage/AlbumPage";
import ArtistPage from "../ArtistPage/ArtistPage";
import HomePage from "../HomePage/HomePage";

import classes from "./Layout.module.css";

function layout() {
  return (
    <div className={classes.Layout}>
      <Switch>
        <Route exact path="/albums/:albumId" component={AlbumPage}></Route>
        <Route exact path="/artists/:artistId" component={ArtistPage}></Route>
        <Route exact path="/home" component={HomePage}></Route>
        <Route render={() => <Redirect to="/home" />} />
      </Switch>
    </div>
  );
}

export default layout;
