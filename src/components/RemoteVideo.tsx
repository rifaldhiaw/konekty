import { memo, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import VideoPlaceholder from "./VideoPlaceholder";

const RemoteVideo = (props: {
  stream: MediaStream | undefined;
  name: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !props.stream) return;

    videoRef.current.srcObject = props.stream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (!props.stream || props.stream.getVideoTracks().length === 0) {
    return <VideoPlaceholder name={props.name} />;
  }

  return (
    <div className="w-full h-full">
      <video
        className="object-cover w-full h-full bg-base-200"
        ref={videoRef}
      ></video>
      ;
      <div className="absolute drop-shadow-md text-white bottom-2 left-5">
        {props.name}
      </div>
    </div>
  );
};

const RemoteVideoMemo = memo(RemoteVideo);

export default RemoteVideoMemo;
