import React from "react";
import { Link } from "react-router-dom";

import classes from "./Header.module.css";

function header() {
  return (
    <header className={classes.Header}>
      <Link
        to="/home"
        style={{
          textDecoration: "none",
          backgroundColor: "inherit",
          height: "100%",
        }}
      >
        <h3>Melos</h3>
      </Link>
    </header>
  );
}

export default header;
