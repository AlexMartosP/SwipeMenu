export type ActiveFn = (retract: () => void) => void;
export type TOption = {
  onActive: ActiveFn;
};
export type TSide = {
  options: TOption[];
};
export type TSwipeData = {
  x: number;
  left: TSide;
  right: TSide;
  shouldTransition: boolean;
  disabled: boolean;
};
export type TSwipeContext = {
  swipeData: TSwipeData;
};
export type TUpdateSwipeContext = {
  updateSwipeDistance: (distance: number) => void;
  register: (side: "left" | "right", option: TOption) => void;
  retract: (distance: number) => void;
};
