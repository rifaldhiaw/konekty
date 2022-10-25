import { useSelector } from "@xstate/react";
import { memo, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const service = useMainService();
  const localMediaStream = useSelector(
    service,
    (s) => s.context.localMediaStream
  );
  const userName = useSelector(service, (s) => s.context.userName);

  useEffect(() => {
    if (!videoRef.current || !localMediaStream) return;

    videoRef.current.srcObject = localMediaStream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (!localMediaStream) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="avatar placeholder">
          <div className="bg-base-300 rounded-full w-24">
            <span className="text-3xl font-semibold">US</span>
          </div>
        </div>
        <div className="absolute drop-shadow-md bottom-2 left-5">
          {userName}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <video className="object-cover w-full h-full flip" ref={videoRef}></video>
      <div className="absolute drop-shadow-md text-white bottom-2 left-5">
        {userName}
      </div>
    </div>
  );
};

const LocalVideoMemo = memo(LocalVideo);

export default LocalVideoMemo;
