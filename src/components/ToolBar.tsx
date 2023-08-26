import { layoutService, useLayoutService } from "../machines/layoutMachine";
import { mainService } from "../machines/mainMachine";
import { mediaService, useMediaService } from "../machines/mediaMachine";
import ActionButton from "./ActionButton";

const ToolBar = () => {
  const isChatBoxVisible = true;

  const isVideoOn = useMediaService((s) => s.context.localVideoStatus);
  const isAudioOn = useMediaService((s) => s.context.localAudioStatus);
  const isBoardFocused = useLayoutService((s) => s.matches("boardFocused"));

  return (
    <div className="flex p-4 justify-center">
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
        <ActionButton
          small={true}
          isOn={isBoardFocused}
          icon="board"
          neutralMode={true}
          onClick={() => {
            layoutService.send("TOGGLE_BOARD");
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
