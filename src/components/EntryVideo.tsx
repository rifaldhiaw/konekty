import { useEffect, useRef } from "react";
import { debounce } from "throttle-debounce";
import invariant from "tiny-invariant";
import { useMainService } from "../machines/mainMachine";
import { mediaService, useMediaService } from "../machines/mediaMachine";
import ActionButton from "./ActionButton";
import { videoRatio } from "./VideosSection";

const EntryVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const isInitializing = useMainService((s) => s.matches("initializing"));

  const localStream = useMediaService((s) => s.context.localMediaStream);
  const isAudioOn = useMediaService((s) => s.context.localAudioStatus);
  const isVideoOn = useMediaService((s) => s.context.localVideoStatus);

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
    const listener = debounce(100, () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = w ? w * videoRatio : 0;
      const fixedH = Math.floor(h);
      containerRef.current.style.height = fixedH + "px";
    });

    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

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
          playsInline={true}
          className="object-cover w-full h-full flip bg-black"
          ref={videoRef}
        ></video>
      </div>

      <div className="absolute z-10 bottom-4 md:bottom-6 left-0 right-0 flex justify-center text-white">
        <div className="mx-1">
          <ActionButton
            outline={true}
            isOn={isAudioOn}
            icon={"audio"}
            onClick={() => {
              mediaService.send("TOGGLE_AUDIO");
            }}
          />
        </div>
        <div className="mx-1">
          <ActionButton
            outline={true}
            isOn={isVideoOn}
            icon={"video"}
            onClick={() => {
              mediaService.send("TOGGLE_VIDEO");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EntryVideo;
