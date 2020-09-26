import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AlbumPage from "../navigation/AlbumPage/AlbumPage";
import ArtistPage from "../navigation/ArtistPage/ArtistPage";
import HomePage from "../navigation/HomePage/HomePage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="nav">Melos</header>
        <body>
          <Switch>
            <Route path="/album/:albumId" component={AlbumPage}></Route>
            <Route path="/artist/:artistId" component={ArtistPage}></Route>
            <Route path="/:catchAll" component={HomePage}></Route>
          </Switch>
        </body>
      </div>
    </BrowserRouter>
  );
}

export default App;
