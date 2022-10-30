import { useMainService } from "../machines/mainMachine";
import ChatBox from "./ChatBox";

import ToolBar from "./ToolBar";
import VideosSection from "./VideosSection";

const MainView = () => {
  const isChatVisible = useMainService((s) => s.context.sidebarMode === "chat");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 relative">
        <VideosSection />

        {isChatVisible && (
          <div className="w-[300px] lg:w-[400px] h-full pt-5 lg:mr-5 fixed right-0 pb-20 lg:pb-0 lg:relative">
            <ChatBox />
          </div>
        )}
      </div>
      <ToolBar />
    </div>
  );
};

export default MainView;
