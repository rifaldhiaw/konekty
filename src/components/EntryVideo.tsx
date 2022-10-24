import { useSelector } from "@xstate/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import ActionButton from "./ActionButton";
import { useMainService } from "./MachineProvider";

const EntryVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const service = useMainService();

  const isInitializing = useSelector(service, (s) => s.matches("initializing"));

  const localStream = useSelector(service, (s) => s.context.localMediaStream);
  const isAudioOn = useSelector(service, (s) => s.context.localAudioStatus);
  const isVideoOn = useSelector(service, (s) => s.context.localVideoStatus);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!localStream) {
      videoRef.current.srcObject = null;
      return;
    }

    videoRef.current.srcObject = localStream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  }, [localStream]);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = containerRef.current.offsetWidth;
    const h = w ? (w * 9) / 16 : 0;
    const fixedH = Math.floor(h);
    containerRef.current.style.height = fixedH + "px";
  });

  return (
    <div ref={containerRef} className="flex flex-1">
      <div className="card w-full h-full relative">
        {localStream && !localStream.getVideoTracks().length && (
          <div className="absolute z-10 h-full w-full flex justify-center items-center">
            <p className="text-2xl text-white">
              {isInitializing ? "Camera is Starting" : "Camera is Off"}
            </p>
          </div>
        )}
        <video
          className="object-cover w-full h-full flip bg-black"
          ref={videoRef}
        ></video>
      </div>

      <div className="absolute z-10 bottom-6 left-0 right-0 flex justify-center text-white">
        <div className="mx-1">
          <ActionButton
            isOn={isAudioOn}
            icon={"audio"}
            onClick={() => {
              service.send("TOGGLE_AUDIO");
            }}
          />
        </div>
        <div className="mx-1">
          <ActionButton
            isOn={isVideoOn}
            icon={"video"}
            onClick={() => {
              service.send("TOGGLE_VIDEO");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EntryVideo;
