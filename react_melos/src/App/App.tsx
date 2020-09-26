import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header";
import Layout from "../navigation/Layout/Layout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Layout />
      </div>
    </BrowserRouter>
  );
}

export default App;
