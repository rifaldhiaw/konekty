import { useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const service = useMainService();
  const remoteStreamData = useSelector(service, (s) => s.context.streams?.[0]);

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
