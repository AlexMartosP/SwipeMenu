import { TSwipeData } from "./types";

export const determineSide = (distance: number) => {
  if (distance > 0) return "left";

  return "right";
};

export const isHexColor = (color: string) => {
  return color.startsWith("#");
};

export const getSideInlineStyling = (
  side: "left" | "right",
  swipeData: TSwipeData
) => {
  if (side === "left") {
    return {
      width: swipeData.x,
      transition: swipeData.shouldTransition ? "all 0.4s" : "",
    };
  }

  return {
    width: swipeData.x * -1,
    transform: `translateX(${swipeData.x}px)`,
    backgroundColor: "blue",
    transition: swipeData.shouldTransition ? "all 0.4s" : "",
  };
};
