import { CheckCircle } from "react-feather";
import "./App.css";
import SwipeMenu from "./components/SwipeMenu";
import { useState } from "react";

function App() {
  const [activated, setActivated] = useState("");

  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="text-xl font-bold text-center p-12">SwipeMenu</h1>
      <SwipeMenu>
        <SwipeMenu.Left>
          <SwipeMenu.Option
            onActive={(retract) => {
              setActivated("Action 1 - this trigger retract");
              retract();
            }}
            icon={<CheckCircle />}
            background="bg-blue-500"
          >
            Action 1
          </SwipeMenu.Option>
          <SwipeMenu.Option onActive={() => setActivated("Action 2")}>
            Action 2
          </SwipeMenu.Option>
          <SwipeMenu.Option
            onActive={() => {
              console.log("in Active fn");
              setActivated("Action 3");
            }}
            background="bg-green-500"
          >
            Action 3
          </SwipeMenu.Option>
        </SwipeMenu.Left>
        <SwipeMenu.Main>
          <div className="flex items-center gap-2 justify-between p-2 bg-gray-100">
            <div>
              <h3 className="text-lg font-bold">Drag me left or right</h3>
              <p className="text-xs">You can add waterver element here</p>
            </div>
            <div>
              <button>And here</button>
            </div>
          </div>
        </SwipeMenu.Main>
        <SwipeMenu.Right>
          <SwipeMenu.Option onActive={() => setActivated("Swipe action")}>
            Swipe to activate
          </SwipeMenu.Option>
        </SwipeMenu.Right>
      </SwipeMenu>
      <div className="bg-gray-200 rounded-lg m-4 p-4">
        <div className="font-bold mb-2">Log:</div>
        <span>{activated && `"${activated}" activated`}</span>
      </div>
    </div>
  );
}

export default App;
