import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "throttle-debounce";
import { useMainService } from "../machines/mainMachine";
import { useMediaService } from "../machines/mediaMachine";
import LocalVideo from "./LocalVideo";
import RemoteAudio from "./RemoteAudio";
import RemoteVideo from "./RemoteVideo";

const aspectOptions = ["4:3", "16:9"];

export const videoRatio = (() => {
  const aspectRatio = aspectOptions[1].split(":").map((v) => parseInt(v, 10));
  return aspectRatio[1] / aspectRatio[0];
})();

// tailwind gap-5 (20px) implemented in container
const videoMargin = 10;
const sidebarWidth = 430;

const useElementSize = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  useEffect(() => {
    setW(ref.current?.offsetWidth ?? 0);
    setH(ref.current?.offsetHeight ?? 0);

    const listener = debounce(100, () => {
      setW(ref.current?.offsetWidth ?? 0);
      setH(ref.current?.offsetHeight ?? 0);
    });

    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return [w, h];
};

const VideosSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [conW, conH] = useElementSize(containerRef);

  const sidebarHidden = useMainService((s) => s.context.sidebarMode === "none");
  const userStreamData = useMediaService((s) => s.context.userData);

  const totalUser = userStreamData.length + 1;

  const videoW = useMemo(() => {
    const newW =
      conW - (sidebarHidden || window.innerWidth < 1024 ? 0 : sidebarWidth);

    const isAreaOverContainer = (increment: number) => {
      let w = 0;
      let h = increment * videoRatio + videoMargin * 2;

      for (let i = 0; i < totalUser; i++) {
        if (w + increment > newW) {
          w = 0;
          h = h + increment * videoRatio + videoMargin * 2;
        }
        w = w + increment + videoMargin * 2;
      }

      return h > conH || increment > newW;
    };

    let max = 0;
    let i = 50;
    while (i < 5000) {
      if (isAreaOverContainer(i)) {
        max = i - 1;
        return max;
      }
      i += 2;
    }

    return 0;
  }, [conW, conH, sidebarHidden, totalUser]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center m-5"
    >
      <div className="absolute flex flex-1 gap-3 items-center content-center justify-center align-middle flex-wrap">
        <div style={{ width: videoW, height: videoW * videoRatio }}>
          <div className="w-full h-full rounded-3xl shadow bg-base-100 p-2">
            <div className="card h-full w-full">
              <LocalVideo />
            </div>
          </div>
        </div>
        {userStreamData.map((user) => (
          <div
            key={user.id}
            style={{ width: videoW, height: videoW * videoRatio }}
          >
            <div className="w-full h-full rounded-3xl shadow bg-base-100 p-2">
              <div className="card h-full w-full">
                <RemoteVideo stream={user.stream} name={user.name} />
                <RemoteAudio stream={user.stream} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosSection;
