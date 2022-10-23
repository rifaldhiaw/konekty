import ActionButton from "./ActionButton";
import LocalVideo from "./LocalVideo";

const EntryView = () => {
  return (
    <div className="flex container">
      <div className="flex w-7/12 relative">
        <LocalVideo />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center text-white">
          <div className="mx-1">
            <ActionButton isOn={true} icon={"audio"} onClick={() => {}} />
          </div>
          <div className="mx-1">
            <ActionButton isOn={false} icon={"video"} onClick={() => {}} />
          </div>
        </div>
      </div>
      <div className="w-5/12">Hi Mom</div>
    </div>
  );
};

export default EntryView;
