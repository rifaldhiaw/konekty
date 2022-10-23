import { useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useMainService } from "./MachineProvider";

const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const svc = useMainService();
  const localVideo = useSelector(svc, (s) => s.context.localMediaStream);

  useEffect(() => {
    if (!videoRef.current || !localVideo) return;

    videoRef.current.srcObject = localVideo;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  });

  if (!localVideo) {
    return (
      <div className="flex flex-1 rounded-3xl shadow bg-base-100 p-2">
        <div className="card h-full w-full flex justify-center items-center">
          <div className="avatar placeholder">
            <div className="bg-base-300 rounded-full w-24">
              <span className="text-3xl font-semibold">US</span>
            </div>
          </div>
          <div className="absolute drop-shadow-md bottom-2 left-5">
            Rifaldhi AW
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 rounded-3xl shadow bg-base-100 p-2">
      <div className="card w-full h-full">
        <video className="object-cover w-full h-full" ref={videoRef}></video>
        <div className="absolute drop-shadow-md text-white bottom-2 left-5">
          Rifaldhi AW
        </div>
      </div>
    </div>
  );
};

export default LocalVideo;
