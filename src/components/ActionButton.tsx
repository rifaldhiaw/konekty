import AudioOff from "../icons/AudioOff";
import AudioOn from "../icons/AudioOn";
import ChatOn from "../icons/ChatOn";
import DarkModeOff from "../icons/DarkModeOff";
import DarkModeOn from "../icons/DarkModeOn";
import VideoOff from "../icons/VideoOff";
import VideoOn from "../icons/VideoOn";

const ActionButton = (props: {
  isOn: boolean;
  icon: "audio" | "video" | "chat" | "dark";
  loading?: boolean;
  onClick: () => void;
}) => {
  const iconJsx = (() => {
    switch (props.icon) {
      case "audio":
        return props.isOn ? <AudioOn /> : <AudioOff />;
      case "video":
        return props.isOn ? <VideoOn /> : <VideoOff />;
      case "chat":
        return <ChatOn />;
      case "dark":
        return props.isOn ? <DarkModeOn /> : <DarkModeOff />;
    }
  })();

  return (
    <button
      onClick={() => {
        if (!props.loading) {
          props.onClick();
        }
      }}
      className={
        "btn btn-circle swap mx-2 text-inherit" +
        (props.isOn ? " btn-outline" : " btn-error") +
        (props.loading ? " loading" : "")
      }
    >
      {!props.loading && iconJsx}
    </button>
  );
};

export default ActionButton;
