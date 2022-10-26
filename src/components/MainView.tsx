import { useSelector } from "@xstate/react";
import ChatBox from "./ChatBox";
import { useMainService } from "./MachineProvider";
import RemoteAudio from "./RemoteAudio";
import ToolBar from "./ToolBar";
import VideosSection from "./VideosSection";

const MainView = () => {
  const service = useMainService();
  const isChatVisible = useSelector(
    service,
    (s) => s.context.sidebarMode === "chat"
  );

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
