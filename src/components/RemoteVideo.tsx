import { useSelector } from "@xstate/react";
import { memo, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const RemoteVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const service = useMainService();
  const streamData = useSelector(service, (s) => s.context.streams?.[0]);
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
    return (
      <div className="h-full w-full flex justify-center items-center bg-base-200">
        <div className="avatar placeholder">
          <div className="bg-base-300 rounded-full w-24">
            <span className="text-3xl font-semibold">US</span>
          </div>
        </div>
        <div className="absolute drop-shadow-md bottom-2 left-5">
          {streamData?.userName}
        </div>
      </div>
    );
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
