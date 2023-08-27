const VideoPlaceholder = (props: { name: string }) => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-base-100">
      <div className="avatar placeholder">
        <div className="bg-base-300 rounded-full w-32">
          <span className="text-6xl font-semibold">
            {props.name?.[0].toUpperCase() ?? ""}
          </span>
        </div>
      </div>
      <div className="absolute drop-shadow-md bottom-2 left-5">
        {props.name}
      </div>
    </div>
  );
};

export default VideoPlaceholder;
