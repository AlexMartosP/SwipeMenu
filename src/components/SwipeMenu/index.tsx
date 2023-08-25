import {
  Children,
  PropsWithChildren,
  ReactElement,
  TouchEvent,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import {
  SwipeContext,
  UpdateSwipeContext,
  useSwipeContext,
  useUpdateSipeContext,
} from "./context";
import { determineSide, getSideInlineStyling, isHexColor } from "./helpers";
import { ActiveFn, TSwipeData, TUpdateSwipeContext } from "./types";

// Constants
const SWIPEBREAKPOINT = 100;
const OPTIONWIDTH = 75;

const getInitalData = (disabled: boolean = false) => ({
  x: 0,
  left: {
    options: [],
  },
  right: {
    options: [],
  },
  shouldTransition: false,
  disabled: disabled,
});
const noop = () => {};

type SwipeMenuProps = {
  disabled?: boolean;
} & PropsWithChildren;

const SwipeMenu = ({ children, disabled }: SwipeMenuProps) => {
  const [swipeData, setSwipeData] = useState<TSwipeData>(() =>
    getInitalData(disabled)
  );

  const updateValue = useMemo(
    () =>
      ({
        updateSwipeDistance: (distance) => {
          setSwipeData((prev) => ({
            ...prev,
            x: distance,
            shouldTransition: false,
          }));
        },
        retract: (distance) => {
          const side = determineSide(distance);

          if (
            (distance >= SWIPEBREAKPOINT || distance <= SWIPEBREAKPOINT * -1) &&
            swipeData[side].options.length === 1
          ) {
            swipeData[side].options[0].onActive(noop);
          }

          if (
            (distance >= SWIPEBREAKPOINT / 2 ||
              distance <= (SWIPEBREAKPOINT * -1) / 2) &&
            swipeData[side].options.length > 1
          ) {
            setSwipeData((prev) => ({
              ...prev,
              x: OPTIONWIDTH * swipeData[side].options.length,
              shouldTransition: true,
            }));

            return;
          }
          setSwipeData((prev) => ({
            ...prev,
            x: 0,
            shouldTransition: true,
          }));
        },
        register: (side, option) => {
          setSwipeData((prev) => ({
            ...prev,
            [side]: {
              options: [...prev[side].options, option],
            },
          }));
        },
      } satisfies TUpdateSwipeContext),
    [setSwipeData, swipeData.left, swipeData.right]
  );

  return (
    <SwipeContext.Provider
      value={{
        swipeData,
      }}
    >
      <UpdateSwipeContext.Provider value={updateValue}>
        <div
          className={
            !swipeData.disabled
              ? "overflow-hidden relative w-full flex touch-none"
              : ""
          }
        >
          {children}
        </div>
      </UpdateSwipeContext.Provider>
    </SwipeContext.Provider>
  );
};

SwipeMenu.Main = ({ children }: PropsWithChildren) => {
  const { swipeData } = useSwipeContext();
  const { updateSwipeDistance, retract } = useUpdateSipeContext();

  const touchStart = useRef<number>(0);
  const startPos = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    startPos.current = swipeData.x;
  };

  const handleTouchMove = (e: TouchEvent) => {
    updateSwipeDistance(
      startPos.current + (e.targetTouches[0].clientX - touchStart.current)
    );
  };

  const handleTouchEnd = (e: TouchEvent) => {
    retract(e.changedTouches[0].clientX - touchStart.current);

    touchStart.current = 0;
    startPos.current = 0;
  };

  return !swipeData.disabled ? (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${swipeData.x}px)`,
        transition: swipeData.shouldTransition ? "all 0.4s" : "",
      }}
      className="w-full will-change-transform"
    >
      {children}
    </div>
  ) : (
    children
  );
};
SwipeMenu.Main.displayName = "Main";

const sideClasses = {
  left: "left-0",
  right: "left-full",
};

const SideComponent = (side: "left" | "right") => {
  return ({ children }: PropsWithChildren) => {
    const { swipeData } = useSwipeContext();
    const { register } = useUpdateSipeContext();

    const registerred = useRef(false);
    const childrenCount = Children.count(children);

    if (childrenCount > 3) {
      throw new Error("Max 3 options per side allowed");
    }

    useEffect(() => {
      if (!registerred.current) {
        Children.forEach(children, (child) => {
          if (isValidElement(child)) {
            register(side, {
              onActive: child.props.onActive,
            });
          }
        });
      }
      registerred.current = true;
    }, []);

    return !swipeData.disabled ? (
      <div
        style={getSideInlineStyling(side, swipeData)}
        className={twMerge(
          "overflow-hidden absolute top-0 flex will-change-[width] h-full",
          sideClasses[side]
        )}
      >
        {children}
      </div>
    ) : null;
  };
};

SwipeMenu.Left = SideComponent("left");
SwipeMenu.Right = SideComponent("right");
SwipeMenu.Left.displayName = "Left";
SwipeMenu.Right.displayName = "Right";

type OptionProps = {
  background?: string;
  icon?: ReactElement;
  onActive?: ActiveFn;
} & PropsWithChildren;
SwipeMenu.Option = ({ background, icon, onActive, children }: OptionProps) => {
  const { retract } = useUpdateSipeContext();

  const color = background
    ? isHexColor(background)
      ? `bg-[${background}]`
      : background
    : "bg-gray-200";

  const clonedIcon =
    isValidElement(icon) &&
    cloneElement(icon, {
      style: {
        width: "1rem",
      },
    });

  return (
    <div
      className={twMerge(
        "flex-1 flex flex-col items-center justify-center w-full overflow-hidden",
        color
      )}
      onClick={() => onActive && onActive(() => retract(0))}
    >
      <span className="max-w-md">{clonedIcon}</span>
      <span className="text-sm whitespace-pre">{children}</span>
    </div>
  );
};
SwipeMenu.Option.displayName = "Option";

export default SwipeMenu;
