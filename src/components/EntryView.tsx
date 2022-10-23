import LocalVideo from "./LocalVideo";

const EntryView = () => {
  return (
    <div className="flex">
      <div className="flex flex-1">
        <LocalVideo />
      </div>
      <div className="flex flex-1">Hi Mom</div>
    </div>
  );
};

export default EntryView;
