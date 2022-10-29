import { useMainService } from "../machines/mainMachine";
import ChatBox from "./ChatBox";

import RemoteAudio from "./RemoteAudio";
import ToolBar from "./ToolBar";
import VideosSection from "./VideosSection";

const MainView = () => {
  const isChatVisible = useMainService((s) => s.context.sidebarMode === "chat");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1">
        <VideosSection />

        {isChatVisible && (
          <div className="w-[400px] h-full pt-5 mr-5">
            <ChatBox />
          </div>
        )}
      </div>

      <RemoteAudio />

      <ToolBar />
    </div>
  );
};

export default MainView;
