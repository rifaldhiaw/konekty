import { useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const service = useMainService();
  const remoteAudio = useSelector(service, (s) => s.context.streams?.[0]);

  // Get Local Audio Stream
  useEffect(() => {
    if (!!remoteAudio) {
      invariant(audioRef.current);
      audioRef.current.srcObject = remoteAudio;

      audioRef.current.onloadedmetadata = () => {
        invariant(audioRef.current);
        audioRef.current.play();
      };
    }
  }, [remoteAudio]);

  return <audio autoPlay={true} className="hidden" ref={audioRef}></audio>;
};

export default RemoteAudio;
