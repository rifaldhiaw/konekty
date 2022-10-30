import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

const RemoteAudio = (props: { stream: MediaStream | undefined }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get Local Audio Stream
  useEffect(() => {
    if (!!props.stream) {
      invariant(audioRef.current);
      audioRef.current.srcObject = props.stream;

      audioRef.current.onloadedmetadata = () => {
        invariant(audioRef.current);
        audioRef.current.play();
      };
    }
  }, [props.stream]);

  return <audio autoPlay={true} className="hidden" ref={audioRef}></audio>;
};

export default RemoteAudio;
