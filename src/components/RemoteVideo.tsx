import { memo, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import VideoPlaceholder from "./VideoPlaceholder";

const RemoteVideo = (props: {
  stream: MediaStream | undefined;
  name: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isvideoOn, setIsvideoOn] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !props.stream) return;

    videoRef.current.srcObject = props.stream;
    videoRef.current.onloadedmetadata = () => {
      invariant(videoRef.current);
      videoRef.current.play();
    };
  }, [props.stream]);

  useEffect(() => {
    const video = props.stream?.getVideoTracks()[0];
    if (!video) return;

    video.onmute = () => setIsvideoOn(false);
    video.onunmute = () => setIsvideoOn(true);
  }, [props.stream]);

  const shouldShowPlaceholder =
    !isvideoOn || !props.stream || props.stream.getVideoTracks().length === 0;

  return (
    <div className="w-full h-full">
      <video
        className={
          "object-cover w-full h-full bg-base-200" +
          (isvideoOn ? "" : " hidden")
        }
        ref={videoRef}
      ></video>
      <div className="absolute drop-shadow-md text-white bottom-2 left-5">
        {props.name}
      </div>
      {shouldShowPlaceholder && <VideoPlaceholder name={props.name} />}
    </div>
  );
};

const RemoteVideoMemo = memo(RemoteVideo);

export default RemoteVideoMemo;
