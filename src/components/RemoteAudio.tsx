import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMediaService } from "../machines/mediaMachine";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const remoteStreamData = useMediaService((s) => s.context.userData?.[0]);

  // Get Local Audio Stream
  useEffect(() => {
    if (!!remoteStreamData?.stream) {
      invariant(audioRef.current);
      audioRef.current.srcObject = remoteStreamData?.stream;

      audioRef.current.onloadedmetadata = () => {
        invariant(audioRef.current);
        audioRef.current.play();
      };
    }
  }, [remoteStreamData?.stream]);

  return <audio autoPlay={true} className="hidden" ref={audioRef}></audio>;
};

export default RemoteAudio;
