import { useSelector } from "@xstate/react";
import ActionButton from "./ActionButton";
import { useMainService } from "./MachineProvider";

const ToolBar = () => {
  const isChatBoxVisible = true;

  const service = useMainService();
  const isVideoOn = useSelector(service, (s) => s.context.localVideoStatus);
  const isAudioOn = useSelector(service, (s) => s.context.localAudioStatus);

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
            // if (videoState.matches("inCall")) {
            //   sendVideoCallerEvent("VIDEO_OFF");
            // }
            // if (videoState.matches("idle")) {
            //   sendVideoCallerEvent("VIDEO_ON");
            // }
          }}
        />
        <ActionButton
          small={true}
          isOn={isAudioOn}
          icon="audio"
          onClick={() => {
            // if (isAudioOn) {
            //   sendAudioConnEvent("MUTE");
            // } else {
            //   sendAudioConnEvent("UNMUTE");
            // }
          }}
        />
      </div>
      <ActionButton
        small={true}
        isOn={isChatBoxVisible}
        icon="chat"
        onClick={() => {
          service.send({ type: "TOGGLE_CHAT" });
        }}
      />
    </div>
  );
};

export default ToolBar;
