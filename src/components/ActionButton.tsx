import AudioOff from "../icons/AudioOff";
import AudioOn from "../icons/AudioOn";
import ChatOn from "../icons/ChatOn";
import DarkModeOff from "../icons/DarkModeOff";
import DarkModeOn from "../icons/DarkModeOn";
import More from "../icons/More";
import VideoOff from "../icons/VideoOff";
import VideoOn from "../icons/VideoOn";

const ActionButton = (props: {
  isOn: boolean;
  icon: "audio" | "video" | "chat" | "dark" | "more";
  loading?: boolean;
  small?: boolean;
  outline?: boolean;
  onClick: () => void;
}) => {
  const iconJsx = (() => {
    const size = props.small ? "1.2rem" : "1.5rem";

    switch (props.icon) {
      case "audio":
        return props.isOn ? <AudioOn size={size} /> : <AudioOff size={size} />;
      case "video":
        return props.isOn ? <VideoOn size={size} /> : <VideoOff size={size} />;
      case "chat":
        return <ChatOn size={size} />;
      case "more":
        return <More size={size} />;
      case "dark":
        return props.isOn ? (
          <DarkModeOn size={size} />
        ) : (
          <DarkModeOff size={size} />
        );
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
        "btn btn-circle swap mx-2 text-white" +
        (props.isOn
          ? props.outline
            ? " btn-outline"
            : " btn-secondary"
          : " btn-error") +
        (props.loading ? " loading" : "") +
        (props.small ? " min-h-0" : " w-[56px] h-[56px]")
      }
    >
      {!props.loading && iconJsx}
    </button>
  );
};

export default ActionButton;
