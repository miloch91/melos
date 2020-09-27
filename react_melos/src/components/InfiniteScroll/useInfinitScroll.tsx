import { useEffect, useCallback } from "react";
import { BaseAction, BASE_ACTION_TYPE } from "../../Reducers/BaseReducer";

// infinite scrolling with intersection observer
export const useInfiniteScroll = (
  scrollRef: React.MutableRefObject<null>,
  dispatch: React.Dispatch<BaseAction>
) => {
  const scrollObserver = useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            dispatch({ type: BASE_ACTION_TYPE.ADVANCE_PAGE });
          }
        });
      }).observe(node);
    },
    [dispatch]
  );
  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};
