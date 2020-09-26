import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import Layout from "../navigation/Layout/Layout";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Route component={Header} />
        <Layout />
      </div>
    </BrowserRouter>
  );
};

export default App;
