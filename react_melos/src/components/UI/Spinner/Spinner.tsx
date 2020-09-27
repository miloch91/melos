import React, { CSSProperties } from "react";

import classes from "./Spinner.module.css";

const spinner = (props: { style?: CSSProperties }) => {
  return (
    <div className={classes.Spinner} style={props.style}>
      Loading ...
    </div>
  );
};

export default spinner;
