import React, { ChangeEvent } from "react";

import classes from "./SearchBar.module.css";

const searchBar = (props: {
  onNewSearchEvent: (searchedValue: string) => void;
}) => {
  let typingTimeout: NodeJS.Timeout;
  const optimiseRequests = (e: ChangeEvent<HTMLInputElement>) => {
    const searchedValue = e.target.value;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(
      () => props.onNewSearchEvent(searchedValue),
      800
    );
  };

  return (
    <input
      type="search"
      className={classes.SearchBar}
      onChange={optimiseRequests}
      placeholder="Search for your favorite artist..."
    />
  );
};

export default searchBar;
