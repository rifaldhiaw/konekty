import { Tldraw, VideoShape } from "@tldraw/tldraw";
import { useMainService } from "../machines/mainMachine";
import ChatBox from "./ChatBox";

import ToolBar from "./ToolBar";
import VideosSection from "./VideosSection";
import { useLayoutService } from "../machines/layoutMachine";

const MainView = () => {
  const isChatVisible = useMainService((s) => s.context.sidebarMode === "chat");
  const isBoardFocused = useLayoutService((s) => s.matches("boardFocused"));

  const renderView = () => {
    if (isBoardFocused) {
      return (
        <div className="flex flex-1 z-0">
          <Tldraw
            onMount={(editor) => {
              editor.setDarkMode(true);
            }}
          />
        </div>
      );
    }

    return (
      <div className={"flex flex-1 " + (isChatVisible ? "mr-[400px]" : "")}>
        <VideosSection />
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-base-200">
      <div className="flex flex-1 relative">
        {isChatVisible && (
          <div className="w-[300px] lg:w-[400px] pt-5 lg:right-5 fixed right-0 bottom-24 top-2 lg:fixed z-20">
            <ChatBox />
          </div>
        )}

        {renderView()}
      </div>
      <ToolBar />
    </div>
  );
};

export default MainView;
