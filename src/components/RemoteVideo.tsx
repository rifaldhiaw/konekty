import { memo, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "../machines/mainMachine";
import VideoPlaceholder from "./VideoPlaceholder";

const RemoteVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamData = useMainService((s) => s.context.streams?.[0]);
  const remoteStream = streamData?.stream;

  useEffect(() => {
    if (!videoRef.current || !remoteStream) return;

    videoRef.current.srcObject = remoteStream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (!remoteStream || remoteStream.getVideoTracks().length === 0) {
    return <VideoPlaceholder name={streamData?.userName} />;
  }

  return (
    <div className="w-full h-full">
      <video
        className="object-cover w-full h-full bg-base-200"
        ref={videoRef}
      ></video>
      ;
      <div className="absolute drop-shadow-md text-white bottom-2 left-5">
        {streamData?.userName}
      </div>
    </div>
  );
};

const RemoteVideoMemo = memo(RemoteVideo);

export default RemoteVideoMemo;
