import { ReactNode } from "react";
import ChatBox from "./ChatBox";
import LocalVideo from "./LocalVideo";
import RemoteAudio from "./RemoteAudio";
import RemoteVideo from "./RemoteVideo";
import ToolBar from "./ToolBar";

const MainView = () => {
  const isChatBoxVisible = true;

  const renderVideo = (videoJsx: ReactNode) => (
    <div className="flex flex-1 h-0">
      <div className="flex flex-1 rounded-3xl shadow bg-base-100 p-2">
        <div className="card h-full w-full">{videoJsx}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex flex-1 h-0 ml-5 justify-between">
        <div className="relative flex flex-1 flex-col items-stretch pr-5 max-w-3xl mx-auto">
          <div className="h-5" />
          {renderVideo(<RemoteVideo />)}
          <div className="h-3" />
          {renderVideo(<LocalVideo />)}
          <div className="h-5" />
        </div>

        {isChatBoxVisible && (
          <div className="w-[400px] h-full py-5">
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
