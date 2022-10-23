import LocalVideo from "./LocalVideo";

const EntryView = () => {
  return (
    <div className="flex container px-8">
      <div className="flex w-7/12 relative">
        <LocalVideo />
      </div>
      <div className="w-5/12 flex justify-center items-center">Hi Mom</div>
    </div>
  );
};

export default EntryView;
