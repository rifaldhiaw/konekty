import { memo, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "../machines/mainMachine";
import { useMediaService } from "../machines/mediaMachine";
import VideoPlaceholder from "./VideoPlaceholder";

const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const localVideoStatus = useMediaService((s) => s.context.localVideoStatus);
  const localMediaStream = useMediaService((s) => s.context.localMediaStream);
  const userName = useMainService((s) => s.context.userName);

  useEffect(() => {
    if (!videoRef.current || !localMediaStream) return;

    videoRef.current.srcObject = localMediaStream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (localVideoStatus === false) {
    return <VideoPlaceholder name={userName} />;
  }

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        playsInline={true}
        muted={true}
        className="object-cover w-full h-full flip bg-base-200"
      ></video>
      <div className="absolute text-shadow text-white bottom-2 left-5">
        {userName}
      </div>
    </div>
  );
};

const LocalVideoMemo = memo(LocalVideo);

export default LocalVideoMemo;
