import { useSelector } from "@xstate/react";
import ActionButton from "./ActionButton";
import { useMainService } from "./MachineProvider";

const ToolBar = () => {
  const isChatBoxVisible = true;
  const isDarkMode = false;

  const service = useMainService();
  const isVideoOn = useSelector(service, (s) => s.context.localVideoStatus);
  const isAudioOn = useSelector(service, (s) => s.context.localAudioStatus);

  return (
    <div className="flex bg-base-100 shadow-xl border border-base-300 p-4 justify-center">
      <ActionButton
        isOn={isDarkMode}
        icon="dark"
        onClick={() => {
          // useGlobalStore.setState({ isDarkMode: !isDarkMode });
        }}
      />
      <div className="flex flex-1 justify-center">
        <ActionButton
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
        isOn={isChatBoxVisible}
        icon="chat"
        onClick={() => {
          // useGlobalStore.setState({ isChatBoxVisible: !isChatBoxVisible });
        }}
      />
    </div>
  );
};

export default ToolBar;
