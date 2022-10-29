import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "../machines/mainMachine";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const remoteStreamData = useMainService((s) => s.context.streams?.[0]);

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
