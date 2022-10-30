import { mainService } from "../machines/mainMachine";
import { mediaService, useMediaService } from "../machines/mediaMachine";
import ActionButton from "./ActionButton";

const ToolBar = () => {
  const isChatBoxVisible = true;

  const isVideoOn = useMediaService((s) => s.context.localVideoStatus);
  const isAudioOn = useMediaService((s) => s.context.localAudioStatus);

  return (
    <div className="flex bg-base-100 p-4 justify-center">
      <ActionButton
        small={true}
        isOn={true}
        icon="more"
        onClick={() => {
          // service.send({ type: "TOGGLE_CHAT" });
        }}
      />
      <div className="flex flex-1 justify-center">
        <ActionButton
          small={true}
          isOn={isVideoOn}
          icon="video"
          onClick={() => {
            mediaService.send("TOGGLE_VIDEO");
          }}
        />
        <ActionButton
          small={true}
          isOn={isAudioOn}
          icon="audio"
          onClick={() => {
            mediaService.send("TOGGLE_AUDIO");
          }}
        />
      </div>
      <ActionButton
        small={true}
        isOn={isChatBoxVisible}
        icon="chat"
        onClick={() => {
          mainService.send({ type: "TOGGLE_CHAT" });
        }}
      />
    </div>
  );
};

export default ToolBar;
