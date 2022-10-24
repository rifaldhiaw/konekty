import { useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const RemoteVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const service = useMainService();
  const remoteStreams = useSelector(service, (s) => s.context.streams);

  const remoteStream = Object.values(remoteStreams)?.[0];
  const userName = Object.keys(remoteStreams)?.[0];

  useEffect(() => {
    if (!videoRef.current || !remoteStream) return;

    videoRef.current.srcObject = remoteStream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (!remoteStream) {
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
      <video className="object-cover w-full h-full" ref={videoRef}></video>;
      <div className="absolute drop-shadow-md text-white bottom-2 left-5">
        {userName}
      </div>
    </div>
  );
};

export default RemoteVideo;
