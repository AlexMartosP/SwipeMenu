import { createContext, useContext } from "react";
import { TSwipeContext, TUpdateSwipeContext } from "./types";

export const SwipeContext = createContext<TSwipeContext | null>(null);
export const UpdateSwipeContext = createContext<TUpdateSwipeContext | null>(
  null
);

export const useSwipeContext = () => {
  const context = useContext(SwipeContext);

  if (!context) {
    throw new Error(
      "useSwipContext is not being used within <SwipeContext.Provider>"
    );
  }

  return context;
};

export const useUpdateSipeContext = () => {
  const context = useContext(UpdateSwipeContext);

  if (!context) {
    throw new Error(
      "useSwipContext is not being used within <SwipeContext.Provider>"
    );
  }

  return context;
};
