import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import classes from "./Header.module.css";

const header = (props: RouteComponentProps) => {
  return (
    <header className={classes.Header}>
      <IoIosArrowBack
        style={{ marginLeft: "8px" }}
        onClick={() => props.history.goBack()}
      />
      <Link
        to="/home"
        style={{
          textDecoration: "none",
          backgroundColor: "inherit",
          height: "100%",
          color: "white",
        }}
      >
        <h3>Melos</h3>
      </Link>
      <IoIosArrowForward
        style={{ marginRight: "8px" }}
        onClick={() => props.history.goForward()}
      />
    </header>
  );
};

export default header;
