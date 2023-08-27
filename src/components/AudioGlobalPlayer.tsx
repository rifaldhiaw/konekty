import { useMediaService } from "../machines/mediaMachine";
import RemoteAudio from "./RemoteAudio";

const AudioGlobalPlayer = () => {
  const userStreamData = useMediaService((s) => s.context.userData);

  return (
    <>
      {userStreamData.map((user) => (
        <RemoteAudio key={user.id} stream={user.stream} />
      ))}
    </>
  );
};

export default AudioGlobalPlayer;
